import React, {useEffect, useState} from 'react'

import { CloneDB, ForkDB, DeleteDB, RejectInvite, AcceptInvite, UpdateDatabase, isLocalURL, isHubURL, RefreshDatabaseRecord } from '../../components/Query/CollaborateAPI'
import {DBList, DBSummaryCard} from '../Server/DBList'
import {useAuth0} from '../../react-auth0-spa'
import {goDBPage, goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import {DBListControl} from "../Server/DBListControl"
import { AiFillLock, AiOutlineFork, AiOutlineCloudDownload, AiOutlineCheckCircle, AiOutlineCopy, AiFillWarning,
    AiFillCrown, AiFillEdit, AiOutlineStar, AiFillCheckCircle,AiOutlineThunderbolt,
    AiOutlineLink, AiOutlineMail, AiFillInfoCircle, AiOutlineUser, AiOutlineInbox, AiOutlineExclamation, AiFillBuild, AiOutlineInfoCircle,
    AiOutlineGlobal, AiOutlineBell, AiOutlineBranches, AiOutlineSchedule, AiOutlineDelete, AiFillDatabase, AiOutlineWarning} from 'react-icons/ai';
import {useForm} from 'react-hook-form'
import { TERMINUS_INFO, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_SUCCESS, TERMINUS_COMPONENT } from "../../constants/identifiers";
import { LIST_LOCAL, LIST_REMOTE, CLONE, CLONEDBS } from "./constants.pages"
import { CloneURL } from '../Server/CloneURL'
import Select from "react-select";
import Loading from "../../components/Reports/Loading"
import { validURL } from '../../utils/helperFunctions';
import { GRAPHDB, HUBDB } from "../../constants/images"
import { BsBook, BsFillEnvelopeFill } from 'react-icons/bs';
import { GiMeshBall } from 'react-icons/gi';
import moment from 'moment';
import { printts } from "../../constants/dates"
import { DATETIME_COMPLETE, DATETIME_DB_UPDATED, DATETIME_REGULAR, DATE_REGULAR } from "../../constants/dates"
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {DBCreateCard} from "../CreateDB/DBCreateCard"
import { CloneLocal } from "../CreateDB/CloneDatabase"
import { RiDeleteBin5Line } from 'react-icons/ri';
import {Button, Row, Container, Modal, ModalHeader, ModalBody, Col, ModalFooter} from 'reactstrap'
import {DELETE_DB_MODAL} from '../DBHome/constants.dbhome'
import { isFuture } from 'date-fns'
import { json } from '../../../../terminusdb-client/lib/woql'

const ClonePage = ({organization, db}) => {
    let list = (organization || db ? false : CLONEDBS)
    return (
        <SimplePageView id="clonePage">
            <CloneController organization={organization} db={db} list={list} />
        </SimplePageView>
    )
}

export const CloneController = ({list, db, organization, meta}) => {
    let [currentDB, setCurrentDB] = useState(meta)
    let [dbid, setDBid] = useState(db)
    let [orgid, setOrgid] = useState(organization)
    let [currentList, setCurrentList] = useState(list)
    let [loading, setLoading] = useState()
    let [report, setReport] = useState()

    const { woqlClient,  refreshDBRecord, refreshDBListing, bffClient, remoteClient } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()    
    
    if(!woqlClient || !bffClient) return null

    function loadNewStuff(org, db){
        setOrgid(false)
        setDBid(false)
        setCurrentDB()
        setOrgid(org)
        setDBid(db)

    }

    useEffect(() => {   
        if(dbid && orgid){
            setLoading(true)
            setReport()
            RefreshDatabaseRecord({id: dbid, organization: orgid}, bffClient, getTokenSilently)
            .then((xmeta) => setCurrentDB(xmeta))
            .catch((e) => reportDB404(orgid, dbid, e))
            .finally(() => setLoading(false))
        }
        else if(orgid && !dbid){
            setLoading(true)
            setReport()
            bffClient.getOrganization(orgid)
            .then((res) => {
                processOrganizationListing(orgid, res)
            })
            .catch((e) => reportOrganization404(orgid, e))
            .finally(() => setLoading(false))
        }
        else if(!orgid && !dbid){
            if(list) setCurrentList(list)
            else if(meta) setCurrentDB(meta)
        }
    }, [dbid, orgid])

    function processOrganizationListing(o, res){
        if(o == "invitations") setCurrentList(res)
        else if(res.databases){
            setCurrentList(res.databases)
        }
        else {
            reportOrganization404(o)
        }
    }

    function fireAction(dbmeta, onComplete, onError){
        let db = _copy_db_card(dbmeta)
        if(db.action == 'load'){
            loadNewStuff(dbmeta.organization, dbmeta.id)
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
            let pred = (db.auto ? false : true)
            CloneDB(db, woqlClient, getTokenSilently, false, pred)
            .then((id) => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                refreshDBRecord(id, woqlClient.user_organization(), 'clone', db.remote_record)
                .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
            })
            .catch((e) => {
                console.log(e)
                setReport({status: TERMINUS_ERROR, message: "Failed to clone database", error: e})
            })
            .finally(() => setLoading(false))
        }
        if(db.action == 'fork'){
            setLoading(true)
            ForkDB(db, woqlClient, bffClient, getTokenSilently, true)
            .then(() => {
                loadNewStuff()
                goHubPage(db.organization, db.id)
            })
            .catch((e) => {
                setReport({status: TERMINUS_ERROR, message: "Failed to fork database", error: e})
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


    function reportOrganization404(org, e){
        setReport({status: TERMINUS_ERROR, message: "Publisher not found", error: e})
    }

    function reportDB404(db, org, e){
        setReport({status: TERMINUS_ERROR, message: "Database not found", error: e})
    }

    function reportComponentError(code, str){
        setReport({status: TERMINUS_ERROR, message: "Database not found " + str, error: e})
    }

    function refreshHub(orgid, dbid){
        loadNewStuff(orgid, dbid)
        goHubPage(orgid, dbid)
    }

    if(currentDB){
        let url = remoteClient.server() + currentDB.organization + "/" + currentDB.id
        return (
            <div>
                <DBHubHeader organization={orgid} url={url} meta={currentDB} onChange={refreshHub} onError={reportComponentError}/>
                {loading &&  <Loading />}
                    <Row className="generic-message-holder">
                        {report && 
                            <TerminusDBSpeaks report={report} />
                        }
                    </Row>
                    <HubDBCard meta={currentDB} onAction={fireAction}/>
            </div>
        )
    }
    else if(currentList){
        return (
            <div className="tdb__loading__parent">
                <CloneHubHeader organization={orgid} list={currentList} onChange={refreshHub} onError={reportComponentError}/>
                {loading &&  <Loading type={TERMINUS_COMPONENT} />}
                <Row className="generic-message-holder">
                    {report && 
                        <TerminusDBSpeaks report={report} />
                    }
                </Row>
                <CloneListControl list={currentList} onAction={fireAction} />
            </div>
        )    
    }
    else {
        return (<div className="tdb__loading__parent">
            {loading &&  <Loading type={TERMINUS_COMPONENT} />}
            <Row className="generic-message-holder">
                {report && 
                    <TerminusDBSpeaks report={report} />
                }
            </Row>
        </div>)
    }
}

export const CloneHubHeader = ({organization, list, onChange, onError}) => {
    return (<>
        <div className='database-create-header'>
            <HubPicture />
            <span className='database-listing-header-row'>
                <span key='a' className="database-header-title">Share, Clone and Collaborate with Terminus Hub</span>
            </span>
        </div>
        <HubToolbar onChange={onChange} onError={onError} organization={organization}/>
    </>) 
}

export const DBHubHeader = ({organization, url, meta, onChange, onError}) => {
    let text = "This database is stored on Terminus Hub" 
    return (<>
        <div className='database-create-header'>
            <HubPicture />
            <span className='database-listing-header-row'>
                <span key='a' className="database-header-title">Terminus Hub Database</span>
            </span>
        </div>
        <HubToolbar onChange={onChange} onError={onError} url={url} organization={organization}/>
    </>)    
}

export const HubToolbar = ({onChange, onError, organization, url}) => {
    const { woqlClient, remoteClient } = WOQLClientObj()
    function goInvites(){
        onChange("invitations")
    }
    
    function goInvites(){
        onChange("invitations")
    }
    
    function goRecommendations(){
        onChange("recommendations")
    }

    function doURLTry(u){
        if(!validURL(u)){
            return alert("Not a valid URL")
        }
        if(isLocalURL(u, woqlClient)){
            let did = u.substring(u.lastIndexOf("/")+1)
            let ded = woqlClient.get_database(did, woqlClient.user_organization())
            if(ded){
                goDBHome(ded, woqlClient.user_organization())
            }
            else {
                onError(404, `Local database ${u} does not exist`)
            }
        }
        else if(isLocalURL(u, remoteClient)){
            let bits = u.split("/")
            let did = bits[bits.length-1]
            let oid = bits[bits.length-2]
            onChange(oid, did)
        }
        else {
            onChange("clone", url)
        }
    }

    return (
        <Row className="hub-toolbar">
            <span className="hub-toolbar-col hub-recommendations-col">
                <RecommendationsLinker organization={organization} onSubmit={goRecommendations}/>
            </span>
            <span className="hub-toolbar-col hub-invitations-col">
                <InvitationsLinker organization={organization} onSubmit={goInvites}/>
            </span>
            <span className="hub-toolbar-col publisher-picker-col">
                <PublisherPicker onSubmit={onChange} organization={organization} />
            </span>
            <span className="hub-toolbar-col url-picker-col">
                <URLPicker url={url} onSubmit={doURLTry} />
            </span>
        </Row>
    )
}


const PublisherPicker = ({onSubmit, organization}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value) {
            onSubmit(event.target.value)
        }
    }
    let ph = "Enter Publisher ID"

    return (
        <span className='hub-inputbar publisher-picker'>
            <AiOutlineUser className="hub-bar-spacing"/>
            <input 
                type="text"
                defaultValue={organization}
                className='publisher-picker-input' 
                placeholder={ph} 
                onKeyPress={checkKeys}
            />
        </span>
    )
}

const URLPicker = ({onSubmit, url}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value && validURL(event.target.value)) onSubmit(event.target.value)
    }
    return (
        <span className='hub-inputbar url-picker'>
            <AiOutlineLink className="hub-bar-spacing"/>
            <input 
                type="text"
                defaultValue={url}
                className='url-picker-input' 
                placeholder="Enter Database URL" 
                onKeyPress={checkKeys}
            />
        </span>
    )
}

