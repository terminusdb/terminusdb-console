/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import React from "react"
import { GRAPHDB } from "../../constants/images"
import {Row, Col, Badge, Container} from "reactstrap"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {QUERY_ICON, DELETE_ICON, SCHEMA_ICON, DOCUMENTS_ICON, COMMITS_ICON, 
    SHARE_ICON, PUSH_ICON, PULL_ICON, CLONE_ICON, ALL_GOOD_ICON, NO_CAN_DO_ICON, CLONED_ICON } from "../../constants/faicons"
import { printts } from "../../constants/dates"
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"

export const DBList = ({list, className, user, onAction}) => {
    className = className || "database-listing-table"
    if(!list.length){
        return null
    }
    return (
        <Container fluid>
            {list.map((value, index) => {
                return (<DBSummary key={"sum_" + index} meta={value} user={user} onAction={onAction}/>)
            })}
        </Container> 
    )
} 

export const DBSummary = ({meta, user, onAction}) => {
    return (
        <Row key='r7' className='database-summary-listing'>
            <Col key='r5' md={2} className='database-control-panel'>
                <DBControlPanel meta={meta} user={user} />
            </Col>
            <Col md={8} className='database-main-content'>
                <Row key='r3'>
                    <DBTitle meta={meta} user={user} onAction={onAction}/>
                </Row>
                <Row key='r4'>
                    <DBCredits meta={meta}  user={user} />
                </Row>
                <Row key='r8'>
                    <DBDescription meta={meta}  user={user} />
                </Row>
            </Col>
            <Col key='r6' md={2} className='database-main-actions'>
                <DBStatus meta={meta}  user={user}  onAction={onAction}/>
            </Col>
        </Row>
    )
}



export const DBTitle = ({meta, user, onAction}) => {
    function goDB(){
        if(meta.id) goDBHome(meta.id, meta.organization)
        else onAction('clone', meta)
    }
    if(meta.label && meta.label.length > 40){
        var str =  meta.label.substring(36) + " ..."
    }
    else str = meta.label || ""

    return (
        <Container onClick={goDB} className='database-listing-title-row'>
            <span key='a' className="database-listing-title">{str}</span>
            <span key='b' className="database-listing-id">{meta.url}</span>
        </Container>
    )
}

