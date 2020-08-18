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
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCopy, AiFillWarning,
    AiOutlineCloudSync, AiOutlineCloudDownload, AiOutlineFork, AiFillCheckCircle,AiFillEdit, AiFillCopy,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild,
    AiOutlineGlobal, AiOutlineLink, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete, AiFillDatabase} from 'react-icons/ai';
import { BsBook, BsFillEnvelopeFill } from 'react-icons/bs';
import { GiMeshBall } from 'react-icons/gi';
import { MdRefresh } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri'
import Select from "react-select";
import { validURL } from '../../utils/helperFunctions'
import { isHubURL, isLocalURL } from '../../components/Query/CollaborateAPI'

export const DBRemoteSummary = ({woqlClient, repos, onCreate, action, onShare, onLogin}) => {
    let meta = woqlClient.get_database()
    let user = woqlClient.user()

    const [myAction, setAction] = useState(action)

    function categorize(repos){
        let hubs = []
        let locals = []
        let others = []
        for(var k in repos){
            if(repos[k].type == "Remote"){
                if(isHubURL(repos[k].url)) hubs.push(repos[k])
                else if(isLocalURL(repos[k].url, woqlClient)) locals.push(repos[k])
                else others.push(repos[k])
            }
        }
        return {hub: hubs, local: locals, other: others}
    }

    let cats = categorize(repos)

    let tots = cats.hub.length + cats.local.length + cats.other.length
    let share_to_hub = (cats.hub.length == 0)
    let intro_text
    if(tots == 0){
        intro_text = "This database is local only, it is associated with no remote databases"
    }
    else if(tots == 1 && cats.hub.length == 1){
        intro_text = "This database is connected to database on Terminus Hub"
    }
    else if(tots == 1 && cats.local.length == 1){
        intro_text = "This database is connected to a local database"
    }
    else if(tots == 1 && cats.other.length == 1){
        intro_text = "This database is connected to a remote database"
    }
    else {
        intro_text = `This database is connected to ${tots} remotes`
    }
    //possibilities :
    //   no remotes (publish to hub, add remote) (not logged in)
    //   1 remote = hub (not logged in)
    //   1 remote = local (local clone) (publish to hub?) ()
    //   multiple remotes no hub => (publish to hub)
    //   multiple remotes including hub =>

    if(!meta || !repos) return null;

    let showSave = (user && user.logged_in)
    let showLogin = (!(user && user.logged_in))

    return (
        <Row>
            <Col md={6}>
                {intro_text}
            </Col>
            <Col md={3}>
                {share_to_hub &&
                    <span>
                    {showSave &&
                        <button type="submit" onClick={onShare} className="tdb__button__base tdb__button__base--green">
                            Save to Terminus Hub
                        </button>
                    }
                    {showLogin &&
                        <button type="submit" onClick={onLogin} className="tdb__button__base tdb__button__base--green">
                            Login to Terminus Hub to Save
                        </button>
                    }
                    </span>
                }
            </Col>
            <Col md={3}>
                <button type="submit" onClick={onCreate} className="tdb__button__base tdb__button__base--bgreen">
                    Add Remote
                </button>
            </Col>
        </Row>
    )
}

