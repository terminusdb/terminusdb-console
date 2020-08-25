import React, {useEffect, useState} from 'react'

import { CloneDB, ForkDB, DeleteDB, RejectInvite, AcceptInvite, isLocalURL, isHubURL } from '../../components/Query/CollaborateAPI'
import {DBList, DBSummaryCard} from '../Server/DBList'
import {useAuth0} from '../../react-auth0-spa'
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import {DBListControl} from "../Server/DBListControl"
import {CloneHubHeader} from "../CreateDB/DBCreateCard"

import { TERMINUS_INFO, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_SUCCESS, TERMINUS_COMPONENT } from "../../constants/identifiers";
import { LIST_LOCAL, LIST_REMOTE, CLONE, CLONEDBS } from "./constants.pages"
import {CloneURL} from '../Server/CloneURL'
import Select from "react-select";
import {Row, Col} from "reactstrap"
import {CreateDatabase} from "../CreateDB/CreateDatabase"
import Loading from "../../components/Reports/Loading"
import {HubRecord} from "../DBSynchronize/HubRecord"
import { validURL } from '../../utils/helperFunctions';



const ClonePage = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let user = woqlClient.user()
   
    return (
        <SimplePageView  id="clonePage" >
            <DBListControl  key="ja" list={CLONEDBS} type='clone' user={user} count={CLONEDBS.length}/>
        </SimplePageView>
    )
}

export const CloneListControl = ({list, className, user, type, sort, filter}) => {
    if(!list || !user ) return null
    const { woqlClient,  refreshDBRecord, refreshDBListing, bffClient, remoteClient } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()    
    let [special, setSpecial] = useState(false)
    const [listSort, setSort] = useState(sort || "updated")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()
    const [shares, setShares] = useState([])
    const [shareFilter, setShareFilter] = useState(filter || "")
    const [shareSort, setShareSort] = useState(filter || "")
    const [loading, setLoading] = useState()
    const [bump, setBump] = useState(0)
    const [publisher, setPublisher] = useState("")

    useEffect(() => {
        if(listSort){
            let filt = _filter_list(list, listFilter)
            setSorted(_sort_list(filt, listSort))
        }
    }, [listSort, listFilter])

    useEffect(() => {
        if(publisher){
            bffClient.getOrganization(publisher)
        }
    }, [publisher])


    useEffect(() => {
        if(bffClient){
            if(!shareFilter){
                let u = bffClient.user()
                let dbl = []
                if(u.invites){
                    dbl = _invites_to_cards(u.invites, remoteClient.server())
                }
                if(sorted){
                    dbl = dbl.concat(sorted)           
                }

                setShares(dbl)            
            }
            else if(shareFilter == "recommendations"){
                if(sorted) setShares(sorted)
            }
            else if(shareFilter == "invitations"){
                let u = bffClient.user()           
                setShares(_invites_to_cards(u.invites))
            }
        }
    }, [shareFilter, shareSort, sorted, bump])

    useEffect(() => {
        let filt = _filter_list(list, listFilter)
        if(listSort){
            setSorted(_sort_list(filt, listSort))
        }
        else {
            setSorted(list)
        }
    }, [list])


    let message = ""
    if(type == 'clone'){
        message = CLONE
    }
    else {
        message = user.logged_in ?  LIST_REMOTE : LIST_LOCAL 
    }
    let [report, setReport] = useState({status: TERMINUS_INFO,  message: message})
    
    function setAction(dbmeta){
        let db = _copy_db_card(dbmeta)
        if(db.action == 'hub'){
            setSpecial({action:db.action, meta: db})            
        }
        else if(db.action == 'accept'){
            setLoading(true)
            AcceptInvite(db, woqlClient, bffClient, getTokenSilently)
            .then(() => {
                removeProcessedInvite(db)
                setBump(bump+1)
                CloneDB(db, woqlClient, getTokenSilently)
                .then((id) => {
                    setSpecial(false)
                    setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                    refreshDBRecord(id, woqlClient.user_organization(), 'clone', db.remote_record)
                    .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
                })
            })
            .finally(() => setLoading(false))
        }
        else if(db.action == 'reject'){
            setLoading(true)
            RejectInvite(db, woqlClient, bffClient, getTokenSilently)
            .then(() => {
                setReport({status: TERMINUS_SUCCESS, message: "Invitation Rejected"})
                removeProcessedInvite(db)
                setBump(bump+1)
            })
            .finally(() => setLoading(false))
        }
        else if(db.action == 'clone'){
            setLoading(true)
            CloneDB(db, woqlClient, getTokenSilently)
            .then((id) => {
                setSpecial(false)
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                refreshDBRecord(id, woqlClient.user_organization(), 'clone', db.remote_record)
                .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
            })
            .finally(() => setLoading(false))
        }        
    }

    function removeProcessedInvite(dbrec){
        let ninvites = []
        let rr = dbrec.remote_record || {}
        let oinvites = bffClient.connection.user.invites || []
        for(var i = 0; i<oinvites.length; i++){
            let or = oinvites[i]
            if(!(rr.id == or.id && rr.organization == or.organization)){
                ninvites.push(oinvites[i])
            }
        }
        bffClient.connection.user.invites = ninvites
    }

    function cloneURL(url){
        if(url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://"){
            let db = {action: 'clone'}            
            db.id = url.substring(url.lastIndexOf("/")+1)
            if(woqlClient.server() == url.substring(0, woqlClient.server().length)){
                let edb = woqlClient.get_database(db.id, woqlClient.user_organization())
                db.label = edb.label
                db.comment = edb.comment   
            }
            else {
                db.label = db.id
                db.comment = ""
            }
            db.remote_url = url
            setAction(db)
        }
        else return "You must supply a valid URL"
    }

    function callSort(nsort){
        setSort(nsort.value)
    }

    function callFilter(nfilt){
        setFilter(nfilt.value)
    }

    function callShareSort(nfilt){
        alert(nfilt.value)
    }

    function callShareFilter(nfilt){
        setShareFilter(nfilt.value)
    }

    function callPublisherPicker(v){
        setPublisher(v)
    }

    function doURLTry(u){
        if(isLocalURL(u, woqlClient)){
            let did = u.substring(u.lastIndexOf("/")+1)
            alert(did)
            let ded = woqlClient.get_database(did, woqlClient.user_organization())
            if(ded){
                goDBHome(ded, woqlClient.user_organization())
            }
        }
        else if(isLocalURL(u, remoteClient)){
            let bits = u.split("/")
            let did = bits[bits.length-1]
            let oid = bits[bits.length-2]
            setSpecial({action: "hub", meta: {id: did, organization: oid}})
        }
    }

    if(!sorted) return null
    if(loading) return (<Loading type={TERMINUS_COMPONENT}/>)
    return (<>
            {(special && special.action == "hub") && 
                <HubRecord meta={special.meta} />
            }
            {!special && <>
                {type == 'clone' && 
                    <Row>
                        <Col>
                            <PublisherPicker onSubmit={callPublisherPicker} />
                        </Col>
                        <Col>
                        <URLPicker onSubmit={doURLTry} />
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                }
                {type == 'clone' && (shareFilter == "clone") &&                   
                    <CloneURL onClone={cloneURL} />
                }
                {type == 'clone' && (shareFilter != "clone") && shares && shares.length && 
                    <DBList list={shares} className={className} user={user} onAction={setAction}/>            
                }
        </>}
    </>)
}

