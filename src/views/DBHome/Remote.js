/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import { GRAPHDB } from "../../constants/images"
import {Row, Col, Badge, Container} from "reactstrap"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {QUERY_ICON, DELETE_ICON, SCHEMA_ICON, DOCUMENTS_ICON, COMMITS_ICON,
    SHARE_ICON, PUSH_ICON, PULL_ICON, CLONE_ICON, ALL_GOOD_ICON, NO_CAN_DO_ICON, CLONED_ICON } from "../../constants/faicons"
import { printts } from "../../constants/dates"
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"
import Loading from "../../components/Reports/Loading"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import { DATETIME_COMPLETE, DATETIME_REGULAR, DATE_REGULAR } from "../../constants/dates"
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCopy,
    AiOutlineCloudSync, AiOutlineCloudDownload, AiOutlineFork, AiFillCheckCircle,AiFillEdit, AiFillCopy,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild,
    AiOutlineGlobal, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete, AiFillDatabase} from 'react-icons/ai';
import { BsBook, BsFillEnvelopeFill } from 'react-icons/bs';
import { GiMeshBall } from 'react-icons/gi';
import { MdRefresh } from 'react-icons/md';
import Select from "react-select";
import { validURL } from '../../utils/helperFunctions'
import { Push } from '../../components/Query/CollaborateAPI'

export const DBRemoteSummary = ({woqlClient, repos, onCreate}) => {
    let meta = woqlClient.get_database()

    function onRefresh(){
        alert("here we have to refresh the local record")
    }

    if(!meta || !repos) return null;
    return (
        <Row>
            <Col md={9}>
                halleluja
            </Col>
            <Col md={3}>
                <button type="submit" onClick={onRefresh} className="tdb__button__base tdb__button__base--green">
                    Refresh Local State
                </button>
                <button type="submit" onClick={onCreate} className="tdb__button__base tdb__button__base--bgreen">
                    Add Remote
                </button>
            </Col>
        </Row>
    )
}

export const DBRemotes = ({meta, repos, branch, onDelete, onRefresh, onPull, onPush, onFetch}) => {
    if(!meta || !repos) return null;
    let remotes = []
    for(var rem in repos){
        if(rem != "local"){
            remotes.push(
                <DBRemote
                    repo={repos[rem]}
                    meta={meta}
                    branch={branch}
                    onPull={onPull}
                    onPush={onPush}
                    onFetch={onFetch}
                    repos={repos}
                    onDelete={onDelete}
                    onRefresh={onRefresh} />
            )
        }
    }
    return (<span>These are the remotes {remotes}</span>)
}

