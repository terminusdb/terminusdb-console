/**
 * Display card for a single remote
 */
import React, {useState} from 'react'
import { GRAPHDB } from "../../constants/images"
import {Row, Col} from "reactstrap"
import { printts } from "../../constants/dates"
import { DATETIME_COMPLETE } from "../../constants/dates"
import { AiFillEdit, AiFillCopy, AiOutlineBlock, AiFillLock, AiOutlineUser, AiOutlineWarning,
    AiOutlineGlobal, AiOutlineLink} from 'react-icons/ai';
import { DescribeDifferences } from "./DBDifferences"
import { validURL } from '../../utils/helperFunctions'
import { MdRefresh } from 'react-icons/md';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { DeleteControl } from './DeleteControl'
import { DBLastCommit, CloneRoleCredits, DBPrivacy, CloneProductionCredits } from "../Pages/ClonePage"

export const DBRemoteCard = ({repo, user, local, remote, onDelete, onRefresh, onFetch, onGoHub}) => {
    let allowed_fetch = false
    if(repo.type == "hub" && user.logged_in){
        allowed_fetch = true
    }
    else if(repo.type == "local" || repo.type == "remote"){
        allowed_fetch = true
    }

    return (
        <Col>
            <Row className='database-summary-listing'>
                <Col md={2} className='database-control-panel database-control-panel-border'>
                    <RemoteControlPanel
                        local={local}
                        repo={repo}
                        remote={remote}
                        show_refresh={allowed_fetch}
                        onFetch={onFetch}
                        onDelete={onDelete}
                        onRefresh={onRefresh}
                        onGoHub={onGoHub}
                    />
                </Col>
                <Col md={10} className='database-full-summary-content'>
                    <Row>
                        <RemoteTitle onGoHub={onGoHub} repo={repo} meta={remote}/>
                        <RemoteOrigin repo={repo} meta={remote}/>
                    </Row>
                    <Row>
                        <RemoteCredits
                            remote={remote}
                            repo={repo}
                            onGoHub={onGoHub}
                        />
                    </Row>
                </Col>
            </Row>
            <Row className="synch-info remote-difference">
                <RemoteDescription
                    local={local}
                    remote={remote}
                    repo={repo}
                    user={user}
                />
            </Row>
        </Col>
    )
}

export const RemoteControlPanel = ({local, remote, show_refresh, repo, onFetch, onDelete, onRefresh, onGoHub}) => {
    let disp = []
    let icon = local.icon
    if(!icon && remote && remote.icon) icon = remote.icon
    if(!icon) icon = GRAPHDB
    let title = "Remote Database: " + (repo.url ? repo.url : repo.title)
    if(icon){
        if(validURL(icon)) disp.push(<img className='database-listing-image' src={icon} title={title} key="xx1"  />)
        else disp.push(<i key="xx2" className={'database-listing-icon ' + icon} title={title}/>)
    }
    let doRefresh = (show_refresh ? onRefresh : false)
    let doFetch = (show_refresh ? onFetch : false)

    return (
        <div className='rcp'>
            <Row className="database-left-img database-left-img-clickable" onClick={onGoHub}>
                {disp}
            </Row>
            <Row className="db-controls">
                <DBControls
                    onFetch={doFetch}
                    repo={repo}
                    onRefresh={doRefresh}
                    onDelete={onDelete}
                />
            </Row>
        </div>
    )
}


//Left column - control widget
export const DBControls = ({repo, onFetch, onRefresh, onDelete}) => {

    function doDelete(){
        if(onDelete) onDelete(repo)
    }

    function doRefresh(){
        onRefresh(repo)
    }

    function doFetch(){
        onFetch(repo)
    }

    return (
        <Row className='major-database-controls'>
            <span className='major-database-controls-align major-database-controls-sync'>
                {onRefresh &&
                    <span onClick={doRefresh}>
                        <span className='rdefresh-control'>
                            <RefreshControl repo={repo} />                         
                        </span>
                    </span>
                }
                <span className='sdb-delete-control'>
                    <DeleteControl repo={repo} onDelete={doDelete} />
                </span>
            </span>
        </Row>
    )
}

export const RefreshControl = ({repo}) => {
    let title = `Refresh Remote ${repo.title} from ${repo.url}`
    return <span className="db-action db-refresh-action"  title={title}><MdRefresh color="#0055bb" className='db-control' /> fetch</span>
}

export const FetchControl = ({repo}) => {
    let title = `Fetch Remote ${repo.title} from ${repo.url}`
    return <span className="db-action db-fetch-action"  title={title}><AiFillCopy color="#0055bb" className='db-control' /> fetch</span>
}

export const DBWarningCredits = ({text}) => {
    return (
        <span>
            <AiOutlineWarning title="Warning" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}


//Title & remote metadata

export const RemoteTitle = ({repo, meta, onGoHub}) => {
    let title_css = "database-title-remote"
    let str = (meta && meta.label ? meta.label : repo.title)
    return (
        <span className='database-listing-title-row' onClick={onGoHub}>
            <span className={title_css + " database-listing-title"}>{str}</span>
        </span>
    )
}

export const RemoteOrigin = ({repo, meta}) => {
    return <div className="remote-origin">{repo.title}</div>
}

export const RemoteCredits = ({remote, repo, onGoHub}) => {
    let res = []

    function goHub(){
        onGoHub(remote.organization, remote.id)
    }

    if(repo && repo.url){
        res.push(<DBRemoteURL url={repo.url} key="cadf" onGoHub={onGoHub} />)
    }
    if(remote){
        if(repo && repo.type == "hub"){
            res.push (
                <CloneProductionCredits  key='ac' meta={remote} onAction={goHub}/>
            )
            res.push (
                <DBPrivacy  key='addc' meta={remote} />
            )
            res.push(
                <CloneRoleCredits key='ad' meta={remote} />
            )
        }
        res.push(
            <DBLastCommit key='gd' meta={remote} />
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const DBRemoteURL = ({url, onGoHub}) => {
    return(
    <span onClick={onGoHub} className="db-card-credit hub-organization-link">
        <AiOutlineLink className="db_info_icon_spacing"/>
        <span className="db_info">{url}</span>
    </span>)
}

// Description of differences between local and remote
export const RemoteDescription = ({local, remote, repo, user}) => {
    if(repo.type == "hub" && !user.logged_in){
        return (<Row className='database-listing-description-row'>
            <span className="database-listing-description">
                <DBWarningCredits text="Log in to Terminus Hub to synchronize" />
            </span>
        </Row>)
    }
    if(!remote){
        return (<DBWarningCredits text="No record of remote database found" />)
    }
    else {
        return (<>
            <div className="remote-info-align">
                <AiOutlineCloudSync className={"database-remote-icon"} color={"#856404"}/> <span className="sync-info-label">Synchronization with local database</span>
            </div>
            <div className="database-remote-info-row">
                <DescribeDifferences a={local} b={remote} />
            </div>
        </>
        )
    }
}
