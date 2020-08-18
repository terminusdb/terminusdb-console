/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import React, {useState, useEffect, Fragment} from "react"
import { GRAPHDB } from "../../constants/images"
import moment from 'moment';
import {Row, Col, Badge, Container} from "reactstrap"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {QUERY_ICON, DELETE_ICON, SCHEMA_ICON, DOCUMENTS_ICON, COMMITS_ICON,
    SHARE_ICON, PUSH_ICON, PULL_ICON, CLONE_ICON, ALL_GOOD_ICON, NO_CAN_DO_ICON, CLONED_ICON } from "../../constants/faicons"
import { printts } from "../../constants/dates"
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"
import { TERMINUS_ERROR, TERMINUS_COMPONENT } from "../../constants/identifiers"
import Loading from "../../components/Reports/Loading"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import { DATETIME_COMPLETE, DATETIME_REGULAR, DATE_REGULAR } from "../../constants/dates"
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCopy,
    AiOutlineCloudSync, AiOutlineCloudDownload, AiOutlineFork, AiFillCheckCircle,AiFillEdit,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild, AiOutlineInfoCircle,
    AiOutlineGlobal, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete, AiFillDatabase} from 'react-icons/ai';
import { BsBook, BsFillEnvelopeFill } from 'react-icons/bs';
import { GiMeshBall, GiPlainCircle } from 'react-icons/gi';
import { FaClone } from 'react-icons/fa';
import { validURL } from '../../utils/helperFunctions'