export const DBRemote = ({repo, meta, repos, branch, onDelete, onRefresh, onPush, onPull, onFetch}) => {
    const [loading, setLoading] = useState()

    function onGo(dbmeta){
        alert(dbmeta.action)
    }

    let remote_branches = (meta.remote_record && meta.remote_record.branches ? meta.remote_record.branches : [])

    return (
    <Col>
        <Row key='r7' className='database-summary-listing'>
            {loading &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {!loading && <>
                <Col key='r5' md={2} className='database-control-panel'>
                    <RemoteControlPanel meta={meta} repo={repo} onDelete={onDelete} onRefresh={onRefresh}/>
                </Col>
                <Col md={8} className='database-main-content'>
                    <Row key='r3'>
                        <RemoteTitle title={repo.title} url={repo.url} />
                    </Row>
                    <Row key='r4'>
                        <RemoteCredits meta={meta} repo={repo} />
                    </Row>
                    <Row key='r6'>
                        <RemoteDescription meta={meta} />
                    </Row>
                </Col>
                <Col key='r16' md={2} className='database-main-actions'>
                    <RemoteStatus meta={meta}   onAction={onGo}/>
                </Col>
            </>}
        </Row>
        <Row key='r79' className='remote-synch-actions'>
            <SynchronizeActions repo={repo} remote_branches={remote_branches} branches={meta.branches} branch={branch} onPull={onPull} onPush={onPush}/>
        </Row>
        <Row key='r78' className='remote-comparison'>
            <RemoteComparison repo={repo} meta={meta} onPush={onPush} onPull={onPull}/>
        </Row>
    </Col>
    )
}

export const SynchronizeActions = ({branches, repo, remote_branches, branch, onPush, onPull, onFetch}) => {
    let localCols = [], remoteCols = []

    const [localBranch, setLocalBranch] = useState(branch)
    const [remoteBranch, setRemoteBranch] = useState(getDefaultRemoteBranch(remote_branches, branch))

    function getDefaultRemoteBranch(branches, br){
        if(branches){
            branches.map((item) => {
                if(item.branch == br) return br
            })
            if(branches[0]) return branches[0].branch
        }
        return "main"
    }

    function pull(){
        if(onPull) onPull(localBranch, remoteBranch, repo)
    }

    function push(){
        if(onPush) onPush(localBranch, remoteBranch, repo)
    }

    function fetch(){
        if(onFetch) onFetch(repo)
    }

    function changeLocal(tar){
        setLocalBranch(tar.value)
    }

    function changeRemote(tar){
        setRemoteBranch(tar.value)
    }

    function inputLocal(tar){
        setLocalBranch(tar.target.value)
    }

    function inputRemote(tar){
        setRemoteBranch(tar.target.value)
    }
    localCols.push(
        <Row className="db-remote-action-label">Local Branch</Row>
    )
    localCols.push(
        <Col md={7} className="db-remote-action-display-controls">
            {(localBranch && remoteBranch) &&
                <button type="submit" onClick={pull} className="tdb__button__base tdb__button__base--green">
                    <b>Pull</b> Updates to {localBranch} Branch
                </button>
            }
        </Col>
    )
    if(branches && branches.length){
        let bopts = branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
        localCols.push(
            <Col md={4} className="db-remote-action-display-controls">
                <Select
                    placeholder = {localBranch}
                    className = "select-branch"
                    onChange ={changeLocal}
                    name = "merge_branch_target"
                    id= "merge_branch_target"
                    options = {bopts}
                    defaultValue= {localBranch}
                />
            </Col>
        )
    }
    else {
        localCols.push(
            <Col md={4} className="db-remote-action-display-controls">
                <input
                    className = "local-branch-input"
                    type="text"
                    placeholder="Local Branch ID"
                    value={localBranch}
                    width="40"
                    onChange={inputLocal}
                    id= "local_branch_id"
                />
            </Col>
        )
    }

    remoteCols.push(
        <Row className="db-remote-action-label">Remote Branch</Row>
    )
    remoteCols.push(
        <Col md={7} className="db-remote-action-display-controls">
            {(localBranch && remoteBranch) &&
                <button type="submit" onClick={push} className="tdb__button__base tdb__button__base--green">
                    Push Updates to {remoteBranch} Branch
                </button>
            }
        </Col>
    )
    if(remote_branches && remote_branches.length){
        let ropts = remote_branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
        remoteCols.push(
            <Col md={4} className="db-remote-action-display-controls">
                <Select
                    placeholder = {remoteBranch}
                    className = "select-branch"
                    onChange ={changeRemote}
                    name = "merge_branch_target"
                    id= "merge_branch_target"
                    options = {ropts}
                    defaultValue= {remoteBranch}
                />
            </Col>
        )
    }
    else {
        remoteCols.push(
            <Col md={4} className="db-remote-action-display-controls">
                <input
                    className = "commit-log-input"
                    type="text"
                    placeholder="Remote Branch ID"
                    value={remoteBranch}
                    width="40"
                    onChange={inputRemote}
                    id= "merge_branch_source"
                />
            </Col>
        )
    }
    //return cols
    return (
        <>
            <Col md={5} className="db-remote-action-box">
                {localCols}
            </Col>
            <Col md={5}className="db-remote-action-box">
                {remoteCols}
            </Col>
        </>
    )
}


export const RemoteComparison = ({meta, repo, onPush, onPull}) => {
    if(!(meta.branches && meta.branches.length)) return null
    let branch_comp = []
    function _containsBranch(bid, barr){
        for(var i = 0; i<barr.length; i++){
            if(barr[i].branch == bid) return i
        }
        return false
    }

    for(var i = 0; i<meta.branches.length; i++){
        let b = meta.branches[i].branch
        if(meta.remote_record && meta.remote_record.branches){
            let remote = _containsBranch(b, meta.remote_record.branches)
            branch_comp.push(
                <BranchComparison repo={repo} onPush={onPush} onPull={onPull} key={"bb_" + i} branch={b} local={meta.branches[i]} remote={meta.remote_record.branches[remote]} />
            )
        }
        else {
            branch_comp.push(
                <UnknownComparison repo={repo} onPush={onPush} onPull={onPull} key={"ub_" + i} branch={b} local={meta.branches[i]} />
            )
        }
    }
    if(meta.remote_record && meta.remote_record.branches){
        for(var i = 0; i<meta.remote_record.branches.length; i++){
            let b2 = meta.remote_record.branches[i].branch
            if(_containsBranch(b2, meta.branches) === false){
                branch_comp.push(
                    <BranchComparison repo={repo} onPush={onPush} onPull={onPull} key={"bz_" + i} branch={b2} remote={meta.remote_record.branches[i]} />
                )
            }
        }
    }
    return (<Col>
        <Row className="remote-comparison-headers-row">
            <Col md={1} className="remote-comparison-headers">
                Pull
            </Col>
            <Col className="remote-comparison-headers">
                Latest Local Commit
            </Col>
            <Col className="remote-comparison-headers">
                Branch ID
            </Col>
            <Col className="remote-comparison-headers">
                Latest Remote Commit
            </Col>
            <Col md={1} className="remote-comparison-headers">
                Push
            </Col>
        </Row>
        {branch_comp}
    </Col>)
}

export const BranchComparison = ({branch, local, remote, repo, onPush, onPull}) => {
    let local_ts, remote_ts, canpull, canpush
    if(local){
        local_ts = printts(local.updated, DATETIME_COMPLETE)
    }
    else {
        local_ts = ""
    }
    if(remote){
        remote_ts = printts(remote.updated, DATETIME_COMPLETE)
    }
    else {
        remote_ts = ""
    }
    if(!remote){
        canpull = false
        canpush = "push new branch to remote"
    }
    else if(!local){
        canpull = "pull new branch from remote"
        canpush = false
    }
    else {
        if(remote.head == local.head){
            canpull = "ok"
            canpush = "ok"
        }
        else if(remote.updated > local.updated){
            canpull = "remote has been updated more recently than local"
            canpush = false
        }
        else {
            canpull = "local has been updated more recently than remote"
            canpush = "local has been updated more recently than remote"
        }
    }

    function doPush(){
        if(onPush) return onPush(branch, branch, repo)
    }

    function doPull(){
        if(onPull) return onPull(branch, branch, repo)
    }


    return(
    <Row className="remote-comparison-spacing">
        <Col md={1}>
            {(canpull && (canpull != "ok")) &&
                <span onClick={doPull}>
                    <PullControl meta={local} />
                </span>
            }
            {(canpull && (canpull == "ok")) &&
                <AllGoodControl meta={local} />
            }
        </Col>
        <Col>
            {local_ts}
        </Col>
        <Col>
            {branch}
        </Col>
        <Col>
            {remote_ts}
        </Col>
        <Col md={1}>
            {(canpush && (canpush != "ok")) &&
                <span onClick={doPush}>
                    <PushControl meta={local} />
                </span>
            }
            {(canpush && (canpush == "ok")) &&
                <AllGoodControl meta={local} />
            }
       </Col>
    </Row>)

}


export const UnknownComparison = ({branch, local}) => {
    return (
    <Row className="remote-comparison-spacing">
        <Col md={1}>
            <span onClick={doPull}>
                <PullControl meta={local} />
            </span>
        </Col>
        <Col>
            {printts(local.updated, DATETIME_COMPLETE)}
        </Col>
        <Col>
            {branch}
        </Col>
        <Col>

        </Col>
        <Col>
            <span onClick={doPush}>
                <PushControl meta={local} />
            </span>
       </Col>
    </Row>
    )
}



export const RemoteTitle = ({title, url, max, max_url}) => {
    let maxtitle = max || 40
    let maxurl = max_url || 100
    let str
    if(title && title.length > maxtitle){
        str =  title.substring(maxtitle -4) + " ..."
    }
    else str = title || ""
    let urlstr = ""
    if(url && url.length > maxurl){
        urlstr =  url.substring(maxurl - 4) + " ..."
    }
    else urlstr = url || ""
    let title_css = "database-title-remote"

    return (
        <span className='database-listing-title-row'>
            <div key='a' className={title_css + " database-listing-title"}>{str}</div>
            <div className={"database-url-remote database-listing-url"} title={url}>{urlstr}</div>
        </span>
    )
    /*
    <span className='database-listing-title-row'>
        <span key='a' className={title_css + " database-listing-title"}>{str}</span>
        <span className={"database-url-remote database-listing-url"} title={url}>{urlstr}</span>
    </span>
    */
}

export const RemoteControlPanel = ({meta, repo, onDelete, onRefresh}) => {
    const [isImage, setImage] = useState(false);
    const [isIcon, setIcon] = useState(false);
    let disp = []
    function goDB(){
        if(meta.id) goDBHome(meta.id, meta.organization)
    }

    let icon = meta.icon

    if(!icon && meta.remote_record && meta.remote_record.icon) icon = meta.remote_record.icon
    if(!icon) icon = GRAPHDB
    let title = "Database ID: " + (meta.id ? meta.id : meta.remote_record.id)

    if(icon){
        if(validURL(icon)) disp.push(<img className='database-listing-image' src={icon} title={title} key="xx1"  />)
        else disp.push(<i key="xx" className={'database-listing-icon ' + icon} title={title}/>)
    }

    return (
        <Col className='database-left-column'>
            <Row key="rr" onClick={goDB}>
                {disp}
            </Row>
            <Row key="rd">
                <DBControls meta={meta} repo={repo} onRefresh={onRefresh} onDelete={onDelete}/>
            </Row>
        </Col>
    )
}

export const DBControls = ({meta, repo, onRefresh, onDelete}) => {

        function showDelete(){
            alert("show delete modal now")
            if(onDelete) onDelete(repo)
        }

        function refreshRemote(){
            if(onRefresh) onRefresh(repo)
        }

        return (
        <Container className='database-controls database-listing-title-row'>
            <Row className='major-database-controls'>
                <span>
                    <span className='refresh-control'><RefreshControl meta={meta} /></span>
                    <span className='delete-control'><DeleteControl meta={meta} /></span>
                </span>
            </Row>
        </Container>
    )
    /*
    <Col className='refresh-control' onClick={refreshRemote}>
        <RefreshControl meta={meta} />
    </Col>
    <Col className='delete-control' onClick={showDelete}>
        <DeleteControl meta={meta} />
    </Col>
    */
}

export const DeleteControl = ({meta}) => {
    //return <span className="delete-action"  title="Delete Database">Delete <AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /></span>
    return <span className="delete-action"  title="Delete Database"><AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /> Delete</span>
}

export const RefreshControl = ({meta}) => {
    //return <span className="refresh-action"  title="Refresh Remote Record">Refresh<AiFillCopy className='database-action database-listing-refresh' /></span>
    return <span className="refresh-action"  title="Refresh Remote Record"><MdRefresh color="#155724" className='database-action database-listing-refresh' /> Refresh</span>
}


export const RemoteStatus = ({meta, user, onAction}) => {
    return (
        <div className='database-action-column'>
            <Row className='database-update-status'>
                <RemoteUpdated meta={meta}  user={user}/>
            </Row>
            <Row className='database-action-option' onClick={onAction} >
                <DBMainAction meta={meta} user={user} />
            </Row>
            <Row className='database-secondary-option'>
                <DBSecondaryAction meta={meta} user={user} onAction={onAction}/>
            </Row>
        </div>
    )
}

export const RemoteUpdated = ({meta, user}) => {
    let act = meta.action, css = "database-main-action-message action-text-color";
    switch(act){
        case 'share':
            act = "upload to hub"
            break;
        case 'synchronise':
            if(meta.structure_mismatch || meta.ahead || meta.behind){
                act = "needs synchronize"
            }
            else{
                act = "synchronized"
            }
            break;
        case 'accept':
            act = "Accept Invitation?"
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
    else if(act == 'accept'){
        return (<AcceptControl meta={meta} user={user}/>)
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
        if(meta.remote_record && meta.remote_record.roles){
            let roles = meta.remote_record.roles
            return (roles.indexOf("create") != -1)
        }
        return false
    }

    function myDelete(){
        meta.action = 'delete'
        if(onAction) onAction(meta)
    }

    function myReject(){
        meta.action = 'reject'
        if(onAction) onAction(meta)
    }

    function myFork(){
        meta.action = 'fork'
        if(onAction) onAction(meta)
    }
    if(meta.action == 'accept'){
        return (
            <div className="action-centralise">
                <div className="action-centralise action-divider">or</div>
                <div>
                    <span className="secondory-btn-control" onClick={myReject}>
                        <RejectControl meta={meta} user={user} />
                    </span>
                </div>
            </div>)
    }

    if(meta.action == 'clone'){
        if(userCanDelete(meta, user)){
            return (
                <div className="action-centralise">
                    <div className="action-centralise action-divider">or</div>
                    <div>
                        <span onClick={myDelete} className="secondory-btn-control">
                            <DeleteControl meta={meta} user={user} />
                        </span>
                    </div>
                </div>)
        }
        else {
            return (
                <div className="action-centralise">
                    <div className="action-centralise action-divider">or</div>
                    <div>
                        <span className="secondory-btn-control"
                            title={'Fork: ' + meta.remote_url}
                            className="fork-action"
                            onClick={myFork}>Fork
                            <ForkControl meta={meta} user={user} />
                        </span>
                    </div>
                </div>)
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
    return <AiOutlineCloudUpload className={"db-main-action"} color="#0055bb " title="Save this database to your hub account"/>
}

export const PushControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"ffbf00"} title={describe_unsynch(meta)}/>
}

export const PullControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"ffbf00"} title={describe_unsynch(meta)}/>
}