export const ListFilter = ({filter, onChange, logged_in}) => {
    if(!logged_in) return null
    let filters = [
        {value: "", label: "Show all"},
        {value: "remote", label: "Hub Databases"},
        {value: "public", label: "Public Databases"},
        {value: "local", label: "Local Databases"},
        {value: "missing", label: "Databases Only on Hub"},
        {value: "unsynched", label: "Need Synchronisation"},
    ]
    return (
        <Select 
            options={filters}
            placeholder = "Filter listings"
            defaultValue= {filter}
            onChange ={onChange}
        />)
}

export const ShareFilter = ({filter, onChange}) => {
    let filters = [
        {value: "", label: "Invitations and Suggestions"},
        {value: "recommended", label: "Recommendations"},
        {value: "invitations", label: "Invitations"},
    ]
    return (
        <Select 
            options={filters}
            placeholder = "Invitations and Suggestions"
            defaultValue= {filter}
            onChange ={onChange}
        />)
}

export const ShareSorter = ({sort, logged_in, onChange}) => {
    return null
}

const PublisherPicker = ({onSubmit}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value) onSubmit(event.target.value)
    }
    return (
        <span>
            <input placeholder="publisher id" onKeyPress={checkKeys}/>
        </span>
    )
}

const URLPicker = ({onSubmit}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value && validURL(event.target.value)) onSubmit(event.target.value)
    }
    return (
        <span>
            <input placeholder="publisher id" onKeyPress={checkKeys}/>
        </span>
    )
}