export const DBFullCard = ({meta, user, title_max, onAction}) => {
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()

    meta.action = (onAction ? _user_db_action(meta, user) : false)

    function noGo(report){
        setLoading(false)
        if(report) setReport(report)
    }

    function onGo(){
        if(onAction){
            setReport(false)
            if(!meta.action) return
            let uerr = onAction(meta, noGo)
            if(uerr){
                setReport({status: TERMINUS_ERROR, message: uerr, error: {}})
            }
            else {
               // setLoading(true)
            }
        }
    }

    let decr = (report ? (<TerminusDBSpeaks report={report} />) : (<DBDescription meta={meta}  user={user} />))
    return (
        <Row key='r7' className='database-summary-listing'>
            {loading &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {!loading && <>
                <Col key='r5' md={2} className='database-control-panel'>
                    <DBControlPanel meta={meta} user={user} />
                </Col>
                <Col md={10} className='database-main-content'>
                    <Row key='r3'>
                        <DBTitle meta={meta} user={user} max={title_max}/>
                    </Row>
                    <Row key='r6'>
                        {decr}
                    </Row>
                    <Row key='r4' className="database-credits">
                        <DBCredits meta={meta}  user={user} />
                    </Row>
                    <Row key='r90' className="database-remote-credits remote-info">
                        <RemoteCredits meta={meta}  user={user} />
                    </Row>
                </Col>
                {/*<Col key='r6' md={2} className='database-main-actions'>
                    <DBStatus meta={meta}  user={user}  onAction={onGo}/>
                </Col>*/}
            </>}
        </Row>
    )
}

export const DBTitle = ({meta, user, onAction, max}) => {
    let maxtitle = max || 40, author = false
    let title_css = meta.id ? "database-title-local" : "database-title-missing"
    if(meta.label && meta.label.length > maxtitle){
        var str =  meta.label.substring(maxtitle -4) + " ..."
    }
    else str = meta.label || ""

    return (
        <span className='database-listing-title-row'>
            <span key='a' className={title_css + " database-listing-title"}>{str}</span>
        </span>
    )
}

export const DBCredits = ({meta, user}) => {
    let res = []
    res.push(<DBID key='dbt' meta={meta} user={user} />)
    res.push(<DBBranches  key='abc' meta={meta} user={user} />)
    res.push(<DBSize key='ab' meta={meta} user={user} />)
    res.push(<DBFirstCommit key='dbc' meta={meta} user={user} />)
    res.push(<DBLastCommit key='dbv' meta={meta} user={user} />)
    return res
}


export const DBID = ({meta, user}) => {
    let ct = "ID: " + meta.id
    return (
        <span>
            <AiFillInfoCircle className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </span>
    )
}

export const DBDescription = ({meta, user}) => {
    if(meta.comment && meta.comment.length > 80 && !meta.testing){
        var str =  meta.comment.substring(76) + " ..."
    }
    else str = meta.comment || ""
    return (
        <Row key='z' className='database-listing-description-row'>
            <span className="database-listing-description">{str}</span>
        </Row>
    )
}

export const DBFirstCommit = ({meta, user}) => {
    let ts = meta.created
    let ct
    if(ts){
        ct = "First Commit: " + printts(ts, DATETIME_COMPLETE)
        //if(meta.author) ct += " by " + meta.author
    }
    else {
        ct = "No commits"
    }
    return (
        <span>
            <AiFillInfoCircle className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </span>
    )
}



export const DBLastCommit = ({meta, user}) => {
    let ts = meta.updated
    if(!ts) return null
    let ct = "Latest Update: " + printts(ts, DATETIME_COMPLETE)
    if(meta.branches && meta.branches.length > 1){
        meta.branches.map((item) => {
            if(item.updated == meta.updated) ct += " on branch " + item.branch
        })
    }

    if(meta.author) ct += " by " + meta.author
    return (
        <div>
            <AiFillEdit className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </div>
    )
}

export const RemoteCredits = ({meta, user}) => {
    let res = []
    res.push(<DBCloneStatus  key='cl' meta={meta} user={user} />)
    if(meta && meta.remote_record){
        res.push(<DBRemoteTitle  key='cl' meta={meta.remote_record} user={user} />)
    }
    if(meta && meta.remote_record && meta.type != "local_clone"){
        res.push (
            <DBProductionCredits  key='ac' meta={meta.remote_record} user={user} />
        )
        res.push(
            <DBRoleCredits key='ad' meta={meta.remote_record} user={user} />
        )
        res.push(
            <DBLastCommit key='ad' meta={meta.remote_record} user={user} />
        )
    }
    return (<>
        <div className="remote-info-align">
            <AiOutlineInfoCircle className={"database-remote-icon"} color={"#856404"} title={""}/>
            <span className="remote-info-label">Remote Info</span>
        </div>
        <div className="database-remote-info-row">
            {res}
        </div></>
    )
}

export const DBRemoteTitle = ({meta, user}) => {
    let ct = meta.label ? meta.label : meta.id
    return(<span>
        <AiOutlineBook className="db_info_icon_spacing"/>
        <span className="db_info">Name: {ct}</span>
    </span>)
}

export const DBCloneStatus = ({meta, user}) => {
    let ct = ""
    if(meta.remote_url) {
        if(meta.type == "local_clone"){
            ct = "Clone of local database: " + meta.remote_url.substring(meta.remote_url.lastIndexOf("/")+1)
        }
        else {
            ct = "Cloned from " + meta.remote_url
        }
        return (
            <span>
                <AiOutlineBlock className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
        )
    }
    else {
        ct = "Local Database"
    }
    return (
        <span>
            <AiFillDatabase className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </span>
    )
}

export const DBBranches = ({meta, user}) => {
    if(meta.branches && meta.branches.length > 1) {
        return (
            <span title={meta.branches.length + " branches"}>
                <AiOutlineBranches className="db_info_icon_spacing"/>
                <span className="db_info">{meta.branches.length} Branches</span>
            </span>
        )
    }
    return false
}

export const DBSize = ({meta, user}) => {
    if(meta.size){
        let bytes = formatBytes(meta.size)
        let tit = meta.size + " bytes";
        return (
            <span title={tit}>
                <AiFillBuild className="db_info_icon_spacing"/>
                <span className="db_info">{bytes}</span>
            </span>
        )
    }
    else {
        return (
            <span title={"This is an empty database"}>
                <AiOutlineInbox className="db_info_icon_spacing"/>
                <span className="db_info">empty</span>
            </span>
        )
    }
}


export const DBProductionCredits = ({meta, user}) => {
    if(meta){
        if(user.remote_id == meta.organization){
            var tit = "Personal Publication"
        }
        else {
            var tit = (meta.organization_type ? meta.organization_type + " Organization " + meta.organization : "")
        }
        let txt = (meta.organization_label ? meta.organization_label  : meta.organization)
        let icon = (meta.organization_icon ? (<img className="database-listing-organization-icon" src={meta.organization_icon}></img>) : "")
        return (
            <span title={tit}>
                <AiOutlineUser className="db_info_icon_spacing"/>
                <span className="db_info">Publisher: {icon} {txt}</span>
            </span>
        )
    }
    return null
}

export const DBRoleCredits = ({dbrec, user}) => {
    if(!dbrec) return null
    let rs = [];
    if(dbrec.roles){
        for(var i = 0 ; i<dbrec.roles.length; i++){
            rs.push(_get_role_title(dbrec.roles[i]))
        }
    }
    if(dbrec.public){
        if(rs.length == 0) rs.push("Public Database")
        return (
            <span>
                <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                <span className="db_info">{rs}</span>
            </span>
        )
    }
    if(rs.length == 0) rs.push("No access to remote database currently")
    return (
        <span>
            <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
            <span className="db_info">{rs}</span>
        </span>
    )
}

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

export const DBControlPanel = ({meta, user}) => {
    const [isImage, setImage] = useState(false);
    const [isIcon, setIcon] = useState(false);
    let disp = []
    function goDB(){
        if(meta.id) goDBHome(meta.id, meta.organization)
    }

    let icon = meta.icon

    if(!icon && meta.remote_record && meta.remote_record.icon) icon = meta.remote_record.icon
    if(!icon) icon = GRAPHDB
    let title = "Database ID: " + (meta.id ? meta.id : (meta.remote_record ? meta.remote_record.id : ""))

    if(icon){
        if(validURL(icon)) disp.push(<img className='database-listing-image' src={icon} title={title} key="xx1"  />)
        else disp.push(<i key="xx" className={'database-listing-icon ' + icon} title={title}/>)
    }

    return (
        <Col className='database-left-column'>
            {<Row key="rr" onClick={goDB}>
                {disp}
            </Row>}
            <Row key="rd" className="db-controls">
                <DBControls user={user}/>
            </Row>
        </Col>
    )
}

export const DBControls = ({meta, user, repo, onRefresh, onDelete}) => {

    function myDelete(){
        meta.action = 'delete'
        if(onAction) onAction(meta)
    }

    function myClone(){
        meta.action = 'clone'
        if(onAction) onAction(meta)
    }

    return (
        <Container className='database-controls database-listing-title-row'>
            <Row className='major-database-controls'>
                <span>
                    <span className='refresh-control'><CloneControl meta={meta} user={user} onClick={myClone}/></span>
                    <span className='delete-control'><DeleteControl meta={meta} user={user} onClick={myDelete}/></span>
                </span>
            </Row>
        </Container>
    )

}

export const DBStatus = ({meta, user, onAction}) => {
    return (
        <div className='database-action-column column-mod'>
            <DBMainAction meta={meta} user={user} onAction={onAction}/>
            <DBSecondaryAction meta={meta} user={user} onAction={onAction}/>
        </div>
    )
}


export const DBMainAction = ({meta, user, onAction}) => {
    function myClone(){
        meta.action = 'clone'
        if(onAction) onAction(meta)
    }
    return (<CloneControl meta={meta} user={user} onClick={myClone}/>)
}

export const DBSecondaryAction = ({meta, user, onAction}) => {
    function myDelete(){
        meta.action = 'delete'
        if(onAction) onAction(meta)
    }
    return (<DeleteControl meta={meta} user={user} onClick={myDelete}/> )
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function describe_unsynch(meta){
    let rts = meta && meta.remote_record ? meta.remote_record.updated : 0
    let lts = meta && meta.updated ? meta.updated : 0
    let problems = []
    if(lts == 0){
        problems.push("Local DB is uninitiallized")
    }
    if(rts == 0){
        problems.push("Remote DB is uninitiallized")
    }
    if(rts > 0 && rts > lts){
        let str = "Remote DB was updated at " + printts(rts, DATETIME_COMPLETE)
        if(lts > 0) str += " more recently than local at " + printts(lts, DATETIME_COMPLETE)
        problems.push( str )
    }
    if(lts > 0 && lts > rts){
        let str = "Local DB was updated at " + printts(lts, DATETIME_COMPLETE)
        if(rts > 0) str += " more recently than remote at " + printts(rts, DATETIME_COMPLETE)
        problems.push( str )
    }
    if(meta && meta.structure_mismatch){
        let brlen = (meta.branches ?meta.branches.length : 0)
        let rbrlen = (meta.remote_record && meta.remote_record.branches ? meta.remote_record.branches.length : 0)
        problems.push("Branch Structure out of synch: local DB has " + brlen + " branches, remote has " + rbrlen)
    }
    return problems.join(", ")
}

export const ShareControl = ({meta, user}) => {
    return <AiOutlineCloudUpload className={"db-main-action"} color="#0055bb " title="Save this database to your hub account"/>
}

export const PushControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"#ffbf00"} title={describe_unsynch(meta)}/>
}

