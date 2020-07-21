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
    AiOutlineCloudSync, AiOutlineCloudDownload,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild,
    AiOutlineGlobal, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete} from 'react-icons/ai';
import { BsBook } from 'react-icons/bs';
import { GiOpenBook } from 'react-icons/gi';


export const DBList = ({list, className, user, onAction, filter, sort}) => {
    className = className || "database-listing-table"
    if(!list.length){
        return null
    }
    return (
        <Container fluid>
            {list.map((value, index) => {
                return (<DBSummaryCard key={"sum_" + index} meta={value} user={user} onAction={onAction}/>)
            })}
        </Container>
    )
}


//what is the primary action available to the user
function _user_db_action(meta, user){
    if(meta.remote_url){
        if(user.logged_in){
            if(!meta.id){
                return 'clone'
            }
            if(meta.type == 'local_clone'){
                return 'synchronise'
            }
            else if(meta.type == 'remote' && meta.remote_record.actions && meta.remote_record.actions.indexOf("pull") != -1){
                return 'synchronise'
            }
        }
        else {
            if(meta.type == 'local_clone'){
                return 'synchronise'
            }
            return false
        }
    }
    else {
        if(user.logged_in){
            return 'share'
        }
    }
}


export const DBSummaryCard = ({meta, user, title_max, onAction}) => {
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
                setLoading(true)
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
                <Col md={8} className='database-main-content'>
                    <Row key='r3'>
                        <DBTitle meta={meta} user={user} max={title_max}/>
                    </Row>
                    <Row key='r4'>
                        <DBCredits meta={meta}  user={user} />
                    </Row>
                    <Row key='r8'>
                        {decr}
                    </Row>
                </Col>
                <Col key='r6' md={2} className='database-main-actions'>
                    <DBStatus meta={meta}  user={user}  onAction={onGo}/>
                </Col>
            </>}
        </Row>
    )
}

export const DBTitle = ({meta, user, onAction, max}) => {
    let maxtitle = max || 40, author = false

    function goDB(){

        if(meta.id) goDBHome(meta.id, meta.organization)
        //else onAction('clone', meta)
    }

    let title_css = meta.id ? "database-title-local" : "database-title-missing"
    let title_html = "" //meta.id ? "database id: " + meta.id : "Available to clone from Terminus Hub"

    if(meta.remote_record && meta.remote_record.label){
        title_css = "database-title-remote"
        if(meta.remote_record.label != meta.label) title_html += " Cloned from original with title: " + meta.remote_record.label
    }

    if(meta.label && meta.label.length > maxtitle){
        var str =  meta.label.substring(maxtitle -4) + " ..."
    }
    else str = meta.label || ""

    if(meta.remote_record && meta.author){
        author = meta.author
    }

    return (
        <span>
            <span onClick={goDB} title={title_html} className='database-listing-title-row'>
                <span key='a' className={title_css + " database-listing-title"}>{str}</span>
            </span>
            {false && <span className="author_info">{author}</span>}
        </span>

    )
}

