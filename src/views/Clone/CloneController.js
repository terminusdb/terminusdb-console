import React, {useEffect, useState,Fragment} from 'react'
import { CloneDB, ForkDB, DeleteDB, RejectInvite, AcceptInvite, UpdateDatabase, isLocalURL, isHubURL, RefreshDatabaseRecord } from '../../components/Query/CollaborateAPI'
import {useAuth0} from '../../react-auth0-spa'
import {goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import {TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import {WOQLClientObj} from '../../init/woql-client-instance'
import { AiFillLock, AiOutlineFork, AiOutlineCloudDownload, AiOutlineCheckCircle, AiFillStar,
    AiFillCrown, AiFillEdit, AiOutlineThunderbolt, AiOutlineLink,
    AiOutlineMail, AiOutlineUser, AiOutlineInbox,  AiOutlineGlobal, AiOutlineBell, AiOutlineCloudSync,
    AiOutlineBranches, AiOutlineSchedule, AiOutlineDelete, AiOutlineWarning, AiOutlineCloud, AiOutlineLogin, AiFillWarning, AiOutlinePlus, AiOutlineQuestion, AiOutlineQuestionCircle} from 'react-icons/ai';
import { TERMINUS_WARNING, TERMINUS_ERROR, TERMINUS_SUCCESS, TERMINUS_COMPONENT } from "../../constants/identifiers";
import Loading from "../../components/Reports/Loading"
import { validURL } from '../../utils/helperFunctions';
import { HUBDB } from "../../constants/images"
import { BsFillEnvelopeFill } from 'react-icons/bs';
import { printts } from "../../constants/dates"
import { DATETIME_DB_UPDATED } from "../../constants/dates"
import {DBCreateCard} from "../CreateDB/DBCreateCard"
import { CloneLocal } from "../CreateDB/CloneDatabase"
import {Row, Container, Modal, ModalBody, ModalFooter} from "react-bootstrap" //replace
import {Collaborators} from "../Server/Collaborators"
import {CloneHubHeader, DBHubHeader} from "../Clone/DBHubHeader"
import {CloneListControl,
       CloneProductionCredits,
       DBPrivacy,
       CloneRoleCredits,
       DBCreated,DBBranches,CloneImagePanel,
       CloneFullControl} from "../Clone/CloneListControl"


//we don't pass meta ???
export const CloneController = ({list, db, organization, meta, collaborations}) => {
    let [currentDB, setCurrentDB] = useState(meta)
    let [dbid, setDBid] = useState(db)
    let [orgid, setOrgid] = useState(organization)
    let [currentList, setCurrentList] = useState()
    let [loading, setLoading] = useState()
    let [report, setReport] = useState()
    let [bump, setBump] = useState(0)
    let [showingMine, setShowingMine] = useState(true)

    const { woqlClient, bffClient, remoteClient, addClone } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()

    if(!woqlClient || !bffClient) return null

    useEffect(() => {
        setOrgid(organization)
        setDBid(db)
        if(!organization){
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
        if(db.action === 'fork'){
            setLoading(true)
            ForkDB(db, woqlClient, bffClient, getTokenSilently, true)
            .then(() => {
                loadNewStuff()
                //set the page in the history router
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
        else if(org === ""){
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

    return (<Fragment>
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
    </Fragment>)
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

export const HubTitle = ({meta}) => {
    let str = meta.label || '['+ meta.id+']'
    return (
        <span>
            <span className='database-listing-title-row'>
                <span key='a' className="database-listing-title-nolink">{str}</span>
            </span>
        </span>
    )
}

export const HubDBImage = ({meta}) => {
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
    return (<Fragment>
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
    </Fragment>
    )
}

export const DBEmpty = () => {
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


export const DBInvite = ({meta}) => {
    return (
        <div className="database-listing-description-row">
            <span>
                <BsFillEnvelopeFill className="invitation_info_icon_spacing"/>
                <span className="db_info"><span className="invite-user">{meta.inviter}</span> has invited you to collaborate on this database: "{meta.invitation}"</span>
            </span>
        </div>
    )
}



/*export const CloneProductionCredits = ({meta, onAction, type}) => {
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
}*/



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

export const RemoteUpdated = ({meta}) => {
    if(meta.invitation_id){
        //return (<span className={css}>Accept Invitation?</span>)
    }
    return null
}


export const ForkFullControl = () => {
    return <span className="fork-full-action">
        <span className="clone-full-title-bar">
            <AiOutlineFork className="fork-full-icon" title="Fork Database"/>
            <span className="fork-full-title">Fork</span>
        </span>
        <span className="fork-full-descr">copy to your hub account</span>
    </span>
}


export const ForkControl = () => {
    return <AiOutlineFork  color={"#0055bb"}/>
}

export const RejectControl = () => {
    return (<span className="reject-action"  title="Reject Invitation">
        <AiOutlineDelete  className='database-action database-listing-delete' /> Reject </span>)
}

export const AcceptControl = () => {
    return (<span title='Accept Invitation to collaborate on database' className="accept-action" >
        <AiOutlineCheckCircle title={"Accept Invitation to collaborate on database"}/> Accept </span>)
}

export const DeleteControl = () => {
    return (
        <span className="delete-hub-action"  title="Delete Hub Database">
            <AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /> Delete
        </span>
    )
}

export const EditControl = () => {
    return <span className="edit-hub-action" title="Edit Hub Database Details"><AiFillEdit className='database-action database-listing-edit' /> Edit</span>
}

export const DeleteHubDB = ({meta, isOpen}) => {
    const {woqlClient, bffClient} = WOQLClientObj()
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
        <Modal show={modal} onHide={toggle}>
            {loading && <Loading />}
            <Modal.Header closeButton>  <span className="modal-head">Confirm Database Delete</span> </Modal.Header>
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
                        <button onClick={onDelete} className="tdb__button__base tdb__button__base--bred" >
                            <AiOutlineDelete className="delete-button"/> Delete Database
                        </button>
                    }
                </span>
            </ModalFooter>
        </Modal>
    )
}