export const DBCredits = ({meta, user}) => {
    var credits = RemoteDBCredits(meta, user)            
    return (
        <Row>
            {credits}
        </Row>
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

export const DBSize = ({meta, user}) => {
    if(meta.size){
        let bytes = formatBytes(meta.size)
        return (<Badge color="info">{bytes}</Badge>)
    }
    else {
        return (<Badge color="warning">empty</Badge>)
    }
}


export const DBCreated = ({meta, user}) => {
    let ct = (meta.created ? "Created " +  printts(meta.created) : " ~ ")
    if(meta.updated) { 
        ct += " Updated "
        if(meta.author) ct += "by " + meta.author + " at " 
        ct += printts(meta.updated)
    }
    return (<Badge color="light">{ct}</Badge>)
}

export const RemoteDBCredits = (meta, user) => {
    let res = []
    if(meta.created){
        res.push(
            <Col key='x1' className="database-created-credits">
                <DBCreated meta={meta}  user={user}/>
            </Col>
        )
    }
    res.push(
        <Col key='x2' className="database-size-credits">
            <DBSize meta={meta} user={user} />
        </Col>
    )
    if(user.logged_in && user.has_remote_roles && meta.remote){
        if(meta.type == "remote"){
            res.push(
                <Col key='c1' className="database-production-credits">
                    <DBProductionCredits meta={meta} user={user} />
                </Col>
            )
            res.push(
                <Col key='c3' className="database-role-credits">
                    <DBRoleCredits meta={meta} user={user} />
                </Col>
            )
            res.push(
                <Col key='c2' className="database-contribution-credits">
                    <DBContributionCredits meta={meta}  user={user}/>
                </Col>        
            )
        }
    }
    else if(user.logged_in && meta.remote_record){
        res.push(
            <Col key='c1' className="database-production-credits">
                <DBProductionCredits meta={meta} user={user} />
            </Col>
        )
    }
    return res
}

export const DBProductionCredits = ({meta, user}) => {
    if(meta.remote_record){
        let rec = meta.remote_record.organization_record
        if(rec){
            return (<Badge color="light" title={rec.type + " Organization " + rec.id}>{rec.label}</Badge>)            
        }
        else {
            return (<Badge color="light">{meta.remote_record.organization}</Badge>)
        }
    }
    return null
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

export const DBRoleCredits = ({meta, user}) => {
    if(meta.remote_record){
        let dbrec = meta.remote_record
        let orgrec = dbrec.organization_record
        let rs = [];
        if(dbrec.organization_roles){
            for(var i = 0 ; i<dbrec.organization_roles.length; i++){
                rs.push(_get_role_title(dbrec.organization_roles[i], orgrec.type))
            }
        }
        if(dbrec.roles){
            for(var i = 0 ; i<dbrec.roles.length; i++){
                rs.push(_get_role_title(dbrec.roles[i]))
            }
        }
        if(dbrec.public){
            if(rs.length == 0) rs.push("Public")            
            return (<Badge color="info" title="Public Database">{rs}</Badge>)                
        }
        if(rs.length == 0) rs.push("Intruder")            
        return (<Badge color="warning" title="Private Database">{rs}</Badge>)                
    }
    return null
}

export const DBContributionCredits = ({meta}) => {
    return null
    //return (<Badge color="success">Your Contributions</Badge>)
}


export const DBControlPanel = ({meta, user}) => {
    let icon = meta.icon || GRAPHDB
    let title = "Database " + meta.id
    return (
        <Col className='database-left-column'>
            <Row>
                <img className='database-listing-icon' src={icon} title={title} />
            </Row>
            <Row>
                <DBControls meta={meta}  user={user}/>
            </Row>
        </Col>
    )
}

export const DBControls = ({meta, user}) => {
    let show_schema = meta.schema 
    let show_tt = meta.created  
    let show_q = meta.id
    let show_delete = true
    let controls = []

    function goToPage(page){
        goDBPage(meta.id, meta.organization, page)
    }

    function showDelete(){
        alert("we have to write the delete dialogs")
    }
    if(show_tt){
        controls.push( <TimeControl meta={meta} user={user} /> )
    }
    else {
        controls.push("")
    }
    if(show_q){
        controls.push( <QueryControl meta={meta} user={user} /> )
    }
    else {
        controls.push("")
    }
    if(show_schema){
        controls.push( <DocumentsControl meta={meta} user={user} /> )
        controls.push( <SchemaControl meta={meta} user={user}  /> )
    }  
    else {
        controls.push("")
        controls.push("")
    }
    if(show_delete){
        controls.push( <DeleteControl meta={meta} user={user} /> )
    }    
    else {
        controls.push("")
    }
    controls.push("")
    return (
        <Container className='database-controls'>
            <Row className='major-database-controls'>
                <Col className='time-control' onClick={function(){if(show_tt) goToPage('commits')}}>
                    {controls[0]}
                </Col>
                <Col className='query-control' onClick={function(){if(show_q) goToPage('query')}}>
                    {controls[1]}
                </Col>
            </Row>
            <Row className='minor-database-controls'>
                <Col className='minor-control' onClick={function(){if(show_schema) goToPage('schema')}}>
                    {controls[2]}
                </Col>
                <Col className='minor-control' onClick={function(){if(show_schema) goToPage('document')}}>
                    {controls[3]}
                </Col>
            </Row>
        </Container>
    )
}

function _user_db_action(meta, user){
    if(user.logged_in && !meta.remote){
        if(meta.remote_record){
            return 'clone'
        }
        return false;//return 'share'
    }
    else if(user.logged_in && meta.type == 'remote' && meta.remote_record){
        let remote_commit = meta.remote_record.latest
        let rts = remote_commit.updated || 0
        let lts = meta.updated || 0
        if(rts > lts && canPull(meta)){
            return 'pull'
        }
        if(lts > rts && canPush(meta)){
            return 'push'
        }
    }
    return false
}

function canPull(meta){
    if(meta.public) return true
    if(meta.remote_record){
        let allroles = meta.remote_record.roles || []
        allroles = allroles.concat(meta.remote_record.organization_roles || [])
        if(allroles.indexOf('create') == -1 && allroles.indexOf('write') == -1 && allroles.indexOf('read') == -1 && allroles.indexOf('manage') == -1) return false
        return true
    }
    return false        
}

function canPush(meta){
    if(meta.remote_record){
        let allroles = meta.roles || []
        allroles = allroles.concat(meta.remote_record.organization_roles || [])
        if(allroles.indexOf('create') == -1 && allroles.indexOf('write') == -1) return false
        return true
    }
    return false
}

export const DBStatus = ({meta, user, onAction}) => {

    function doMainAction(){
        let act = _user_db_action(meta, user)
        if(act) onAction(act, meta)
    }

    return (
        <Col className='database-action-column'>
            <Row className='database-update-status'>
                <RemoteUpdated meta={meta}  user={user}/>
            </Row>
            <Row className='database-action-option' onClick={doMainAction}>
                <DBMainAction meta={meta} user={user} />
            </Row>
            <Row className='database-secondary-option'>
                <DBSecondaryAction meta={meta} user={user} />
            </Row>
        </Col>
    )
}

export const RemoteUpdated = ({meta, user}) => {
    let act = _user_db_action(meta, user)
    if(act == 'share') act = "save to hub"
    if(act == 'pull' || act == 'push') act = "needs synchronise"
    if(act){
        return (<span>{act}</span>) 
    }
    return null
}

export const DBMainAction = ({meta, user}) => {
    let act = _user_db_action(meta, user)
    if(act == 'pull'){
        return (<PullControl meta={meta} user={user} />)            
    }
    else if(act == 'push'){
        return (<PushControl meta={meta} user={user} />)            
    }
    else if(act == 'clone'){
        return (<CloneControl meta={meta} user={user}/>)                
    }
    else if(act == 'share'){
        return (<ShareControl meta={meta} user={user}/>)
    }
    else if(!act && meta.remote){        
        if(meta.remote_record && canPull(meta) && meta.remote_record.latest && meta.remote_record.latest.updated == meta.updated){
            return (<AllGoodControl meta={meta} user={user} />)            
        }
        return (<ClonedControl meta={meta} user={user} />)            
    }
    return null
}

export const DBSecondaryAction = ({meta, user}) => {
    return null
    //return (<span>second action</span>)
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
    let remote_commit = meta.remote_record.latest
    let rts = remote_commit.updated || 0
    let lts = meta.updated || 0
    if(lts == 0){
        return "Local DB is uninitiallized"
    }
    if(rts == 0){
        return "Remote DB is uninitiallized"
    }
    if(rts > lts){
        return "Remote DB was updated at " + printts(rts) + " more recently than local " + printts(lts) 
    }
    else {
        return "Local DB was updated at " + printts(lts) + " more recently than remote at " + printts(rts) 
    }    
}



export const ShareControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-action database-listing-share' icon={SHARE_ICON} title="Save this database to your hub account"/>
}

export const PushControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-action database-listing-push' icon={PUSH_ICON}  title={describe_unsynch(meta)} />
}

export const PullControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-action database-listing-pull' icon={PULL_ICON}  title={describe_unsynch(meta)} />
}