export const PullControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"#ffbf00"} title={describe_unsynch(meta)}/>
}

export const CloneControl = ({meta, user}) => {
    return <span className="refresh-action"  title="Clone"><FaClone color="#155724" className='database-action database-listing-refresh' /> Clone</span>
    //return (<button  className="tdb__button__base tdb__button__base--bgreen">Clone</button>)
}

export const ClonedControl = ({meta, user}) => {
    return <AiOutlineBlock color={"#d1ecf1"} className={"db-main-action"} title={'Cloned from: ' + meta.remote_url}/>
}

export const ForkControl = ({meta, user}) => {
    return <AiOutlineFork  color={"#0055bb"}/>
}

export const NoCanControl = ({meta, user}) => {
    return <FontAwesomeIcon className='database-listing-nocando' icon={NO_CAN_DO_ICON} title="This Database cannot be shared on hub"/>
}

export const AllGoodControl = ({meta, user}) => {
    //return <FontAwesomeIcon className='database-listing-allgood' icon={ALL_GOOD_ICON} title={"Synchronised with original at " + meta.remote_url + " "  + describe_unsynch(meta)}/>
    return <AiOutlineCheckCircle className={"db-main-action"} color={"#00C08B"} title={"Synchronised with original at " + meta.remote_url + " "  + describe_unsynch(meta)}/>
}

