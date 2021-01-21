import React, {useEffect, useState} from 'react'
import { CloneDB, ForkDB, DeleteDB, RejectInvite, AcceptInvite, UpdateDatabase, isLocalURL, isHubURL, RefreshDatabaseRecord } from '../../components/Query/CollaborateAPI'
import {useAuth0} from '../../react-auth0-spa'
import {goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import {TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import {WOQLClientObj} from '../../init/woql-client-instance'
import { SimplePageView} from '../Templates/SimplePageView'
import { AiFillLock, AiOutlineFork, AiOutlineCloudDownload, AiOutlineCheckCircle, AiFillStar,
    AiFillCrown, AiFillEdit, AiOutlineStar, AiOutlineThunderbolt, AiOutlineLink,
    AiOutlineMail, AiOutlineUser, AiOutlineInbox,  AiOutlineGlobal, AiOutlineBell, AiOutlineCloudSync,
    AiOutlineBranches, AiOutlineSchedule, AiOutlineDelete, AiOutlineWarning, AiOutlineCloud, AiOutlineLogin, AiFillWarning, AiOutlinePlus, AiOutlineQuestion, AiOutlineQuestionCircle} from 'react-icons/ai';
import { TERMINUS_WARNING, TERMINUS_ERROR, TERMINUS_SUCCESS, TERMINUS_COMPONENT } from "../../constants/identifiers";
import { CLONEDBS } from "./constants.pages"
import Loading from "../../components/Reports/Loading"
import { validURL } from '../../utils/helperFunctions';
import { HUBDB } from "../../constants/images"
import { BsFillEnvelopeFill } from 'react-icons/bs';
import moment from 'moment';
import { printts } from "../../constants/dates"
import { DATETIME_DB_UPDATED } from "../../constants/dates"
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {DBCreateCard} from "../CreateDB/DBCreateCard"
import { CloneLocal } from "../CreateDB/CloneDatabase"
import {Row, Container, Modal, ModalHeader, ModalBody, Col, ModalFooter} from 'reactstrap'
import Select from "react-select"
import {CreateDB} from "../Server/DBListControl"
import { isFuture } from 'date-fns';
import {CreateRemoteForm} from "../CreateDB/CreateDatabase"
import {Collaborators} from "../Server/Collaborators"
import {FiUsers} from "react-icons/fi"

const ClonePage = ({organization, db}) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let u = woqlClient.user()
    const [hubdbs, setHubDBs] = useState(_get_my_dbs(woqlClient, u))
    const [collabs, setCollabs] = useState(_get_my_cdbs(woqlClient, u))

    useEffect(() => {
        if(contextEnriched){
            let u = woqlClient.user()
            setHubDBs(_get_my_dbs(woqlClient, u))
            setCollabs(_get_my_cdbs(woqlClient, u))
        }
    }, [contextEnriched])


    return (
        <SimplePageView id="clonePage">
            <CloneController organization={organization} db={db} list={hubdbs} collaborations={collabs}/>
        </SimplePageView>
    )
}

function _get_my_dbs(woqlClient, user){
    let dblist = woqlClient.databases()
    let mine = {}
    for(var i = 0; i<dblist.length; i++){
        if(dblist[i].remote_record && dblist[i].remote_record.organization == user.logged_in){
            if(typeof mine[dblist[i].remote_record.id] == "undefined"){
                mine[dblist[i].remote_record.id] = dblist[i].remote_record
            }
        }
    }
    return Object.values(mine)
}

function _get_my_cdbs(woqlClient, user){
    let dblist = woqlClient.databases()
    let cds = {}
    for(var i = 0; i<dblist.length; i++){
        if(dblist[i].remote_record && dblist[i].remote_record.organization != user.logged_in && dblist[i].remote_record.roles && dblist[i].remote_record.roles.length){
            if(typeof cds[dblist[i].remote_record.organization + "/" + dblist[i].remote_record.id] == "undefined"){
                cds[dblist[i].remote_record.organization + "/" + dblist[i].remote_record.id] = dblist[i].remote_record
            }
        }
    }
    return Object.values(cds)
}


export const CloneController = ({list, db, organization, meta, collaborations}) => {
    let [currentDB, setCurrentDB] = useState(meta)
    let [dbid, setDBid] = useState(db)
    let [orgid, setOrgid] = useState(organization)
    let [currentList, setCurrentList] = useState()
    let [loading, setLoading] = useState()
    let [report, setReport] = useState()
    let [bump, setBump] = useState(0)
    let [showingMine, setShowingMine] = useState(true)

    const { woqlClient,  refreshDBRecord, bffClient, remoteClient, addClone } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()

    if(!woqlClient || !bffClient) return null

    useEffect(() => {
        setOrgid(organization)
        setDBid(db)
        if(organization == ""){
            setCurrentList(showingMine ? list : collaborations)
        }
    }, [organization, db])

    function loadNewStuff(org, db){
        setOrgid(false)
        setDBid(false)
        setCurrentDB()
        setCurrentList()
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
            if(list) {
                if(showingMine) setCurrentList(list)
                else setCurrentList(collaborations)
            }
            else if(meta) setCurrentDB(meta)
        }
    }, [dbid, orgid, bump])

    function processOrganizationListing(o, res){
        if(o == "invitations" || o == "collaborators") {
            setCurrentList(res)
        }
        else if(res.databases){
            setCurrentList(res.databases)
        }
        else {
            reportOrganization404(o)
        }
    }

    function fireAction(dbmeta){
        let db = _copy_db_card(dbmeta)
        if(db.action == 'load'){
            refreshHub(dbmeta.organization, dbmeta.id)
        }
        else if(db.action == 'accept'){
            setLoading(true)
            AcceptInvite(db, woqlClient, bffClient, getTokenSilently)
            .then(() => {
                let newb = { remote_record: db}
                newb.remote_url = remoteClient.server() + db.organization + "/" + db.id
                setBump(bump+1)
                setReport({status: TERMINUS_SUCCESS, message: "Invitation Accepted - Cloning Database"})
                return CloneDB(newb, woqlClient, getTokenSilently, false, false, bffClient)
                .then((id) => {
                    setReport({status: TERMINUS_SUCCESS, message: "Cloning successful"})
                    return addClone(id, woqlClient.user_organization(), newb)
                    .then(() => {
                        goDBHome(id, woqlClient.user_organization(), report)
                        removeProcessedInvite(db)
                    })
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
            CloneDB(db, woqlClient, getTokenSilently, false, pred, bffClient)
            .then((id) => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                addClone(id, woqlClient.user_organization(), db)
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
        let oinvites = currentList || []
        for(var i = 0; i<oinvites.length; i++){
            if(dbrec.invitation_id != oinvites[i].invitation_id){
                ninvites.push(oinvites[i])
            }
        }
        setCurrentList(ninvites)
    }

    function reportOrganization404(org, e){
        setReport({status: TERMINUS_WARNING, message: "Publisher not found", error: e})
    }

    function reportDB404(db, org, e){
        setReport({status: TERMINUS_WARNING, message: "Database not found", error: e})
    }

    function reportComponentError(code, str){
        setReport({status: TERMINUS_WARNING, message: "Database not found " + str, error: e})
    }

    function refreshHub(org, db){
        if(org == "collaborations"){
            setCurrentDB()
            setCurrentList()
            setOrgid()
            setDBid()
            setShowingMine(false)
            setBump(bump+1)
        }
        else if(org == ""){
            setShowingMine(true)
            setCurrentDB()
            setCurrentList()
            setOrgid()
            setDBid()
            goHubPage()
            setBump(bump+1)
        }
        else {
            setCurrentDB()
            setCurrentList()
            if(org == orgid && db == dbid || org == "recommendations" || org == "invitations" || org == ""){
                setBump(bump+1)
            }
            setOrgid(org)
            setDBid(db)
            goHubPage(org, db)
        }
    }

    function reloadCollabs(){
        refreshHub("collaborators")
    }

    if(currentDB){
        let url = remoteClient.server() + currentDB.organization + "/" + currentDB.id
        return (
            <div className="tdb__loading__parent">
                <DBHubHeader organization={orgid} url={url} meta={currentDB} onChange={refreshHub} onError={reportComponentError} bump={bump}/>
                <HubDBCard report={report} meta={currentDB} onAction={fireAction}/>
                {loading &&  <Loading type={TERMINUS_COMPONENT} />}
            </div>
        )
    }
    else if(currentList && orgid=="collaborators"){
        return (
            <div className="tdb__loading__parent">
                <CloneHubHeader showingMine={showingMine} organization={orgid} list={currentList} onChange={refreshHub} onError={reportComponentError}/>
                <Collaborators onComplete={reloadCollabs} report={report} user={woqlClient.user()} dbs={list} list={currentList} />
                {loading &&  <Loading type={TERMINUS_COMPONENT} />}
            </div>
        )
    }
    else if(currentList){
        return (
            <div className="tdb__loading__parent">
                <CloneHubHeader showingMine={showingMine} organization={orgid} list={currentList} onChange={refreshHub} onError={reportComponentError}/>
                <CloneListControl report={report} organization={orgid} showingMine={showingMine} list={currentList} onAction={fireAction} />
                {loading &&  <Loading type={TERMINUS_COMPONENT} />}
            </div>
        )
    }
    else {
        return (<div className="tdb__loading__parent">
            <Row className="generic-message-holder">
                {report &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>
            {loading &&  <Loading type={TERMINUS_COMPONENT} />}
        </div>)
    }
}

export const CloneHubHeader = ({organization, showingMine, list, onChange, onError}) => {
    let realorg =  (organization && ["recommendations", "invitations", "collaborators"].indexOf(organization) == -1 ) ? true : false

    return (
        <Row className="remote-info clone-widget-title">
            <div className="remote-info-align database-create-header">
                <HubPicture />
                <span className='database-listing-header-row'>
                    <span key='a' className="database-header-title remote-info-label">Share, Clone and Collaborate with Terminus Hub</span>
                </span>
            </div>
            <div className="database-remote-info-row">
                <HubToolbar showingMine={showingMine} onChange={onChange} onError={onError} organization={organization}/>
            </div>
    </Row>)
}

export const OrganizationalHeader = ({organization}) => {
    const {bffClient} = WOQLClientObj()
    let u = bffClient.user()
    let orgs = u.organizations
    let o = false
    for(var i = 0; i<orgs.length; i++){
        if(orgs[i].organization == organization){
            o = orgs[i]
            break
        }
    }
    if(!o){
        o = {
            organization: organization,
            organization_type: "Personal",
            organization_icon: HUBDB,
            organization_label: "Unknown",
            organization_comment: "This publisher does not exist"
        }
    }
    else {
        console.log(o)
    }

    return <div className='organization-hub-header'>
        <span className='organization-hub-image'>
            <HubOrgImage icon={o.organization_icon} />
        </span>
        <span className='organization-hub-credits'>
            <Row className='organization-hub-name'>
               <OrgBadge type={o.organization_type} />  {o.organization_label}
            </Row>
            <Row className='organization-hub-description'>
                {o.organization_comment}
            </Row>
        </span>
    </div>
}

export const OrgBadge = ({type}) => {
    if(type == "Professional"){
        return <AiFillStar title='Verified Professional Publisher' className="pro-badge" />
    }
    return null
}


export const HubOrgImage = ({icon}) => {
    let vi = validURL(icon)
    if(vi){
        return (
            <img className='organization-home-listing-image' src={icon}/>
        )
    }
    else {
        return (
            <i className={'organization-listing-icon ' + icon} />
        )
    }
}




export const DBHubHeader = ({organization, url, meta, onChange, onError}) => {
    let text = "This database is stored on Terminus Hub"
    return (<Row className="remote-info clone-widget-title">
        <div className='remote-info-align database-create-header'>
            <HubPicture />
            <span className='database-listing-header-row'>
                <span key='a' className="database-header-title remote-info-label">Terminus Hub Database</span>
            </span>
        </div>
        <div className="database-remote-info-row">
            <HubToolbar onChange={onChange} onError={onError} url={url} organization={organization}/>
        </div>
    </Row>
    )
}

export const HubToolbar = ({onChange, showingMine, onError, organization, url}) => {
    const { woqlClient, remoteClient } = WOQLClientObj()

    const [bump, setBump] = useState(0)

    function goInvites(){
        onChange("invitations")
    }

    function goRecommendations(){
        onChange("recommendations")
    }

    function goHome(){
        onChange("")
    }

    function goCollaborators(){
        onChange("collaborators")
    }


    function goCollaborations(){
        onChange("collaborations")
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
            //onChange("clone", url)
        }
    }

    let u = woqlClient.user()

    return (
        <Row className="hub-toolbar">
            {u.logged_in && <>
                <Col className="hub-home-col hub-recommendations-col">
                    <MyDatabasesLinker showingMine={showingMine} bump={bump} organization={organization} onSubmit={goHome}/>
                </Col>
                <Col className="hub-toolbar-col hub-collaborations-col">
                    <CollaborationsLinker showingMine={showingMine} bump={bump} organization={organization} onSubmit={goCollaborations}/>
                </Col>
                <Col className="hub-toolbar-col hub-invitations-col">
                    <InvitationsLinker bump={bump} organization={organization} onSubmit={goInvites}/>
                </Col>
                <Col className="hub-home-col hub-recommendations-col">
                    <CollaboratorsLinker  bump={bump} organization={organization} onSubmit={goCollaborators}/>
                </Col>
            </>}
            <Col className="hub-toolbar-col hub-recommendations-col">
                <RecommendationsLinker  bump={bump} organization={organization} onSubmit={goRecommendations}/>
            </Col>
            <Col className="hub-toolbar-col publisher-picker-col">
                <PublisherPicker onSubmit={onChange} organization={organization} />
            </Col>
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
    let df = (["recommendations", "invitations", "collaborators"].indexOf(organization) == -1 ) ? organization : null
    return (
        <span className='hub-inputbar publisher-picker'>
            <AiOutlineUser className="hub-bar-spacing"/>
            <input
                type="text"
                defaultValue={df}
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

const MyDatabasesLinker = ({organization, onSubmit, showingMine}) => {
    if(!organization && showingMine){
        return(
            <span title="My Databases" className='hub-inputbar hub-active-link'>
                <AiOutlineCloud className="hub-active-icon active-cloud hub-bar-spacing"/> My Databases
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your TerminusHub databases" className='hub-inputbar hub-link'>
            <AiOutlineCloud className="hub-inactive-icon inactive-cloud hub-bar-spacing"/> My Databases
        </span>
    )
}

const CollaborationsLinker = ({organization, onSubmit, showingMine}) => {
    if(!organization && !showingMine){
        return(
            <span title="Collaborations" className='hub-inputbar hub-active-link'>
                <AiOutlineLogin className="hub-active-icon active-mail hub-bar-spacing"/> Collaborations
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your Collaborations" className='hub-inputbar hub-link'>
            <AiOutlineLogin className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Collaborations
        </span>
    )
}

const CollaboratorsLinker = ({organization, onSubmit}) => {
    if(organization == "collaborators"){
        return(
            <span title="Collaborators" className='hub-inputbar hub-active-link'>
                <FiUsers className="hub-active-icon active-mail hub-bar-spacing"/> Collaborators
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your TerminusHub databases" className='hub-inputbar hub-link'>
            <FiUsers className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Collaborators
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

export const CloneListControl = ({list, onAction, organization, sort, filter, showingMine, report}) => {
    if(!list) return null
    const [listSort, setSort] = useState(sort || "updated")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()
    const [showingCreate, setShowingCreate] = useState(false)

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



    function showCreate(){
        setShowingCreate(true)
    }

    function unshowCreate(){
        setShowingCreate(false)
    }

    if(!sorted) return null
    let show_create = (!organization && showingMine);
    if(showingCreate) return (<CreateRemoteForm onCancel={unshowCreate}/>)
    return (<>
        <div className="dbclone-filters">
            {(sorted.length == 0 ) &&
                <EmptyCloneList showingMine={showingMine} organization={organization}/>
            }
            {sorted.length > 0 &&
                <CloneListStats showingMine={showingMine} organization={organization} list={sorted} />
            }
            {show_create &&
                <CreateHubDB onCreate={showCreate} />
            }
            { false &&
                <ListFilter filter={listFilter} onChange={callFilter} />
            }
            {list.length > 1 &&
                <ListSorter sort={listSort} onChange={callSort} organization={organization} />
            }
        </div>
        <Row className="generic-message-holder">
            {report &&
                <TerminusDBSpeaks report={report} />
            }
        </Row>
        <CloneList list={sorted} onAction={onAction}/>
  </>)
}

function _get_pp_stats(list){
    let s = {
        total: list.length,
        public: 0,
        private: 0
    }
    for(var i = 0; i<list.length; i++){
        if(list[i].public) s.public++
        else s.private++
    }
    return s
}

export const MyDBStats = ({list}) => {
    let stats = _get_pp_stats(list)
    let dbname = stats.total == 1 ? "Database" : "Databases"

    return <span className="stats-list-intro">Your Account Has:
        <span className="db-card-credit">
            <AiOutlineCloud className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}

export const PPStats = ({pub, pri}) => {
    return <span className="db-privacy-stats">
        <span className="db-card-credit">
            <AiOutlineGlobal title="Public Databases" className="db_info_icon_spacing"/>
            <span className="db_info">{pub} Public</span>
        </span>
        <span className="db-card-credit" >
            <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
            <span className="db_info">{pri} Private</span>
        </span>
    </span>
}

export const CollaboratorStats = ({list}) => {
    let stats = _get_pp_stats(list)
    let dbname = stats.total == 1 ? "Database" : "Databases"
    return <span className="stats-list-intro">You are a collaborator on:
        <span className="db-card-credit">
            <AiOutlineLogin className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}

export const InvitationStats = ({list}) => {
    return <span className="stats-list">
        <AiOutlineMail className="hub-active-icon active-star hub-bar-spacing"/> Invitations to collaborate from other users
    </span>
}

export const RecommendationStats = ({list}) => {
    return <span className="stats-list-intro">
        <AiOutlineStar className="hub-active-icon active-star hub-bar-spacing"/> <strong>Recommendations</strong> Useful and Interesting Databases that you can clone to help you get up and running with TerminusDB
    </span>
}

export const OrgDBStats = ({list, organization}) => {
    let stats = _get_pp_stats(list)
    let nm = organization
    let dbname = stats.total == 1 ? "Database" : "Databases"
    return <span className="stats-list-intro">Available from {nm} :
        <span className="db-card-credit">
            <AiOutlineCloud className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}


export const CloneListStats = ({showingMine, organization, list}) => {
    let txt = ""
    let tit = ""
    if(!organization && showingMine){
        return <MyDBStats list={list} />
    }
    else if(!organization){
        return <CollaboratorStats list={list} />
    }
    else if(organization == "invitations"){
        return <InvitationStats />
    }
    else if(organization == "recommendations"){
        return <RecommendationStats />
    }
    else {
        return <OrgDBStats list={list} organization={organization} />
    }
}



export const CreateHubDB = ({onCreate}) => {
    let txt = "New TerminusHub Database"
    let title = "Create a new database on TerminusHub"
    return (
        <button title={title} type="submit" className="dblist-create" onClick={onCreate}>
            {txt} <AiOutlinePlus className="create-btn-icon" />
        </button>
    )
}



export const CreateDBOption = () => {
    return <span className="empty-clonelist-option">
        <AiOutlinePlus className='clonelist-option-icon'/> <span className="empty-action-title"> Create on Hub</span>
        <span className="empty-action-explanation"> Create a new database directly on TerminusHub</span>
    </span>
}

export const SaveDBOption = () => {
    return <span className="empty-clonelist-option">
        <AiOutlineCloudSync className='clonelist-option-icon'/> <span className="empty-action-title"> Save to Hub</span>
        <span className="empty-action-explanation"> Save to TerminusHub from the synchronize screen</span>
    </span>
}

export const ForkDBOption = () => {
    return <span className="empty-clonelist-option">
         <AiOutlineFork className='clonelist-option-icon'/> <span className="empty-action-title"> Fork from Hub</span>
        <span className="empty-action-explanation"> Copy another TerminusHub Database to your Account</span>
    </span>
}

export const EmptyMyDBs = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineCloud className="empty-clonelist-icon"/> There are no databases saved in your TerminusHub Account
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />  To save databases to your TerminusHub account, either:
                <CreateDBOption />
                <SaveDBOption />
                <ForkDBOption />
        </span>
    </span>
}

export const EmptyInvitations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineMail className="empty-clonelist-icon"/> There are no pending invitations
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            Other TerminusHub users can invite you to view or collaborate their published databases. When you recieve an invitation, you can view it here
        </span>
    </span>
}

export const EmptyCollaborations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineLogin className="empty-clonelist-icon"/> You are not a collaborator on any TerminusHub Databases
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            Other TerminusHub users can make you a collaborator on their databases. When you are given collaborator rights to other people's databases, you can access them here
        </span>
    </span>
}

export const EmptyRecommendations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiFillWarning className="empty-clonelist-icon"/> There are currently no recommendations available
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            This normally means that there is some communication problem between your local server and TerminusHub. Try pressing Ctrl-R or refreshing your browser
            to reconnect to TerminusHub
        </span>
    </span>
}


export const EmptyPublisher = ({publisher}) => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiFillWarning className="empty-clonelist-icon"/> There are currently no database available from publisher {publisher}
        </span>
    </span>
}



export const EmptyCloneList = ({showingMine, organization, stats, filter}) => {
    let txt = ""
    let tit = ""
    if(!organization && showingMine){
        return <EmptyMyDBs />
    }
    else if(!organization){
        return <EmptyCollaborations />
    }
    else if(organization == "invitations"){
        return <EmptyInvitations />
    }
    else if(organization == "recommendations"){
        return <EmptyRecommendations />
    }
    else {
        return <EmptyPublisher publisher={organization} />
    }
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
    if(!unfiltered.length) return []
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

export const ListSorter = ({sort, onChange, organization}) => {
    sort = sort || "updated"
    let sort_algos = [
        {value: "updated", label: "Most Recently Updated First"},
        {value: "oldest", label: "Least Recently Updated First"},
        {value: "created", label: "Newest Database First"},
        {value: "name", label: "Database Name (A-Z)"},
        //{value: "organization", label: "Publisher"},
    ]

    if(organization && (organization == "invitations" ||  organization == "recommendations")){
        return null
    }

    let ph = ""
    for(var i = 0; i<sort_algos.length; i++){
        if(sort_algos[i].value == sort) ph += sort_algos[i].label
    }

    return (
        <Select
            className="dblist-filter"
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
    if(!unsorted.length) return []
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
        return null
    }
    return (
        <Container fluid>
            {list.map((value, index) => {
                return (<CloneSummaryCard key={"sum_" + index} meta={value} onAction={onAction}/>)
            })}
        </Container>
    )
}

export const HubDBCard = ({meta, onAction, report}) => {
    let [mode, setMode] = useState()
    let [bump, setBump] = useState(0)

    function showSubscreen(ss){
        if(ss == "delete") setBump(bump+1)
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
        {report &&
            <Row className="generic-message-holder">
                    <TerminusDBSpeaks report={report} />
            </Row>
        }
        <Row key="r88" className='hubdb-main-screen' />
        {(mode == "clone") &&
             <HubClonePage meta={meta} onAction={onAction} onCancel={onCancel}/>
        }
        {(mode == "fork") &&
             <HubForkPage meta={meta} onAction={onFork} onCancel={onCancel}/>
        }
        {(mode == "delete") &&
            <DeleteHubDB meta={meta} isOpen={bump}/>
        }
        {(mode == "edit") &&
            <EditHubPage meta={meta} onSuccess={onEditSuccess}/>
        }
    </>)
}

export const HubForkPage = ({meta, onAction}) => {
    const {bffClient, remoteClient } = WOQLClientObj()
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
    let str = meta.label || '['+ meta.id+']'
    return (
        <span>
            <span className='database-listing-title-row'>
                <span key='a' className="database-listing-title-nolink">{str}</span>
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

    if(!icon) {
        if(meta.organization_icon) icon = meta.organization_icon
        else icon = HUBDB
    }
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
    if(str && str.length > 400){
        str =  meta.comment.substring(0, 396) + " ..."
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
        if(onAction) onAction({action: "load", organization: meta.organization})
        else goHubPage(meta.organization)
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
        console.log(meta)
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
    return null
}

export const CloneControl = ({meta}) => {
    return <AiOutlineCloudDownload className="hub-main-action-icon clone-main-action-icon" title="Clone this database now"/>
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

export const DeleteHubDB = ({meta, isOpen}) => {
    const {woqlClient, bffClient, reconnectToServer} = WOQLClientObj()
    const {getTokenSilently} = useAuth0()
    const [rep, setReport] = useState()
    const [modal, setModal] = useState(true)
    const toggle = () => setModal(!modal)
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState()

    useEffect(() => setModal(true), [isOpen])

    function removeDBCard(dbid, orgid){
        let dbs =  woqlClient.databases()
        let ndbs = []
        for(var i = 0; i<dbs.length; i++){
            if(dbs[i].id == "" && dbs[i].remote_record && dbs[i].remote_record.organization == orgid && dbs[i].remote_record.id == dbid ){

            }
            else if(dbs[i].remote_record && dbs[i].remote_record.organization == orgid && dbs[i].remote_record.id == dbid){
                delete(dbs[i]["remote_record"])
                ndbs.push(dbs[i])
            }
            else {
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
            removeDBCard(meta.id, meta.organization)
            goHubPage()
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