export const CloneControl = ({meta, user}) => {
    return <AiOutlineCloudDownload className={"db-main-action"} color={"#4984c9"} title="Clone this database now"/>
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
    return <span className="delete-action"  title="Reject Invitation">Reject <AiOutlineDelete color="#721c24" className='database-action database-listing-delete' /></span>
    //return <FontAwesomeIcon className='database-action database-listing-delete' icon={DELETE_ICON} title="Delete Database"/>
}

export const AcceptControl = ({meta}) => {
    return <AiFillCheckCircle className={"db-main-action"} color={"#00C08B"} title={"Accept Invitation to collaborate on database"}/>
    //return <FontAwesomeIcon className='database-listing-allgood' icon={ALL_GOOD_ICON} title={"Accept Invitation to collaborate on database"} />
}



export const TimeControl = ({meta, type}) => {
    let css = (type == "inactive" ? 'database-inactive-action' : 'database-action database-listing-time')
    let tit = (type == "inactive" ? 'Database has no commits' : 'Click to view the commit history')
    return <FontAwesomeIcon className={css} icon={COMMITS_ICON} title={tit}/>
}

export const QueryControl = ({meta}) => {
    return <FontAwesomeIcon className='database-action database-listing-query' icon={QUERY_ICON} title="Query this database now"/>
}


export const RemoteCredits = ({meta, user}) => {
    let res = []
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
            <DBLastCommit key='gd' meta={meta.remote_record} user={user} />
        )
    }
    return (
        <div className="database-listing-title-row credit-spacing">
            {res}
        </div>
    )
}

export const DBRemoteTitle = ({meta, user}) => {
    let ct = meta.label ? meta.label : meta.id
    return(<span>
        <AiOutlineBook className="db_info_icon_spacing"/>
        <span className="db_info">Name: {ct}</span>
    </span>)
}


export const DBLastCommit = ({meta}) => {
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
        <span>
            <AiFillEdit className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </span>
    )
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

export const RemoteDescription = ({meta, user}) => {
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