export const ListSorter = ({sort, logged_in, onChange}) => {
    let local_sort_algos = [
        {value: "updated", label: "Most recent update"},
        {value: "oldest", label: "Least recent update"},
        {value: "created", label: "Database Creation Time"},
        {value: "name", label: "Database Name"},
        {value: "size", label: "Database Size"}
    ]

    let remote_sort_algos = [
        {value: "organization", label: "Publisher"},
        {value: "updated local", label: "Local Update Time"},
        {value: "updated remote", label: "Remote Update Time"},
    ]

    if(logged_in){
        var sorts = local_sort_algos.concat(remote_sort_algos)
    }
    else {
        var sorts = local_sort_algos
    }
    return (
        <Select 
            options={sorts}
            placeholder = "Sort Listings"
            defaultValue= {sort}
            onChange ={onChange}
        />)
}

function _filter_list(unfiltered, filter){
    let filtf
    if(filter == ""){
        filtf = function(){return true}
    }
    if(filter == "remote"){
        filtf = function(dbrec){
            if(dbrec.remote_record) return true
            return false
        }
    }
    if(filter == "local"){
        filtf = function(dbrec){
            if(dbrec.remote_record) return false
            return true
        }
    }
    if(filter == "missing"){
        filtf = function(dbrec){
            if(dbrec.id) return false
            return true
        }
    }
    if(filter == "unsynched"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.ahead || dbrec.behind || dbrec.structure_mismatch) return true
            return false
        }
    }
    if(filter == "recommended"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.invitation) return false
            return false
        }
    }
    if(filter == "invitations"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.invitation) return true
            return false
        }
    }
    if(filter == "public"){
        filtf = function(dbrec){
            if(dbrec.public) return true
            if(dbrec.remote_record && dbrec.remote_record.public) return true
            return false
        }
    }
    if(filtf){
        return unfiltered.filter(filtf)
    }
    else {
        return unfiltered
    }
}

function _sort_list(unsorted, listSort){
    let sortf
    if(listSort == 'updated'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            if(a.remote_record && a.remote_record.updated > lts) lts = a.remote_record.updated 
            if(b.remote_record && b.remote_record.updated > rts) rts = b.remote_record.updated 
            if(rts == lts){
                lts = a.updated || 0
                rts = b.updated || 0
            }
            return (rts - lts)
        }
    }
    else if(listSort == 'oldest'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            if(a.remote_record && a.remote_record.updated > lts) lts = a.remote_record.updated 
            if(b.remote_record && b.remote_record.updated > rts) rts = b.remote_record.updated 
            return lts - rts
        }
    }
    else if(listSort == 'updated local'){
        sortf = function(a, b){
            var lts = (a.id ? (a.updated || 0) : 0)
            var rts = (b.id ? (b.updated || 0) : 0)
            return rts - lts 
        }
    }
    else if(listSort == 'updated remote'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                var lts = a.remote_record.updated || 0                
                var rts = b.remote_record.updated || 0                
                return rts - lts
            }
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return rts - lts
        }
    }
    else if(listSort == 'size'){
        sortf = function(a, b){
            var lts = a.size || 0
            var rts = b.size || 0
            return rts - lts
        }
    }
    else if(listSort == 'organization'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                return b.remote_record.organization_label - b.remote_record.organization_label
            }
        }
    }
    else if(listSort == 'name'){
        sortf = function(a, b){
            if(a.label && b.label){
                if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
                if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
                return 0;
            }
        }
    }
    if(sortf){
        return unsorted.sort(sortf)
    }
    else {
        return unsorted
    }
}

function _invites_to_cards(invites, srvr){
    let cards = []
    for(var i = 0; i<invites.length; i++){
        let oni = _invite_to_card(invites[i], srvr)
        if(oni) cards.push(oni)
    }
    return cards
}

function _invite_to_card(inv, srvr){
    let nlocal = {id: "", "organization":"admin", label: inv.label, "comment": inv.comment }
    nlocal.type = "invite"
    nlocal.remote_record = inv
    nlocal.remote_url = srvr + inv.organization + "/" + inv.id
    nlocal.actions = ['clone']
    return nlocal
}    


function _copy_db_card(card){
    let ncard = {}
    for(var k in card){
        if(Array.isArray(card[k])){
            ncard[k] = []
            for(var i = 0; i<card[k].length; i++){
                if(typeof card[k][i] == "object"){
                    ncard[k].push(_copy_db_card(card[k][i]))   
                }
                else {
                    ncard[k].push(card[k][i])
                }                
            }
        }
        else if(typeof card[k] == "object"){
            ncard[k] = _copy_db_card(card[k])   
        }
        else {
            ncard[k] = card[k]
        }
    }
    return ncard
}


export default ClonePage