export const DBCredits = ({meta, user}) => {
    let res = []

    if(meta && (meta.created || meta.updated)) {
        res.push(<DBTimings key='dbt' meta={meta} user={user} />)
    }

    res.push(
        <DBSize  key='ab' meta={meta} user={user} />
    )
    if(meta.branches && meta.branches.length > 1) {
        res.push(
            <DBBranches  key='abc' meta={meta} user={user} />
        )
    }

    if(meta && meta.remote_record && user.logged_in && meta.type != "local_clone"){
        res.push (
            <DBProductionCredits  key='ac' meta={meta} user={user} />
        )
        res.push(
            <DBRoleCredits  key='ad' meta={meta} user={user} />
        )
        res.push(
            <DBContributionCredits  key='ae' meta={meta}  user={user}/>
        )
        res.push(
            <DBSchemaStatus key='as' meta={meta}  user={user}/>
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const DBBranches = ({meta, user}) => {
    if(meta.branches && meta.branches.length > 1) {
        return (
            <span title={meta.branches.length + " branches"}>
                <AiOutlineBranches className="db_info_icon_spacing"/>
                <span className="db_info">{meta.branches.length}</span>
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
    if(meta.remote_record){
        if(user.remote_id == meta.remote_record.organization){
            var tit = "Personal Publication"
        }
        else {
            var tit = (meta.remote_record.organization_type ? meta.remote_record.organization_type + " Organization " + meta.remote_record.organization : "")
        }
        let txt = (meta.remote_record.organization_label ? meta.remote_record.organization_label  : meta.remote_record.organization)
        let icon = (meta.remote_record.organization_icon ? (<img className="database-listing-organization-icon" src={meta.remote_record.organization_icon}></img>) : "")
        return (
            <span title={tit}>
                <AiOutlineUser className="db_info_icon_spacing"/>
                <span className="db_info">Publisher: {icon} {txt}</span>
            </span>
        )      
    }
    return null
}

export const DBRoleCredits = ({meta, user}) => {
    if(meta.remote_record){
        let dbrec = meta.remote_record
        let rs = [];
        if(dbrec.organization_roles){
            for(var i = 0 ; i<dbrec.organization_roles.length; i++){
                rs.push(_get_role_title(dbrec.organization_roles[i], dbrec.organization_type))
            }
        }
        if(dbrec.roles){
            for(var i = 0 ; i<dbrec.roles.length; i++){
                rs.push(_get_role_title(dbrec.roles[i]))
            }
        }
        if(meta.public || (meta.remote_record && meta.remote_record.public)){
            if(rs.length == 0) rs.push("Public")
            return (
                <span>
                    <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                    <span className="db_info">{rs}</span>
                </span>
            )           
        }
        if(rs.length == 0) rs.push("No Access")
        return (
            <span>
                <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
                <span className="db_info">{rs}</span>
            </span>
        )
    }
    return null
}

export const DBSchemaStatus =  ({meta, user}) => {
    return <SchemaControl meta={meta} user={user}  />
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

export const DBTimings = ({meta, user}) => {
    let parts = []

    function updateStamp(ts, author_game){
        let lab = moment(ts*1000).startOf('hour').fromNow()
        if(author_game && meta.remote_record && meta.author){
            lab += " (" + meta.author + ")"
        }
        return lab
    }

    if(meta.created && meta.updated && (meta.created == meta.updated)){
        let cts = updateStamp(meta.created, true)
        parts.push(<DBCreated key='xss' display={cts} ts={meta.created} author={meta.author}/>)
    }
    else {
        if(meta.created){
            let cats = updateStamp(meta.created, !meta.updated)
            parts.push(<DBCreated key='ds' display={cats} ts={meta.created} />)
        }
        if(meta.updated){
            let uts = updateStamp(meta.updated, true)
            parts.push(<DBUpdated key='dbu' display={uts} ts={meta.updated} author={meta.author}/>)
        }
    }
    return parts
}

export const DBCreated = ({display, ts, author}) => {
    let ct = "Created at " + printts(ts, DATETIME_COMPLETE)
    if(author) ct += " by " + author
    return (
        <span title={ct}>
            <AiFillInfoCircle className="db_info_icon_spacing"/>
            <span className="db_info">{display}</span>
        </span>
    )
}

export const DBUpdated = ({display, ts, author}) => {
    let ct = "Updated at " + printts(ts, DATETIME_COMPLETE)
    if(author) ct += " by " + author
    return (
        <span title={ct}>
            <AiOutlineBook className="db_info_icon_spacing"/>
            <span className="db_info">{display}</span>
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


export const DBContributionCredits = ({meta, user}) => {
    return null
    return (<Badge color="success">Your Contributions</Badge>)
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
    let title = "Database " + meta.id

    if(icon){
        var imageExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];
        const [extension, ...nameParts] = icon.split('.').reverse();
        if(imageExtensions.includes(extension))
            disp.push(<img className='database-listing-image' src={icon} title={title} />)
        else disp.push(<i className={'database-listing-icon ' + icon} title={title}/>)
    }

    return (
        <Col className='database-left-column'>
            {<Row onClick={goDB}>
                {disp}
            </Row>}
        </Col>
    )
}

export const DBControls = ({meta, user}) => {
    let show_schema = meta.schema
    let show_tt = meta.created
    let show_q = meta.id
    let controls = []

    function goToPage(page){
        goDBPage(meta.id, meta.organization, page)
    }
    if(show_tt){
        controls.push( <TimeControl meta={meta} user={user} /> )
    }
    else {
        controls.push(<TimeControl meta={meta} user={user} type='inactive'/>)
    }
    if(show_q){
        controls.push( <QueryControl meta={meta} user={user} /> )
    }
    else {
        controls.push( <QueryControl meta={meta} user={user} type='inactive'/> )
    }
    if(show_schema){
        controls.push( <SchemaControl meta={meta} user={user}  /> )
    }
    else {
        controls.push( <SchemaControl meta={meta} user={user} type='inactive' /> )
    }
    if(!meta.id) return null
    return (
        <Container className='database-controls database-listing-title-row'>
            <Row className='major-database-controls'>
                {/*<Col className='time-control' onClick={function(){if(show_tt) goToPage('commits')}}>
                    {controls[0]}
                </Col>*/}
                <Col className='schema-control' onClick={function(){if(show_schema) goToPage('schema')}}>
                    {controls[2]}
                </Col>
               {/* <Col className='query-control' onClick={function(){if(show_q) goToPage('query')}}>
                    {controls[1]}
                </Col>*/}
            </Row>
        </Container>
    )
}

export const DBStatus = ({meta, user, onAction}) => {
    return (
        <Col className='database-action-column'>
            <Row className='database-update-status'>
                <RemoteUpdated meta={meta}  user={user}/>
            </Row>
            <Row className='database-action-option' onClick={onAction}>
                <DBMainAction meta={meta} user={user} />
            </Row>
            <Row className='database-secondary-option'>
                <DBSecondaryAction meta={meta} user={user} onAction={onAction}/>
            </Row>
        </Col>
    )
}

export const RemoteUpdated = ({meta, user}) => {
    let act = meta.action, css = "database-main-action-message";
    switch(act){
        case 'share':
            act = "upload to hub"
            css = css + " share-color"
            break;
        case 'synchronise':
            if(meta.structure_mismatch || meta.ahead || meta.behind){
                act = "needs synchronize"
                css = css + " synchronise-color"
            }
            else{
                act = "synchronized"
                css = css + " synchronised-color"
            }
            break;
        case 'clone':
            css = css+ " clone-color"
            break;
        default:
            act = "Cloned"
            css = css+ " cloned-color"
            break;

    }
    /*if(act == 'share'){
        act = "upload to hub"
        css = css + " share-control"
    }
    if(act == 'synchronise') {
        if(meta.structure_mismatch || meta.ahead || meta.behind){
            act = "needs synchronise"
            css = css + " synchronise-control"
        }
        else{
            act = "synchronised"
            css = css + " synchronised-control"
        }
    }*/
    if(act){
        return (<span className={css}>{act}</span>)
    }
    return null
}

export const DBMainAction = ({meta, user}) => {
    let act = meta.action
    if(act == 'synchronise' && meta.remote_record && (meta.type=='local_clone' || (meta.remote_record.actions && meta.remote_record.actions.indexOf('pull') != -1))){
        if(meta.structure_mismatch || meta.ahead || meta.behind){
            return (<PullControl meta={meta} user={user} />)
        } else {
            return (<AllGoodControl meta={meta} user={user} />)
        }
    }
    else if(act == 'clone'){
        return (<CloneControl meta={meta} user={user}/>)
    }
    else if(act == 'share'){
        return (<ShareControl meta={meta} user={user}/>)
    }
    else if(meta.remote_url){
        return (<ClonedControl meta={meta} user={user} />)
    }
    return null
}

export const DBSecondaryAction = ({meta, user, onAction}) => {

    function userCanDelete(meta, user){
        if(meta.remote_record && meta.remote_record.organization_roles){
            let roles = meta.remote_record.organization_roles
            return (roles.indexOf("create") != -1)
        }
        return false
    }

    function myDelete(){
        meta.action = 'delete'
        if(onAction) onAction(meta)
    }

    function myFork(){
        meta.action = 'fork'
        if(onAction) onAction(meta)
    }

    if(meta.action == 'clone'){
        if(userCanDelete(meta, user)){
            return (<span onClick={myDelete}><DeleteControl meta={meta} user={user} /></span>)
        }
        else {
            return (<span onClick={myFork}>Fork <ForkControl meta={meta} user={user} /></span>)
        }
    }
    return null
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
    return <AiOutlineCloudUpload color="#0055bb " title="Save this database to your hub account"/>
    //return <FontAwesomeIcon className='database-action database-listing-share' icon={SHARE_ICON} title="Save this database to your hub account"/>
}

export const PushControl = ({meta, user}) => {
    return <AiOutlineCloudSync color={"ffbf00"} title={describe_unsynch(meta)}/>
    //return <FontAwesomeIcon className='database-action database-listing-push' icon={PUSH_ICON}  title={describe_unsynch(meta)} />
}

export const PullControl = ({meta, user}) => {
    return <AiOutlineCloudSync color={"ffbf00"} title={describe_unsynch(meta)}/>
    //return <FontAwesomeIcon className='database-action database-listing-pull' icon={PULL_ICON}  title={describe_unsynch(meta)} />
}

export const CloneControl = ({meta, user}) => {
    //return <FontAwesomeIcon className='database-action database-listing-clone' icon={CLONE_ICON} title="Clone this database now"/>
    return <AiOutlineCloudDownload color={"#4984c9"} title="Clone this database now"/>
}

export const ClonedControl = ({meta, user}) => {
    //return <FontAwesomeIcon className='database-no-action database-listing-cloned' icon={CLONED_ICON} title={'Cloned from: ' + meta.remote_url}/>
    return <AiOutlineBlock color={"#d1ecf1"} title={'Cloned from: ' + meta.remote_url}/>
}

export const ForkControl = ({meta, user}) => {
    return <FontAwesomeIcon className='' icon={CLONED_ICON} title={'Fork: ' + meta.remote_url}/>
}

export const NoCanControl = ({meta, user}) => {
    return <FontAwesomeIcon className='database-listing-nocando' icon={NO_CAN_DO_ICON} title="This Database cannot be shared on hub"/>
}

export const AllGoodControl = ({meta, user}) => {
    //return <FontAwesomeIcon className='database-listing-allgood' icon={ALL_GOOD_ICON} title={"Synchronised with original at " + meta.remote_url + " "  + describe_unsynch(meta)}/>
    return <AiOutlineCheckCircle color={"#00C08B"} title={"Synchronised with original at " + meta.remote_url + " "  + describe_unsynch(meta)}/>
}

export const SchemaControl = ({meta, type}) => {
    let css = (type == "inactive" ? 'database-inactive-action' : 'database-action database-listing-schema')
    let tit = (type == "inactive" ? 'Database has no schema' : 'Click to view the database schema')
    //return <FontAwesomeIcon className={css} icon={SCHEMA_ICON} title={tit}/>
    if(type == "inactive"){
        return <BsBook className="db_info_icon_spacing" title={tit}  size={"1em"} color={"grey"}/>
    }
    else return <GiOpenBook title={tit}  className="db_info_icon_spacing" size={"1em"} color={"#00C08B"}/>
}

export const DocumentsControl = ({meta}) => {
    return <FontAwesomeIcon className='database-listing-documents' icon={DOCUMENTS_ICON} title="View Documents"/>
}

export const DeleteControl = ({meta}) => {
    return <AiOutlineDelete color="#d9534f" className='database-action database-listing-delete' title="Delete Database"/>
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