export const CloneControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-action database-listing-clone' icon={CLONE_ICON} title="Clone this database now"/>
}

export const ClonedControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-no-action database-listing-cloned' icon={CLONED_ICON} title={'Cloned from: ' + meta.remote}/>
}

export const NoCanControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-listing-nocando' icon={NO_CAN_DO_ICON} title="This Database cannot be shared on hub"/>
}

export const AllGoodControl = ({meta, user}) => {    
    return <FontAwesomeIcon className='database-listing-allgood' icon={ALL_GOOD_ICON} title="Everything is up to date and good to go"/>
}

export const SchemaControl = ({meta}) => {
    return <FontAwesomeIcon className='database-action database-listing-schema' icon={SCHEMA_ICON} title="View the schema"/>
}

export const DocumentsControl = ({meta}) => {
    return <FontAwesomeIcon className='database-listing-documents' icon={DOCUMENTS_ICON} title="View Documents"/>
}

export const DeleteControl = ({meta}) => {
    return <FontAwesomeIcon className='database-action database-listing-delete' icon={DELETE_ICON} title="Delete Database"/>
}

export const TimeControl = ({meta}) => {
    return <FontAwesomeIcon className='database-action database-listing-time' icon={COMMITS_ICON} title="View the commit history"/>
}

export const QueryControl = ({meta}) => {    
    return <FontAwesomeIcon className='database-action database-listing-query' icon={QUERY_ICON} title="Query this database now"/>
}