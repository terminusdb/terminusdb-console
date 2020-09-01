/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import React, {useState, useEffect, Fragment} from "react"
import { GRAPHDB, HUBDB } from "../../constants/images"
import {Row, Col, Container} from "reactstrap"
import {goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import { TERMINUS_ERROR, TERMINUS_COMPONENT } from "../../constants/identifiers"
import Loading from "../../components/Reports/Loading"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import { AiOutlineCloudUpload, AiOutlineCloudSync, AiOutlineCloudDownload, AiFillInfoCircle,
    AiFillWarning, AiFillBuild, AiOutlineInbox} from 'react-icons/ai';
import { BsFillEnvelopeFill } from 'react-icons/bs';
import { validURL } from '../../utils/helperFunctions'
import {CloneProductionCredits, CloneRoleCredits, DBLastCommit, DBBranches, DBPrivacy, DBEmpty, DBTimings} from "../Pages/ClonePage"
import {DescribeDifferences, AreSynched} from "../DBSynchronize/DBDifferences"

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
                if(meta.type == "invite") return "accept"
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

    function loadHubDB(){
        meta.action = "hub"
        onGo()
    }

    function onGo(){
        if(onAction){
            setReport(false)
            if(!meta.action) return
            let uerr = onAction(meta, noGo)
            if(uerr){
                setReport({status: TERMINUS_ERROR, message: uerr, error: {}})
            }
        }
    }

    let decr = (report ? (<TerminusDBSpeaks report={report} />) : (<DBDescription meta={meta}  user={user} />))
    return (
        <Row key='r7' className='database-summary-listing database-listing-line'>
            {loading &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {!loading && <>
                <Col key='r5' md={2} className='database-control-panel'>
                    <DBControlPanel meta={meta} user={user} />
                </Col>
                <Col md={8} className='database-main-content'>
                    <Row key='r3'>
                        <DBTitle meta={meta} user={user} max={title_max} goHubDB={loadHubDB}/>
                    </Row>
                    <Row key='r4' className="database-listing-credits-row">
                        <DBCredits meta={meta}  user={user} />
                    </Row>
                    <Row key='r8'>
                        {decr}
                    </Row>
                    {meta.type == "invite" &&
                    <Row key='r9'>
                        <DBInvite meta={meta}/>
                    </Row>
                    }
                </Col>
                <Col key='r6' md={2} className='database-main-actions'>
                    {user.logged_in && 
                        <DBStatus meta={meta}  user={user}  onAction={onGo}/>
                    }
                </Col>
            </>}
        </Row>
    )
}

export const DBInvite = ({meta}) => {
    return (
        <div className="database-listing-description-row">
            <span>
                <BsFillEnvelopeFill className="invitation_info_icon_spacing"/>
                <span className="db_info"><span className="invite-user">{meta.remote_record.inviter}</span> has invited you to collaborate on this database: "{meta.remote_record.invitation}"</span>
            </span>
        </div>
    )
}


export const DBTitle = ({meta, user, goHubDB, max}) => {
    let maxtitle = max || 40, author = false

    function goDB(){
        if(meta.id) goDBHome(meta.id, meta.organization)
        else goHubDB(meta)
    }

    let title_css = meta.id ? "database-title-local" : "database-title-missing"
    let title_html = meta.id ? "Visit database id: " + meta.id : "View on Terminus Hub"

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
    res.push(
        <DBID key='abcddd' meta={meta} />
    )

    if(meta.branches && meta.branches.length > 1) {
        res.push(
            <DBBranches  key='abc' meta={meta} user={user} />
        )
    }
    if(meta && meta.remote_record && user.logged_in && meta.type != "local_clone"){
        res.push (
            <CloneProductionCredits  key='ac' meta={meta.remote_record} user={user} />
        )
        res.push(
            <CloneRoleCredits key='ad' meta={meta.remote_record} user={user} />
        )
        res.push(
            <DBPrivacy key='af' meta={meta.remote_record} user={user} />
        )
    }
    if(meta && (meta.created || meta.updated)) {
        res.push(<DBTimings key='dbt' meta={meta} user={user} />)
    }
    else {
        res.push(<DBEmpty key='dbt' meta={meta} user={user} />)
    }
    if(typeof meta.size != "undefined"){
        res.push(
            <DBSize  key='ab' meta={meta} user={user} />
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const DBID = ({meta}) => {
    if(!(meta && meta.id)) return null
    return (
        <span className="db-card-credit local-db-id">
            <AiFillInfoCircle className="db_info_icon_spacing"/>
            <span className="db_info">
                <span className="db-card-label">ID</span>
                <span className="db-card-id"> {meta.id} </span>
            </span>
        </span>
    )
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

export const DBDescription = ({meta, user}) => {
    if(meta.comment && meta.comment.length > 80 && !meta.testing){
        var str =  meta.comment.substring(76) + " ..."
    }
    else str = meta.comment || ""
    return (
        <Row key='z' className='database-listing-description-row'>
            <span className="database-listing-description-summary">{str}</span>
        </Row>
    )
}


export const DBControlPanel = ({meta, user}) => {
    let disp = []
    function goDB(){
        if(meta.id) goDBHome(meta.id, meta.organization)
        else if(meta.remote_record) goHubPage(meta.remote_record.organization, meta.remote_record.id)
    }

    let icon = meta.icon

    if(!icon && meta.remote_record && meta.remote_record.icon) icon = meta.remote_record.icon
    if(!icon && meta.remote_record && meta.remote_record.organization_icon) icon = meta.remote_record.organization_icon
    if(!icon) icon = GRAPHDB
    let title = "Database ID: " + (meta.id ? meta.id : meta.remote_record.id)

    if(icon){
        if(validURL(icon)) disp.push(<img className='db-home-listing-image' src={icon} title={title} key="xx1"  />)
        else disp.push(<i key="xx" className={'database-listing-icon ' + icon} title={title}/>)
    }

    return (
        <Col className='database-left-column'>
            {<Row key="rr" className="dbicon-container" onClick={goDB}>
                {disp}
            </Row>}
        </Col>
    )
}

export const isOnHub = (meta) => {
    let huburl = "https://hub."
    return (meta.remote_url && meta.remote_url.substring(0, huburl.length) == huburl)
}

export const DBStatus = ({meta, user, onAction}) => {

    let [hov, setHov] = useState()
    let onhub = isOnHub(meta)
    let mode = (onhub ? meta.action : "share")
    let text = (onhub ? "" : "Share your Database on Terminus Hub")
    let title = "Save to Terminus Hub"
    if(onhub){
        if(!meta.remote_record || meta.remote_record.actions && 
            meta.remote_record.actions.indexOf('pull') == -1){
            meta.action = "synchronise"
            mode = "cloned"
            title = "Cloned From Terminus Hub"
            text = <span className="tooltip-warning">
                <AiFillWarning className="tooltip-warning-icon" /> 
                {`This database was cloned from ${meta.remote_url} on Terminus Hub but the source is currently unavailable`}
                </span>
        }
        else if(meta.action == 'synchronise' && meta.remote_record){
            mode = AreSynched(meta, meta.remote_record) ? "synch" : "unsynch"
            title = (mode == "synch" ? "Synchronized" : "Not Synchronized") 
            title += ` with (${meta.remote_record.organization}/${meta.remote_record.id})`
            text = <span className="tooltip-differences">
                <DescribeDifferences a={meta} b={meta.remote_record} />
                <DBLastCommit meta={meta} />
            </span>
        }
        else if(meta.action == 'clone'){
            mode = "clone"
            title = "Clone from Terminus Hub"
            text = <span>Click to Clone Database <strong>
                    {meta.remote_record.label}
                </strong>
                 ({meta.remote_record.organization}/{meta.remote_record.id})</span>
        }
    }
    return (

        <div className='database-action-column'>
            <div className="hub-minor-actions">
            </div>
            <span className='action-tooltip-holder'>
                {hov && 
                    <div className='action-tooltip'>
                        <span className="tooltip-action-title">{title}</span>
                        <span className="tooltip-image">
                            <img className='database-widget-image' src={HUBDB} />
                        </span> 
                        <span className="action-tooltip-text">
                            {text}
                        </span>
                    </div>
                }
            </span>
            <div className="hub-major-actions">
                <span 
                    onClick={onAction} 
                    className='hub-main-action'
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                >
                    {mode == "clone" && 
                        <CloneControl meta={meta} />
                    }
                    {mode == "cloned" && 
                        <ClonedControl meta={meta}/>
                    }
                    {mode == "share" && 
                        <ShareControl meta={meta}/>
                    }
                    {mode == "unsynch" && 
                        <UnsynchControl meta={meta}/>
                    }
                    {mode == "synch" && 
                        <AllGoodControl meta={meta}/>
                    }
                </span>
            </div>
        </div> 
    )
}

export const ShareControl = ({meta}) => {
    return <span className="database-clone-action">
             <AiOutlineCloudUpload className="hub-main-action-icon share-main-action-icon" title="Save this database to your hub account"/>
        </span>
}

export const UnsynchControl = ({meta}) => {
    return <span className="database-clone-action">
        <AiOutlineCloudSync className="hub-main-action-icon unsynch-main-action-icon" title="Databases are out of synch"/>
    </span>
}

export const CloneControl = ({meta}) => {
    return <span className="database-clone-action">
        <AiOutlineCloudDownload className="hub-main-action-icon clone-main-action-icon" title="Clone this database now"/>
    </span>
}

export const ClonedControl = ({meta}) => {
    return <span className="database-clone-action">
        <AiOutlineCloudSync className="hub-main-action-icon cloned-main-action-icon" title={'Cloned from Terminus Hub ' + meta.remote_url}/>
    </span>
}

export const AllGoodControl = ({meta}) => {
    return <span className="database-clone-action">
        <AiOutlineCloudSync className="hub-main-action-icon ok-main-action-icon" title={'Cloned from Terminus Hub ' + meta.remote_url}/>
    </span>
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}