const InvitationsLinker = ({organization, onSubmit}) => {
    if(organization == "invitations"){
        return(
            <span title="Invitations" className='hub-inputbar hub-active-link'>
                <AiOutlineMail className="hub-active-icon active-mail hub-bar-spacing"/> Invitations
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View Latest Invitations" className='hub-inputbar hub-link'>
            <AiOutlineMail className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Invitations
        </span>
    )
}

const RecommendationsLinker = ({organization, onSubmit}) => {
    if(organization == "recommendations"){
        return (
            <span title="Recommendations" className='hub-inputbar hub-active-link'>
                <AiOutlineStar className="hub-active-icon active-star hub-bar-spacing"/> Recommendations
            </span>
        )
    }
    return (
        <span  title="View Latest Recommendations" onClick={onSubmit} className='hub-inputbar hub-link'>
            <AiOutlineStar className="hub-inactive-icon inactive-star hub-bar-spacing"/> Recommendations
        </span>
    )
}


const HubPicture = ({title}) => {
    let icon = HUBDB
    title = title || "Terminus Hub Database"
    return (<img className='database-header-image' src={icon} title={title}  />)
}

export const CloneListControl = ({list, onAction, organization, sort, filter}) => {
    if(!list) return null
    const [listSort, setSort] = useState(sort || "updated")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()

    useEffect(() => {
        if(listSort && list){
            let filt = _filter_list(list, listFilter)
            setSorted(_sort_list(filt, listSort))
        }
    }, [listSort, listFilter])

    useEffect(() => {
        let filt = _filter_list(list, listFilter)
        if(listSort){
            setSorted(_sort_list(filt, listSort))
        }
        else {
            setSorted(list)
        }
    }, [list])

    function callSort(nsort){
        setSort(nsort.value)
    }

    function callFilter(nfilt){
        setFilter(nfilt.value)
    }
    if(!sorted) return null
    let show_header = list.length > 10;

    return (<>
        {show_header && 
            <Row className='db-list-filter-bar'>
                <Col></Col>
                <Col></Col>
                <Col>
                </Col>
                <Col>
                    <ListSorter sort={listSort} onChange={callSort}  organization={organization}  />
                </Col>
            </Row>
        }
        <CloneList list={sorted} onAction={onAction}/>            
  </>)
}

export const ListFilter = ({filter, onChange, organization}) => {
    if(organization == "invitations") return <InvitationFilter filter={filter} onChange={onChange}/>
    let filters = [
        {value: "", label: "Show all"},
        {value: "public", label: "Public Databases"},
        {value: "private", label: "Private Databases"},
        {value: "local", label: "Databases I have locally"},
        {value: "hub", label: "Databases I don't have locally"},
        {value: "unsynched", label: "Need Synchronisation"}
    ]

    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label  
    }

    return (
        <Select 
            options={filters}
            placeholder = {ph}
            defaultValue= {filter}
            onChange={onChange}
        />
    )
}

