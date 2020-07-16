import React, {useState, useEffect} from "react";
import { CloneDB, ForkDB } from '../../components/Query/CollaborateAPI'
import {DBList, DBSummaryCard} from './DBList'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {useAuth0} from '../../react-auth0-spa'
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { TERMINUS_INFO, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_SUCCESS } from "../../constants/identifiers";
import { LIST_LOCAL, LIST_REMOTE, CLONE } from "../Pages/constants.pages"
import {CloneURL} from './CloneURL'
import Select from "react-select";
import {Row, Col} from "reactstrap"
import {CreateDatabase} from "../CreateDB/CreateDatabase"


export const DBListControl = ({list, className, user, type, sort, filter}) => {
    if(!list || !user ) return null
    const { woqlClient,  refreshDBRecord, bffClient } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()    
    let [special, setSpecial] = useState(false)
    const [listSort, setSort] = useState(sort || "updated")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()

    useEffect(() => {
        if(listSort){
            let filt = _filter_list(list, listFilter)
            setSorted(_sort_list(filt, listSort))
        }
    }, [listSort, listFilter])

    let message = ""
    if(type == 'clone'){
        message = CLONE
    }
    else {
        message = user.logged_in ?  LIST_REMOTE : LIST_LOCAL 
    }
    let [report, setReport] = useState({status: TERMINUS_INFO,  message: message})
    
    function setAction(db){
        if(db.action == 'synchronise'){
            goDBPage(db.id, woqlClient.user_organization(), "synchronise")
        }
        if(db.action == 'share'){
            setSpecial({action:db.action, meta: db})
        }
        else if(db.action == 'clone'){
            //db.remote_url = db.remote_record.url
            CloneDB(db, woqlClient, getTokenSilently)
            .then((id) => {
                setSpecial(false)
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                refreshDBRecord(id, woqlClient.user_organization(), 'clone', db)
                .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
            })
        }
        else if(db.action == 'fork'){
            //db.remote_url = db.remote_record.url
            let nuid = db.remote_url.substring(db.remote_url.lastIndexOf("/") + 1)
            db.id = get_fork_id(nuid, bffClient, bffClient.user_organization())
            db.organization = user.remote_id 
            ForkDB(db, woqlClient, bffClient, getTokenSilently)
            .then((id) => {
                setSpecial(false)
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Forked Database"})
                refreshDBRecord(id, woqlClient.user_organization(), 'clone', db)
                .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
            })
        }
    }

    function get_fork_id(nid, client, orgid){
        let add = 0
        let ext = nid
        while(client.get_database(ext, orgid)){
            ext = nid + "_" + (++add)
        }
        return ext
    }

    function import_db_card(db, id){
        db.id = id
        db.organization = woqlClient.user_organization()
        db.created = Date.now()
        db.updated = Date.now()
        db.author = woqlClient.author()
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


    if(!sorted) return null
    return (<>
            {special && <>
                <span className="database-list-intro" onClick={function(){setSpecial(false)}}>
                    back to database list
                </span>
                <DBSummaryCard meta={special.meta} user={user} />
                <CreateDatabase from_local={special.meta} className={className}/>
            </>}
            {!special && <>
                <span className="database-list-intro">
                    <TerminusDBSpeaks report={report} />
                </span>
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                    {type == 'clone' && 
                        <ShareFilter filter={listFilter} logged_in={user.logged_in} onChange={callFilter} />
                    }
                    {type != 'clone' && 
                        <ListFilter filter={listFilter} logged_in={user.logged_in} onChange={callFilter} />
                    }
                    </Col>
                    <Col>
                        <ListSorter sort={listSort} logged_in={user.logged_in} onChange={callSort} />
                    </Col>
                </Row>
                <DBList list={sorted} className={className} user={user} onAction={setAction}/>            
                {type == 'clone' && <>
                    <span className="database-list-intro">
                        <TerminusDBSpeaks report={{status: TERMINUS_INFO, message: "You can also clone a database directly from a URL"}} />
                    </span>
                    <CloneURL onClone={cloneURL} />
                </>}
            </>}
        </>
    )
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
        {value: "", label: "Show all"},
        {value: "recommended", label: "Recommendations"},
        {value: "invitations", label: "Invitations"},
        {value: "public", label: "Public Databases"}
    ]
    return (
        <Select 
            options={filters}
            placeholder = "Filter listings"
            defaultValue= {filter}
            onChange ={onChange}
        />)
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
            if(dbrec.recommended) return true
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
            var lts = a.updated || 0
            var rts = b.updated || 0
            return lts - rts 
        }
    }
    else if(listSort == 'updated remote'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                var lts = b.remote_record.updated || 0                
                var rts = a.remote_record.updated || 0                
                return rts - lts
            }
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return lts - rts
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
    if(sortf){
        return unsorted.sort(sortf)
    }
    else if(listSort == 'name'){
        return unsorted.sort(sortf)
    }
    else {
        return unsorted
    }
}