export const SchemaControl = ({meta, type}) => {
    let css = (type == "inactive" ? 'database-inactive-action' : 'database-action database-listing-schema')
    let tit = (type == "inactive" ? 'Database has no schema' : 'Database has schema')
    //return <FontAwesomeIcon className={css} icon={SCHEMA_ICON} title={tit}/>
    if(type == "inactive"){
        return <BsBook className="db_info_icon_spacing" title={tit}  size={"1em"} color={"grey"}/>
    }
    else return <GiMeshBall title={tit}  className="db_info_icon_spacing" size={"1em"} />
}

export const DocumentsControl = ({meta}) => {
    return <FontAwesomeIcon className='database-listing-documents' icon={DOCUMENTS_ICON} title="View Documents"/>
}

export const RejectControl = ({meta}) => {
    return <button className="tdb__button__base tdb__button__base--bred"  title="Reject Invitation">Reject <AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /></button>
    //return <FontAwesomeIcon className='database-action database-listing-delete' icon={DELETE_ICON} title="Delete Database"/>
}

export const AcceptControl = ({meta}) => {
    return <AiFillCheckCircle className={"db-main-action"} color={"#00C08B"} title={"Accept Invitation to collaborate on database"}/>
    //return <FontAwesomeIcon className='database-listing-allgood' icon={ALL_GOOD_ICON} title={"Accept Invitation to collaborate on database"} />
}

export const DeleteControl = ({meta}) => {
    return <span className="delete-action"  title="Delete Database"><AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /> Delete</span>

    /*return <button className="tdb__button__base tdb__button__base--bred"  title="Delete Database">
                Delete
           </button>*/
           //<AiOutlineDelete color="#721c24" className='database-action database-listing-delete' />
    //return <FontAwesomeIcon className='database-action database-listing-delete' icon={DELETE_ICON} title="Delete Database"/>
}

export const TimeControl = ({meta, type}) => {
    let css = (type == "inactive" ? 'database-inactive-action' : 'database-action database-listing-time')
    let tit = (type == "inactive" ? 'Database has no commits' : 'Click to view the commit history')
    return <FontAwesomeIcon className={css} icon={COMMITS_ICON} title={tit}/>
}

export const QueryControl = ({meta}) => {
    return <FontAwesomeIcon className='database-action database-listing-query' icon={QUERY_ICON} title="Query this database now"/>
}