export const InvitationFilter = ({filter, onChange, organization}) => {
    let filters = [
        {value: "", label: "Pending Invitations"},
        {value: "accepted", label: "Accepted Invitations"},
        {value: "rejected", label: "Rejected Invitations"},
    ]
    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label  
    }
    return (
        <Select 
            options={filters}
            placeholder = {ph}
            defaultValue= {filter}
            onChange={onChange}
        />)
}


function _filter_list(unfiltered, filter){
    let filtf
    if(filter == ""){
        filtf = function(){return true}
    }
    if(filter == "hub"){
        filtf = function(dbrec){
            if(dbrec.local_copies) return false
            return true
        }
    }
    if(filter == "local"){
        filtf = function(dbrec){
            if(dbrec.local_copies) return true
            return true
        }
    }
    if(filter == "rejected"){
        filtf = function(dbrec){
            if(dbrec.id) return false
            return true
        }
    }
    if(filter == "unsynched"){
        filtf = function(dbrec){
            if(dbrec.ahead || dbrec.behind || dbrec.structure_mismatch) return true
            return false
        }
    }
    if(filter == "accepted"){
        filtf = function(dbrec){
            if(dbrec.invitation) return true
            return false
        }
    }
    if(filter == "private"){
        filtf = function(dbrec){
            if(dbrec.public) return false
            return false
        }
    }
    if(filter == "public"){
        filtf = function(dbrec){
            if(dbrec.public) return true
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


export const ListSorter = ({sort, onChange}) => {
    sort = sort || "updated"
    let sort_algos = [
        {value: "updated", label: "Most Recently Updated First"},
        {value: "oldest", label: "Least Recently Updated First"},
        {value: "created", label: "Newest Database First"},
        {value: "name", label: "Database Name (a-z)"},
        {value: "organization", label: "Publisher"},
    ]

    let ph = ""
    for(var i = 0; i<sort_algos.length; i++){
        if(sort_algos[i].value == sort) ph += sort_algos[i].label  
    }

    return (
        <Select 
            options={sort_algos}
            placeholder = {ph}
            defaultValue= {sort}
            onChange ={onChange}
        />)
}

function _sort_str(a, b){
    if(a && b){
        if(a.toLowerCase() < b.toLowerCase()) { return -1; }
        if(a.toLowerCase() > b.toLowerCase()) { return 1; }
    }
    if(a) return 1
    if(b) return -1
    return 0;
}

function _sort_list(unsorted, listSort){
    let sortf
    if(listSort == 'updated'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0            
            return (rts - lts)
        }
    }
    else if(listSort == 'oldest'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            return lts - rts
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return rts - lts
        }
    }
    else if(listSort == 'organization'){
        sortf = function(a, b){
            return b.organization - b.organization
        }
    }
    else if(listSort == 'name'){
        sortf = function(a, b){
            return _sort_str(a.label, b.label)
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


export const CloneList = ({list, onAction}) => {
    if(!list.length){
        return (
            <Row className="generic-message-holder">
                <EmptyResult report={{}} />
            </Row>
        )
    }
    return (
        <Container fluid>
            {list.map((value, index) => {
                return (<CloneSummaryCard key={"sum_" + index} meta={value} onAction={onAction}/>)
            })}
        </Container>
    )
}



export const HubDBCard = ({meta, onAction}) => {
    let [mode, setMode] = useState() 

    function showSubscreen(ss){
        setMode(ss)
    }

    function onEditSuccess(){
        meta.action = "load"
        onAction(meta)
        setMode()
    }

    function onFork(doc){
        setMode()   
        onAction(doc)
    }

    function onCancel(){
        setMode()   
    }

    return (<>
        <Row key='r7' className='database-summary-listing database-listing-line'>
            <CloneImagePanel meta={meta} />
            <span className='database-main-content'>
                <Row key='r3'>
                    <HubTitle meta={meta} onAction={onAction}/>
                </Row>
                <HubCredits meta={meta} onAction={onAction}/>
                <HubDescription meta={meta} />
            </span>
            <span className='database-main-actions'>
                <HubStatus meta={meta} onAction={showSubscreen}/>
            </span>
        </Row>
        <Row key="r88" className='hubdb-main-screen' />
        {(mode == "clone") && 
             <HubClonePage meta={meta} onAction={onAction} onCancel={onCancel}/>
        }
        {(mode == "fork") && 
             <HubForkPage meta={meta} onAction={onFork} onCancel={onCancel}/>
        }
        {(mode == "delete") && 
            <DeleteHubDB meta={meta} />
        }
        {(mode == "edit") && 
            <EditHubPage meta={meta} onSuccess={onEditSuccess}/>
        }
    </>)
}

export const HubForkPage = ({meta, onAction, onCancel}) => {
    const {bffClient, localClient, remoteClient } = WOQLClientObj()
    let u = bffClient.user()
    let smeta = {}
    for(var k in meta){
        smeta[k] = meta[k]
    }
    let o = u.organizations[0]
    for(var k in o){
        smeta[k] = o[k]
    }
    smeta.remote_url = remoteClient.server() + meta.organization + "/" + meta.id

    function doSubmit(doc){
        doc.action = "fork"
        doc.remote_url = remoteClient.server() + meta.organization + "/" + meta.id
        doc.remote_record = meta
        onAction(doc)
    }

    return (<DBCreateCard start={smeta} onSubmit={doSubmit} organizations={u.organizations} databases={bffClient.databases()}  type="fork" />)
}

export const HubClonePage = ({meta, onAction, onCancel}) => {
    const {remoteClient, woqlClient } = WOQLClientObj()
    function onClone(cln){
        cln.action = "clone"
        cln.remote_url = remoteClient.server() + meta.organization + "/" + meta.id
        cln.remote_record = meta
        onAction(cln)
    }
    return <CloneLocal onClone={onClone} onCancel={onCancel} meta={meta} woqlClient={woqlClient} type="hub"/>
}



export const EditHubPage = ({meta, onSuccess}) => {
    const {bffClient} = WOQLClientObj()
    const {getTokenSilently} = useAuth0()
    const [report, setReport] = useState()
    const [loading, setLoading] = useState()
    
    if(!bffClient) return null
    let databases = bffClient.databases()
    let excludes = []
    databases.map((item) => {
        if(item.id != meta.id || item.organization != meta.organization){
            excludes.push(item)
        }
    })

    let u = bffClient.user()
    let smeta = {}
    for(var k in meta){
        smeta[k] = meta[k]
    }
    let o = u.organizations[0]
    for(var k in o){
        smeta[k] = o[k]
    }
    smeta.label = smeta.label || ""
    smeta.comment = smeta.comment || ""
    smeta.icon = smeta.icon || ""

    function doSubmit(doc){
        let sub = {action: "edit"}
        sub.id = meta.id
        sub.organization = meta.organization 
        sub.label = doc.label
        sub.comment = doc.comment
        sub.icon = doc.icon
        if(meta.public && !doc.public){
            sub.make_private = true;
            sub.public = false  
        }
        else if(doc.public && !meta.public){
            sub.make_public = true
            sub.public = false
        }
        setLoading(true)
        UpdateDatabase(sub, bffClient, getTokenSilently)
        .then(() => {
            onSuccess(sub)
        })
        .catch((e) => {
            setReport({message: "Update failed", status:TERMINUS_ERROR, error: e})
        })
        .finally(() => setLoading(false))
    }

    return (
        <div>
            {loading && <Loading />}
            {report && 
                <TerminusDBSpeaks report={report} />
            }
            <DBCreateCard 
                start={smeta} 
                organizations={u.organizations} 
                onSubmit={doSubmit} 
                databases={excludes} 
                type="edit" 
            />
        </div>

    )
}




export const HubTitle = ({meta, onAction}) => {

    let title_css = "database-title-missing"

    let str = meta.label || '['+ meta.id+']'
    
    return (
        <span>
            <span className='database-listing-title-row'>
                <span key='a' className={title_css + " database-listing-title-nolink"}>{str}</span>
            </span>
        </span>
    )
}






export const HubDBImage = ({meta, onAction}) => {
    let icon = meta.icon
    if(!icon) icon = HUBDB
    let vi = validURL(icon)
    if(vi){ 
        return (
            <img className='db-home-listing-image' src={icon}/>
        )
    }
    else {
        return (
            <i className={'hub-listing-icon ' + icon} />
        )
    }
}

export const HubCredits = ({meta, onAction}) => {
    return (<>
        <div className="dbcard-creditline">
            <CloneProductionCredits  key='ac' meta={meta} onAction={onAction}/>
            <CloneRoleCredits key='ade' meta={meta} />
            <DBPrivacy key='ad' meta={meta} />
            <DBBranches key='abc' meta={meta} type="full"/>
            <DBSchema key='dbfe' meta={meta}/>
            {!meta.created && 
                <DBEmpty />
            }
        </div>
        <div className="dbcard-sub-creditline">
            {meta.created && 
                <DBCreated ts={meta.created} type="full" />
            }
            {meta.updated && 
                <DBLastCommit meta={meta} />
            }
        </div>
    </>
    )
}

export const DBEmpty = ({meta}) => {
    return (
        <span title={"This is an empty database"}>
            <AiOutlineInbox className="db_info_icon_spacing"/>
            <span className="db_info">Empty</span>
        </span>
    )
}

export const HubDescription = ({meta}) => {
    if(meta.comment){
        return (
            <p key='z' className='database-listing-description-full'>
                {meta.comment}
            </p>
        )
    }
    return null
}




export const DBSchema = ({meta}) => {
    if(meta.schema){
        return (
            <span className="db-card-credit schema-credit-holder">
                <AiOutlineSchedule title="Database has Schema" className="db_info_icon_spacing"/>
                <span className="db_info">
                    Schema 
                </span>
            </span>
        )
    }
    return (
        <span className="db-card-credit schema-credit-holder">
            <AiOutlineThunderbolt title="Schema Free Database" className="db_info_icon_spacing"/>
            <span className="db_info">
                Schema Free
            </span> 
        </span>
    )
}


export const CloneSummaryCard = ({meta, onAction}) => { 
   
    return (
        <Row key='r7' className='database-summary-listing database-listing-line'>
            <CloneImagePanel meta={meta} onAction={onAction} />
            <span className='database-main-content'>
                <Row key='r3'>
                    <CloneTitle meta={meta} onAction={onAction}/>
                </Row>
                <CloneCredits meta={meta} onAction={onAction}/>
                <CloneDescription meta={meta} />
                {meta.invitation_id &&
                    <Row key='r9'>
                        <DBInvite meta={meta}/>
                    </Row>
                }
            </span>
            <span className='database-main-actions'>
                <CloneStatus meta={meta} onAction={onAction}/>
            </span>
        </Row>
    )
}


export const CloneImagePanel = ({meta, onAction}) => {
    let icon = meta.icon
    let goDB = onAction ? function(){
        meta.action = "load"
        onAction(meta)
        goHubPage(meta.organization, meta.id)
    } : undefined  

    let clickcss = onAction ? " clickable-image-panel" : ""

    if(!icon) icon = HUBDB
    let title = `Database ${meta.id} in organization ${meta.organization}`
    let vi = validURL(icon)
    return ( 
        <span title={title} className={'dbcard-control-panel' + clickcss} onClick={goDB} >
        {vi &&  
            <img className='dbcard-image' src={icon}/>
        }
        {!vi && 
            <i className={'dbcard-icon ' + icon} />
        }
        </span>
    )
}

export const CloneTitle = ({meta, onAction}) => {

    function goDB(){
        meta.action = "load"
        onAction(meta)
        goHubPage(meta.organization, meta.id)
    }

    let title_css = "database-title-local"
    let str = meta.label || '['+ meta.id+']'
    
    return (
        <span>
            <span onClick={goDB} className='database-listing-title-row'>
                <span key='a' className={title_css + " database-listing-title"}>{str}</span>
            </span>
        </span>
    )
}

export const CloneDescription = ({meta, user}) => {
    let str = meta.comment || ""
    let title = str;
    if(str && str.length > 80){
        str =  meta.comment.substring(76) + " ..."
    }
    if(str){
        return (
            <Row key='z' title={title} className='database-listing-description-row'>
                <span className="database-listing-description">{str}</span>
            </Row>
        )
    }
    return null
}



export const DBInvite = ({meta, onAction}) => {
    return (
        <div className="database-listing-description-row">
            <span>
                <BsFillEnvelopeFill className="invitation_info_icon_spacing"/>
                <span className="db_info"><span className="invite-user">{meta.inviter}</span> has invited you to collaborate on this database: "{meta.invitation}"</span>
            </span>
        </div>
    )
}

export const CloneCredits = ({meta, onAction}) => {
    let res = []
    res.push (
        <CloneProductionCredits  key='ac' meta={meta} onAction={onAction}/>
    )
    res.push(
        <DBPrivacy key='ad' meta={meta} />
    )
    res.push(
        <CloneRoleCredits key='ade' meta={meta} />
    )  
    //res.push(<CloneURLCredit key="cuc" meta={meta} />)
    if(meta && (meta.created || meta.updated)) {
        res.push(<DBTimings key='dbt' meta={meta} />)
    }
    if(meta.branches && meta.branches.length > 1) {
        res.push(
            <DBBranches key='abc' meta={meta} />
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const CloneURLCredit = ({meta}) => {
    const { remoteClient } = WOQLClientObj()
    let url = remoteClient.server() + meta.organization + "/" + meta.id
    return(<span className="db-card-credit">
        <AiOutlineLink className="db_info_icon_spacing"/>
        <span className="db_info db-card-url">{url}</span>
    </span>)
}

export const DBBranches = ({meta, type}) => {
    type = type || "summary"
    let word = (meta.branches && meta.branches.length == 1 ? "branch" : "branches")
    if(meta.branches && meta.branches.length > 1) {
        let text = meta.branches.length + (type == "full" ? " " + word : "")
        return (
            <span className="db-card-credit" title={meta.branches.length + " " + word}>
                <AiOutlineBranches className="db_info_icon_spacing"/>
                <span className="db_info">
                    {text} 
                </span>
            </span>
        )
    }
    return false
}

export const DBPrivacy = ({meta}) => {
    if(meta.public) {
        return (
            <span className="db-card-credit">
                <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                <span className="db_info">Public</span>
            </span>
        )
    }
    else {
        return (
            <span className="db-card-credit" >
                <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
                <span className="db_info">Private</span>
            </span>
        )
    }
}

export const CloneRoleCredits = ({meta}) => {
    let rs = []    
    function _get_role_title(id, orgtype){
        let map = {
            "create": "Owner",
            "manage": "Manager",
            "write": "Contributor",
            "read": "Reader",
            "monitor": "Monitor"
        }
        return map[id] || "?"
    }

    if(meta.roles){
        for(var i = 0 ; i<meta.roles.length; i++){
            rs.push(_get_role_title(meta.roles[i]))
        }
    }
    if(meta.public && rs.length == 0) return null;
    if(rs.length >= 1){
        return (
            <span className="db-card-credit" >
                <AiFillCrown title="Database Roles" className="db_info_icon_spacing"/>
                <span className="db_info">{rs}</span>
            </span>
        )
    }
    return (
        <span className="db-card-credit" >
            <AiFillLock title="No Access" className="db_info_icon_spacing"/>
            <span className="db_info">No Access</span>
        </span>
    )
}

export const DBTimings = ({meta}) => {
    let parts = []

    function updateStamp(ts){
        let lab = moment(ts*1000).startOf('hour').fromNow()        
        return lab
    }

    if(meta.created && meta.updated && (meta.created == meta.updated)){
        let cts = updateStamp(meta.created, true)
        parts.push(<DBCreated key='xss' display={cts} ts={meta.created}/>)
    }
    else {
        if(meta.created){
            let cats = updateStamp(meta.created, !meta.updated)
            parts.push(<DBCreated key='ds' display={cats} ts={meta.created} />)
        }
        if(meta.updated){
            let uts = updateStamp(meta.updated, true)
            if(meta.author) uts += " by " + meta.author
            parts.push(<DBUpdated key='dbu' author={meta.author} display={uts} ts={meta.updated}/>)
        }
    }
    return parts
}

export const DBCreated = ({display, ts, author}) => {
    if(!ts) return null
    let ct = "First Commit " + printts(ts, DATETIME_DB_UPDATED)
    if(author) ct += " by " + author
    return (
        <span className="db-card-credit" title={ct}>
            <AiOutlineBell className="db_info_icon_spacing"/>
            {display && 
                <span className="db_info">{display}</span>
            }
            {!display && 
                <span className="db_info">
                    <span className="db-card-label">First Commit </span>
                    <span className="db-card-date">{printts(ts, DATETIME_DB_UPDATED)}</span>
                    {author &&
                        <span className="db-card-author">
                            <span className="db-card-label"> by </span>                    
                            <span className="db-card-email">{author}</span>
                        </span>                    
                    }
                </span>            
            }
        </span>
    )
}


export const CloneProductionCredits = ({meta, onAction, type}) => {
    var tit = (meta.organization_type ? meta.organization_type + " Organization " + meta.organization : "")
    let txt = meta.organization_label || meta.organization
    if(type == "full") txt += " " + tit
    function goDB(){
        goHubPage(meta.organization)
    }
    let icon = (meta.organization_icon ? (<img className="database-listing-organization-icon" src={meta.organization_icon}></img>) : "")
    

    return (
        <span className="db-card-credit hub-organization-link" title={tit} onClick={goDB}>
            <AiOutlineUser className="db_info_icon_spacing"/>
            <span className="db_info">
                <span className="db-card-label">
                    Publisher
                </span> {icon} <span className="db-card-orgname">{txt}</span>
            </span>
        </span>
    )
}

export const DBUpdated = ({display, ts, author}) => {
    if(!ts) return null
    let ct = "Most Recent Commit " + printts(ts, DATETIME_DB_UPDATED)
    if(author) ct += " by " + author
    return (
        <span className="db-card-credit" title={ct}>
            <AiFillEdit className="db_info_icon_spacing"/>
            {display && 
                <span className="db_info">{display}</span>
            }
            {!display && 
                <span className="db_info">
                    <span className="db-card-label">Most Recent Commit </span>
                    <span className="db-card-date">{printts(ts, DATETIME_DB_UPDATED)}</span>
                    {author &&
                        <span className="db-card-author">
                            <span className="db-card-label"> by </span>                    
                            <span className="db-card-email">{author}</span>
                        </span>                    
                    }
                </span>            
            }
        </span>
    )
}

export const DBLastCommit = ({meta}) => {
    let ts = meta.updated
    if(!ts) return null
    let onb = []
    if(meta.branches && meta.branches.length > 1){
        meta.branches.map((item) => {
            if(item.updated == meta.updated) onb.push(item.branch)
        })
    }

    let brtxt = ""
    if(onb.length == 1) {
        brtxt = (            
            <span>  
                <span className="db-card-label"> on branch </span>
                {onb[0]}
            </span>
        )
    }
    else if(onb.length > 1){
        let tit = "Branches " + onb.join(", ")
        brtxt = (<span title={tit} className="db-card-label"> on {onb.length} branches</span>)
    }

    let ct = "Last Commit Timestamp: " + ts 
    if(meta.author) ct += " by " + meta.author
    return (
        <span className="db-card-credit" title={ct}>
            <AiFillEdit className="db_info_icon_spacing"/>
            <span className="db_info">
                <span className="db-card-label">Most Recent Commit </span>
                <span className="db-card-date">{printts(ts, DATETIME_DB_UPDATED)}</span>
                {brtxt}
                {meta.author &&
                    <span className="db-card-author">
                        <span className="db-card-label"> by </span>                    
                        <span className="db-card-email">{meta.author}</span>
                    </span>                    
                }
            </span>
        </span>
    )
}


export const HubStatus = ({meta, onAction}) => {

    let doFork = function(){meta.action="fork", onAction("fork")}        
    let doDel = function(){meta.action="delete", onAction("delete")}        
    let doClone = function(){meta.action="clone", onAction("clone")}        
    let doEdit = function(){meta.action="edit", onAction("edit")}        
    let showmin = false;
    if(meta && meta.roles && meta.roles.indexOf("create") != -1){
        showmin = true
    }

    return (
        <div className='database-action-column'>
            {showmin && 
                <div className="hub-minor-actions">
                    <span className = 'hub-main-action' onClick={doEdit}>
                        <EditControl meta={meta} />
                    </span>
                    <span onClick={doDel} className='hub-main-action'>
                        <DeleteControl meta={meta} />
                    </span>
                </div>
            }            
            {!showmin && 
                <div className="hub-minor-actions">
                </div>            
            }
            <div className="hub-major-actions">
                <span className = 'hub-major-action' onClick={doFork}>
                    <ForkFullControl meta={meta} />
                </span>
                <span onClick={doClone} className='hub-major-action'>
                    <CloneFullControl meta={meta} />
                </span>
            </div>
        </div>
    )
}


export const CloneStatus = ({meta, onAction}) => {
    if(meta.invitation_id){
        return (
            <div className='database-action-column'>
                <Row className='database-update-status'>
                    <RemoteUpdated meta={meta} />
                </Row>               
                <Row className='database-secondary-option'>
                    <CloneSecondaryAction meta={meta} onAction={onAction}/>
                </Row>
            </div>
        )
    }
    else {
        return (
            <div className='database-action-column'>
                <div className="hub-minor-actions">
                </div>            
                <div className="hub-major-actions">
                    <CloneMainAction meta={meta} onAction={onAction}/>
                </div>
            </div>
        )
    }
}

export const RemoteUpdated = ({meta}) => {
    let css = "database-main-action-message action-text-color";
    if(meta.invitation_id){
        //return (<span className={css}>Accept Invitation?</span>)
    }
    return null
}

export const CloneMainAction = ({meta, onAction}) => {
    const {remoteClient } = WOQLClientObj()
    if(!remoteClient) return null
    let rurl = remoteClient.server() + meta.organization + "/" + meta.id
    let onc = function(){
        let myc = {
            id: meta.id,
            label: meta.label,
            comment: meta.comment,
            remote_url: rurl,
            remote_record: meta,
            auto: true,
        }
        myc.action = "clone"
        onAction(myc)
    }
    if(meta.public || meta.roles){
        return (
            <span className="database-clone-action" onClick={onc}>
                <CloneControl meta={meta} />
            </span>
        )
    }
    return false
}

export const CloneSecondaryAction = ({meta, onAction}) => {

    function myReject(){
        meta.action = 'reject'
        if(onAction) onAction(meta)
    }

    function myAccept(){
        meta.action = 'accept'
        if(onAction) onAction(meta)
    }
    
    if(meta.action == 'accept'){
        return (
            <div className="action-centralise">
                <div>
                    <span onClick={myAccept} className='invite-main-action'>
                        <AcceptControl meta={meta} />
                    </span>
                    <span className = 'invite-main-action' onClick={myReject}>
                        <RejectControl meta={meta} />
                    </span>
                </div>
            </div>
        )
    }
    return null
}

export const CloneControl = ({meta}) => {
    return <AiOutlineCloudDownload className="database-action"  className="clone-main-action-icon" title="Clone this database now"/>
}

export const CloneFullControl = ({meta}) => {
    return <span className="clone-full-action">
        <span className="clone-full-title-bar">
            <AiOutlineCloudDownload className="clone-full-icon" title="Clone Database"/>
            <span className="clone-full-title">Clone</span>
         </span>
         <span className="clone-full-descr">download a local copy</span>
    </span>
}

export const ForkFullControl = ({meta}) => {
    return <span className="fork-full-action">
        <span className="clone-full-title-bar">
            <AiOutlineFork className="fork-full-icon" title="Fork Database"/> 
            <span className="fork-full-title">Fork</span>
        </span>
        <span className="fork-full-descr">copy to your hub account</span>
    </span>
}


export const ForkControl = ({meta}) => {
    return <AiOutlineFork  color={"#0055bb"}/>
}

export const RejectControl = ({meta}) => {
    return (<span className="reject-action"  title="Reject Invitation">
        <AiOutlineDelete  className='database-action database-listing-delete' /> Reject </span>)
}

export const AcceptControl = ({meta}) => {
    return (<span title='Accept Invitation to collaborate on database' className="accept-action" >
        <AiOutlineCheckCircle title={"Accept Invitation to collaborate on database"}/> Accept </span>)
}

export const DeleteControl = ({meta}) => {
    return (
        <span className="delete-hub-action"  title="Delete Hub Database">
            <AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /> Delete
        </span>
    )
}

export const EditControl = ({meta}) => {
    return <span className="edit-hub-action" title="Edit Hub Database Details"><AiFillEdit className='database-action database-listing-edit' /> Edit</span>
}

export const DeleteHubDB = ({meta}) => {
    const {woqlClient, bffClient, reconnectToServer} = WOQLClientObj()
    const {getTokenSilently} = useAuth0()
    const [rep, setReport] = useState()
    const [modal, setModal] = useState(true)
    const toggle = () => setModal(!modal)
    const [disabled, setDisabled] = useState(true) 
    const [loading, setLoading] = useState()

    function removeDBCard(dbid, orgid){
        dbid = dbid ||  woqlClient.db()
        orgid = orgid || woqlClient.organization()
        let dbs =  woqlClient.databases()
        let ndbs = []
        for(var i = 0; i<dbs.length; i++){
            if(!(dbs[i].id == dbid && dbs[i].organization == orgid)){
                ndbs.push(dbs[i])
            }
            else if(dbs[i].remote_record) {
                dbs[i].id = ""
                dbs[i].type = "missing"
                ndbs.push(dbs[i])
            }
        }
        woqlClient.databases(ndbs)
    }
 
    const onDelete = () => {
        setDisabled(true)
        setLoading(true)
        DeleteDB(meta, woqlClient, bffClient, getTokenSilently)
        .then(() => {            
            setReport({
                message: `Deleted Database ${meta.organization}/${meta.id}`,
                status: TERMINUS_SUCCESS,
            })
            goHubPage(meta.organization)
        })
        .catch((err) => {
            setDisabled(false)
            console.log(err)
            setReport({
                error: err,
                message: `Failed to Delete Database ${meta.organization}/${meta.id}`,
                status: TERMINUS_ERROR,
            })    
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function uip(e){
        if(e && e.target){
            setDisabled(e.target.value != meta.id)
        }
    }

    let tbdel = meta.id

    return (
            <Modal isOpen={modal} toggle={toggle}>
                {loading && <Loading />}
                <ModalHeader toggle={toggle}>  <span className="modal-head">Confirm Database Delete</span> </ModalHeader>
                <ModalBody>
                    <Row key="rd">
                        <span className="delete-modal-atext"><AiOutlineWarning className="del-hub-warning" /> This will remove the database permanently from your hub account. 
                            Copies of the database, locally or on hub, will not be affected.
                        </span>
                    </Row>
                    <Row key="rz">
                        <span className="delete-modal-label">
                            Enter database ID - <strong>{tbdel}</strong> - to confirm delete 
                        </span>
                    </Row>
                    <Row key="rr" className='del-hub-input'>
                        {rep && <TerminusDBSpeaks report={rep} />}
                        <input
                            name="dbId"
                            placeholder= "Enter ID"
                            className = "tcf-input"
                            onChange ={uip}
                        />
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <span className="delete-button">
                        {disabled && 
                            <button className={"tdb__button__base tdb__button__cancel"} onClick={toggle}>Cancel</button>
                        }
                        {!disabled && 
                            <button onClick={onDelete} className="tdb__button__base tdb__button__base--bred delete-modal-button" >
                                <AiOutlineDelete className="delete-button"/> Delete Database
                            </button>
                        }
                    </span>
                </ModalFooter>
            </Modal>
    )
}



export default ClonePage