export const DBRemotes = ({woqlClient, meta, user, repos, branch, onDelete, onRefresh, onPull, onPush, onFetch}) => {
    if(!meta || !repos) return null;
    let remotes = []
    function _repo_categorize(url){
        if(isHubURL(url)) return "hub"
        else if(isLocalURL(url, woqlClient)) return "local"
        else return "remote"
    }
    for(var rem in repos){
        if(rem != "local"){
            let rmeta = repos[rem]
            rmeta.type = _repo_categorize(rmeta.url)
            remotes.push(
                <DBRemote
                    repo={rmeta}
                    user={user}
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
    return remotes
}

export const DBRemote = ({repo, user, meta, repos, branch, onDelete, onRefresh, onPush, onPull, onFetch}) => {
    const [loading, setLoading] = useState()

    let remote_branches = (meta.remote_record && meta.remote_record.branches ? meta.remote_record.branches : [])

    let show_actions = (repo.type == "local" || (repo.type == "hub" && user.logged_in))
    let show_branches = (remote_branches.length > 0)

    let submit = false
    let doPush = onPush
    if(!meta.remote_record){
        doPush = false
    }
    if(repo.type == "hub" && !_allowed_push(meta.remote_record.roles)){
        doPush = false
        submit = function(){
            alert("testing")
        }
    }
    else if(repo.type == "remote"){
        doPush = false
    }

    function _allowed_push(roles){
        if(roles.indexOf('create') != -1) return true
        if(roles.indexOf('write') != -1) return true
        return false
    }

    return (
    <Col>
        <Row key='r7' className='database-summary-listing'>
            {loading &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {!loading && <>
                <Col key='r5' md={2} className='database-control-panel'>
                    <RemoteControlPanel meta={meta} repo={repo} logged_in={user.logged_in} onFetch={onFetch} sonDelete={onDelete} onRefresh={onRefresh}/>
                </Col>
                <Col md={10} className='database-main-content'>
                    <Row key='r3'>
                        <RemoteTitle title={repo.title} />
                    </Row>
                    <Row key='r4'>
                        <RemoteCredits meta={meta} url={repo.url} repo={repo} type={repo.type} />
                    </Row>
                    <Row key='r6'>
                        <RemoteDescription meta={meta} user={user}/>
                    </Row>

                </Col>
            </>}
        </Row>
        {show_actions &&
            <Row key='r79' className='remote-synch-actions'>
                <SynchronizeActions
                    repo={repo}
                    remote_branches={remote_branches}
                    branches={meta.branches}
                    branch={branch}
                    onPull={onPull}
                    onPush={doPush}
                    onSubmitUpdate={submit}
                />
            </Row>
        }

        {show_branches &&
            <Row key='r78' className='remote-comparison'>
                <RemoteComparison repo={repo} meta={meta} onPush={onPush} onPull={onPull}/>
            </Row>
        }
    </Col>
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
            <span key='a' className={title_css + " database-listing-title"}>{str}</span>
            <span className={"database-url-remote database-listing-url"} title={url}>{urlstr}</span>
        </span>
    )
}

export const RemoteControlPanel = ({meta, logged_in, repo, onFetch, onDelete, onRefresh}) => {
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
            <Row key="rd" className="db-controls">
                <DBControls onFetch={onFetch} logged_in={logged_in} meta={meta} repo={repo} onRefresh={onRefresh} onDelete={onDelete}/>
            </Row>
        </Col>
    )
}

export const DBControls = ({meta, repo, logged_in, onFetch, onRefresh, onDelete}) => {

        function showDelete(){
            alert("show delete modal now")
            if(onDelete) onDelete(repo)
        }

        function refreshRemote(){
            if(onRefresh) onRefresh(repo)
        }

        function fetchRemote(){
            if(onFetch) onFetch(repo)
        }

        /*<Container className='database-controls database-listing-title-row'>
            <Row className='major-database-controls'>
                <span>
                    <span className='refresh-control'><RefreshControl meta={meta} /></span>
                    <span className='delete-control'><DeleteControl meta={meta} /></span>
                </span>
            </Row>
        </Container>*/

        return (
        <Container className='database-controls database-listing-title-row'>
            <Row className='major-database-controls'>
                <span>
                    {logged_in && <>
                        <span className='refresh-control' onClick={refreshRemote}>
                            <RefreshControl meta={meta} />
                        </span>
                        <span className='refresh-control' onClick={fetchRemote}>
                            <FetchControl meta={meta} />
                        </span>
                    </>}
                    <span className='delete-control' onClick={showDelete}>
                        <DeleteControl meta={meta} />
                    </span>
                </span>
            </Row>
        </Container>
    )
}

export const DeleteControl = ({meta}) => {
    return <span className="delete-action"  title="Delete Database"><RiDeleteBin5Line color="#721c24" className='database-action database-listing-delete' />Delete</span>
    //return <FontAwesomeIcon className='database-action database-listing-delete' icon={DELETE_ICON} title="Delete Database"/>
}

export const RefreshControl = ({meta}) => {
    //return <span className="refresh-action"  title="Refresh Remote Record">Refresh<AiFillCopy className='database-action database-listing-refresh' /></span>
    return <span className="refresh-action"  title="Refresh Remote Record"><MdRefresh color="#155724" className='database-action database-listing-refresh' /> Refresh</span>
}

export const FetchControl = ({meta}) => {
    return <span className="fetch-action"  title="Fetch Remote Repository"><AiFillCopy color="#004085" className='database-action database-listing-refresh' /> Fetch</span>
}

export const RemoteDescription = ({meta, user}) => {
    if(!user.logged_in){
        return (<Row key='z' className='database-listing-description-row'>
            <span className="database-listing-description">
                <DBWarningCredits text="Log in to Terminus Hub to synchronize" />
            </span>
        </Row>)
    }
    if(!meta.remote_record){
        return (<DBWarningCredits text="No record of remote database found" />)
    }
    else {
        return (<DescribeDifferences a={meta} b={meta.remote_record} />)
    }
}

export const DescribeDifferences = ({a, b}) => {
    let comps = []
    let bdesc = {}
    for(var i = 0; i<a.branches.length; i++){
        let myb = a.branches[i]
        let index = _containsBranch(myb.branch, b.branches)
        let diff = false
        if(index !== false){
            let otherb = b.branches[index]
            if(otherb.head != myb.head){
                if(otherb.updated > myb.updated){
                    diff = "remote ahead"
                }
                else {
                    diff = "local ahead"
                }
            }
        }
        else diff = "no remote"
        bdesc[myb.branch] = diff
    }
    for(var i = 0; i<b.branches.length; i++){
        if(typeof bdesc[b.branches[i].branch] == "undefined"){
            bdesc[b.branches[i].branch] = "no local"
        }
    }
    if(a.branches.length == 1 && b.branches.length == 1 && a.branches[0].branch == b.branches[0].branch){
        if(!bdesc[a.branches]){
            comps.push(<DBSynchCredits text="Databases synchronized" />)
        }
        else {
            let str = "Databases out of synch: "
            if(a.branches[0].updated > b.branches[0].updated){
                str += "local is ahead of remote"
            }
            else {
                str += "remote is ahead of local"
            }
            comps.push(<DBUnsynchCredits text={str} />)
        }
    }
    else {
        let acount = a.branches.length
        let bcount = b.branches.length
        let local_onlies = []
        let remote_onlies = []
        let local_ahead = []
        let remote_ahead = []
        let synchs = []
        for(var key in bdesc){
            let item = bdesc[key]
            if(item == "no local") remote_onlies.push(key)
            else if(item == "no remote") local_onlies.push(key)
            else if(item == "local ahead") local_ahead.push(key)
            else if(item == "remote ahead") remote_ahead.push(key)
            else synchs.push(key)
        }
        let str = `Local has ${acount} branches, remote has ${bcount} -`
        if(local_onlies.length + remote_onlies.length == 0){
            str += " all branches shared"
        }
        else {
            if(local_onlies.length == 1){
                str+= ` ${local_onlies[0]} branch only exists locally. `
            }
            else if(local_onlies.length > 1){
                str+= ` ${local_onlies.length} branches only exist locally. `
            }
            if(remote_onlies.length == 1){
                str+= ` ${remote_onlies[0]} branch only exists on remote. `
            }
            else if(remote_onlies.length > 1){
                str+= ` ${remote_onlies.length} branches only exist on remote. `
            }
        }
        comps.push(<DBBranchCredits text={str} />)
        if(local_ahead.length + remote_ahead.length + synchs.length > 0){
            if(local_ahead.length + remote_ahead.length > 0){
                if(local_ahead.length == 1){
                    let txt = `local branch ${local_ahead[0]} ahead of remote`
                    comps.push(<DBUnsynchCredits text={txt} />)
                }
                else if(local_ahead.length > 1) {
                    let txt = `${local_ahead.length} local branches ahead of remote`
                    comps.push(<DBUnsynchCredits text={txt} />)
                }
                if(remote_ahead.length == 1){
                    let txt = `remote branch ${remote_ahead[0]} ahead of local`
                    comps.push(<DBUnsynchCredits text={txt} />)
                }
                else if(remote_ahead.length > 1) {
                    let txt = `${remote_ahead.length} remote branches ahead of local`
                    comps.push(<DBUnsynchCredits text={txt} />)
                }
                if(synchs.length == 1){
                    let txt = `1 branch synchronized (${synchs[0]})`
                    comps.push(<DBSynchCredits text={txt} />)
                }
                else if(synchs.length > 1) {
                    let txt = `${synchs.length} branches synchronized`
                    comps.push(<DBSynchCredits text={txt} />)
                }
            }
            else {
                comps.push(<DBSynchCredits text="all branches synchronized" />)
            }
        }
        else {
            comps.push(<DBUnsynchCredits text="no common branches" />)
        }
    }
    return comps
}





export const DBSynchCredits = ({text}) => {
    return (
        <span>
            <AiOutlineCheckCircle title="Synchronized" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}

export const DBWarningCredits = ({text}) => {
    return (
        <span>
            <AiFillWarning title="Warning" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}


export const DBBranchCredits = ({text}) => {
    return (
        <span>
            <AiOutlineBranches title="Branch Synchronization" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}

export const DBUnsynchCredits = ({text}) => {
    return (
        <span>
            <AiOutlineCloudSync title="Branches out of synch" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}



function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}


export const ShareControl = ({meta, user}) => {
    return <AiOutlineCloudUpload className={"db-main-action"} color="#0055bb " title="Save this database to your hub account"/>
}

export const PushControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"ffbf00"}/>
}

export const PullControl = ({meta, user}) => {
    return <AiOutlineCloudSync className={"db-main-action"} color={"ffbf00"}/>
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
    return <AiOutlineCheckCircle className={"db-main-action"} color={"#00C08B"}/>
}

export const TimeControl = ({meta, type}) => {
    let css = (type == "inactive" ? 'database-inactive-action' : 'database-action database-listing-time')
    let tit = (type == "inactive" ? 'Database has no commits' : 'Click to view the commit history')
    return <FontAwesomeIcon className={css} icon={COMMITS_ICON} title={tit}/>
}



export const RemoteCredits = ({meta, url, type}) => {
    let res = []
    res.push(<DBRemoteTitle  key='cx' meta={meta.remote_record} type={type} />)
    res.push(<DBRemoteURL url={url} key="cadf" />)
    if(meta && meta.remote_record && meta.type != "local_clone"){
        res.push (
            <DBProductionCredits  key='ac' meta={meta.remote_record} />
        )
        res.push(
            <DBRoleCredits key='ad' meta={meta.remote_record} />
        )
        res.push(
            <DBLastCommit key='gd' meta={meta.remote_record} />
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const DBRemoteTitle = ({meta, type}) => {
    let ct
    if(meta){
        ct = type + " db - " + (meta.label ? meta.label : meta.id)
    }
    else {
        ct = type + " db"
    }
    return(<span>
        <AiOutlineBlock className="db_info_icon_spacing"/>
        <span className="db_info">{ct}</span>
    </span>)
}


export const DBRemoteURL = ({url}) => {
    return(<span>
        <AiOutlineLink className="db_info_icon_spacing"/>
        <span className="db_info">{url}</span>
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

export const SynchronizeActions = ({branches, repo, remote_branches, branch, onPush, onPull, onSubmitUpdate}) => {
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
    let pull_title = "Pull Changes to local "

    let show_branch_choosers = (branches && branches.length> 1) || (remote_branches && remote_branches.length> 1)

    if(localBranch && show_branch_choosers && branches && branches.length){
        pull_title += " branch " + localBranch
    }
    localCols.push(
        <Row className="db-remote-action-label">Local Branch</Row>
    )
    localCols.push(
        <Col md={7} className="db-remote-action-display-controls">
            {(localBranch && remoteBranch) &&
                <button type="submit" onClick={pull} className="tdb__button__base tdb__button__base--green">
                    Pull Updates to {localBranch} Branch
                </button>
            }
        </Col>
    )

    /*cols.push(
        <Col>
            {(localBranch && remoteBranch) &&
                <button type="submit" onClick={pull} className="tdb__button__base tdb__button__base--green">
                    {pull_title}
                </button>
            }
        </Col>
    )*/
    if(show_branch_choosers){
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
    }
    let push_title = "Push Changes to Remote"
    remoteCols.push(
        <Row className="db-remote-action-label">Remote Branch</Row>
    )
    if(onPush){
        remoteCols.push(
            <Col md={7} className="db-remote-action-display-controls">
                {(localBranch && remoteBranch) &&
                    <button type="submit" onClick={push} className="tdb__button__base tdb__button__base--green">
                        {push_title}
                    </button>
                }
            </Col>
        )
    }
    else if(onSubmitUpdate) {
        remoteCols.push(
            <Col md={7} className="db-remote-action-display-controls">
                {(localBranch && remoteBranch) &&
                    <button type="submit" onClick={onSubmitUpdate} className="tdb__button__base tdb__button__base--orange">
                        Submit Update
                    </button>
                }
            </Col>
        )
    }
    else {
        remoteCols.push(
            <Col md={7} className="db-remote-action-display-controls">
                {(localBranch && remoteBranch) &&
                    <button type="submit" className="tdb__button__base tdb__button__base--gray">
                        Push not permitted
                    </button>
                }
            </Col>
        )
    }
    if(show_branch_choosers){
        if(remoteBranch) push_title += " branch " + remoteBranch

        if(remote_branches && remote_branches.length){
            if(remote_branches.length >1){
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
    }
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

function _containsBranch(bid, barr){
    for(var i = 0; i<barr.length; i++){
        if(barr[i].branch == bid) return i
    }
    return false
}

export const RemoteComparison = ({meta, repo, onPush, onPull}) => {
    if(!(meta.branches && meta.branches.length)) return null
    let branch_comp = []


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


export const UnknownComparison = ({branch, local, repo, onPull, onPush}) => {
    function doPush(){
        if(onPush) return onPush(branch, branch, repo)
    }

    function doPull(){
        if(onPull) return onPull(branch, branch, repo)
    }

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
        <Col md={1}>
            <span onClick={doPush}>
                <PushControl meta={local} />
            </span>
       </Col>
    </Row>
    )
}
