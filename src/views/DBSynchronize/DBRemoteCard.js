/**
 * Display card for a single remote
 */
import React, {useState} from 'react'
import { GRAPHDB } from "../../constants/images"
import {Row, Col, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap"
import { printts } from "../../constants/dates"
import { DATETIME_COMPLETE } from "../../constants/dates"
import { AiFillEdit, AiFillCopy, AiOutlineBlock, AiFillLock, AiOutlineUser, AiOutlineWarning,
    AiOutlineGlobal, AiOutlineLink} from 'react-icons/ai';
import { DescribeDifferences } from "./DBDifferences"
import { validURL } from '../../utils/helperFunctions'
import { MdRefresh } from 'react-icons/md';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { RiDeleteBin5Line, RiErrorWarningLine } from 'react-icons/ri'

export const DBRemoteCard = ({repo, user, local, remote, onDelete, onRefresh, onFetch}) => {
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
                    />
                </Col>
                <Col md={10} className='database-main-content'>
                    <Row>
                        <RemoteTitle repo={repo} meta={remote}/>
                    </Row>
                    <Row>
                        <RemoteCredits
                            remote={remote}
                            repo={repo}
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

export const RemoteControlPanel = ({local, remote, show_refresh, repo, onFetch, onDelete, onRefresh}) => {

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
        <div>
            <Row key="rr" class="database-left-img">
                {disp}
            </Row>
            <Row  key="rd" className="db-controls">
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

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    function showDelete(){
        //alert("show delete modal now")
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
            <span>
                {onRefresh &&
                    <span className='refresh-control' onClick={doRefresh}>
                        <RefreshControl repo={repo} />
                    </span>
                }
                {onFetch &&
                    <span className='refresh-control' onClick={doFetch}>
                        <FetchControl repo={repo} />
                    </span>
                }
                <span className='delete-control' onClick={toggle}>
                    <DeleteControl repo={repo} />
                    <Modal isOpen={modal} toggle={toggle}>
                      <ModalBody className="delete-modal-body">
                            <Row>
                                <RiErrorWarningLine color="#ff9800" className="delete-modal-icon"/>
                                <span className="warning-modal-text">This action will delete the database from hub!</span>
                            </Row>
                      </ModalBody>
                      <ModalFooter>
                        <button className="tdb__button__base tdb__button__base--bred"  onClick={showDelete}>Delete</button>{' '}
                      </ModalFooter>
                    </Modal>
                </span>
            </span>
        </Row>
    )
}

export const DeleteControl = ({repo}) => {
    let title = `Delete Remote ${repo.title} (${repo.url})`
    return <span className="db-action"  title={title}><RiDeleteBin5Line color="#721c24" className='db-control' /></span>
    /*return (
        <span className="delete-action"  title={title}>
            <RiDeleteBin5Line color="#721c24" className='database-action database-listing-delete' />
        </span>
    )*/
}

export const RefreshControl = ({repo}) => {
    let title = `Refresh Remote ${repo.title} from ${repo.url}`
    return <span className="db-action"  title={title}><MdRefresh color="#0055bb" className='db-control' /></span>
    /*return (
        <span className="refresh-action" title={title}>
            <MdRefresh className='database-action database-listing-refresh' />
        </span>
    )*/
}

export const FetchControl = ({repo}) => {
    let title = `Fetch Remote ${repo.title} from ${repo.url}`
    return <span className="db-action"  title={title}><AiFillCopy color="#0055bb" className='db-control' /></span>
    /*return (
        <span className="refresh-action"  title={title}>
            <AiFillCopy className='database-action database-listing-refresh' />
        </span>
    )*/
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

export const RemoteTitle = ({repo, meta}) => {
    let title_css = "database-title-remote"
    let str = (meta && meta.label ? meta.label : repo.title)
    return (
        <span className='database-listing-title-row'>
            <span className={title_css + " database-listing-title"}>{str}</span>
            {meta && meta.label &&
                <span class="repo_title"> ({repo.title}) </span>
            }
        </span>
    )
}

export const RemoteCredits = ({remote, repo}) => {
    let res = []
    res.push(<DBRemoteTitle repo={repo} key="aaa" />)
    if(repo && repo.url){
        res.push(<DBRemoteURL url={repo.url} key="cadf" />)
    }
    if(remote){
        if(repo && repo.type == "hub"){
            res.push (
                <DBProductionCredits  key='ac' meta={remote} />
            )
            res.push(
                <DBRoleCredits key='ad' meta={remote} />
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

export const DBRemoteTitle = ({repo}) => {
    let ct = repo.type + " db: " + repo.title
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
        <div>
            <AiFillEdit className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </div>
    )
}

export const DBProductionCredits = ({meta}) => {
    if(meta){
        var tit = (meta.organization_type ? meta.organization_type + " Organization " + meta.organization : "")
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

export const DBRoleCredits = ({meta}) => {
    if(meta){
        let dbrec = meta
        let rs = [];
        if(dbrec.roles){
            for(var i = 0 ; i<dbrec.roles.length; i++){
                rs.push(_get_role_title(dbrec.roles[i]))
            }
        }
        if(dbrec.public){
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
