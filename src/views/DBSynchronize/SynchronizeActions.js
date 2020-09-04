/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {Row, Col, Badge, Container} from "reactstrap"
import { AiOutlineCloudUpload, AiOutlineCloudDownload, AiOutlineBranches } from 'react-icons/ai';
import Select from "react-select";


export const SynchronizeActions = ({branches, repo, remote_branches, branch, onPush, onPull}) => {

    return (
        <>
            <Col key="rc7" className="db-remote-action-box">
                <div className="remote-info-align">
                    {<AiOutlineCloudDownload className={"database-remote-icon"} color={"#002856"}/>}
                    <span className="db-remote-action-info-label">Download</span>
                </div>
                <div className="database-remote-info-row">
                    <PullControl
                        branches={branches}
                        remote_branches={remote_branches}
                        branch={branch}
                        onPull={onPull}
                        repo={repo}
                    />
                </div>
            </Col>
            <Col key="rc8" className="db-remote-action-box">
                <div className="remote-info-align">
                    {<AiOutlineCloudUpload className={"database-remote-icon"} color={"#002856"}/>}
                    <span className="db-remote-action-info-label">Upload</span>
                </div>
                <div className="database-remote-info-row">
                    <PushControl
                        branches={branches}
                        remote_branches={remote_branches}
                        branch={branch}
                        onPush={onPush}
                        repo={repo}
                    />
                </div>
            </Col>
        </>
    )
}

export const PushControl = ({branches, repo, remote_branches, branch, onPush}) => {
    branches = branches || []
    const [localBranch, setLocalBranch] = useState(branch)
    const [remoteBranch, setRemoteBranch] = useState(getDefaultRemoteBranch(remote_branches, branch))
    const [newBranch, setNewBranch] = useState(false)

    let show_local_branching = (branches.length > 1)
    let show_remote_branching = (onPush ? true : false)
    if(remote_branches.length == 1 && !show_local_branching){
        show_remote_branching = false
    }

    function toggle_branch(){
        let p = !newBranch
        setNewBranch(p)
    }

    function getDefaultRemoteBranch(branches, br){
        if(branches){
            branches.map((item) => {
                if(item.branch == br) return br
            })
            if(branches[0]) return branches[0].branch
        }
        return "main"
    }

    function bopts(){
        return  branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
    }

    function ropts(){
        return remote_branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
    }

    function changeLocal(tar){
        setLocalBranch(tar.value)
    }

    function changeRemote(tar){
        setRemoteBranch(tar.value)
    }

    function inputRemote(tar){
        setRemoteBranch(tar.target.value)
    }

    function doPush(){
        onPush(localBranch, remoteBranch, repo)
    }

    return (
        <Col>
            {show_remote_branching &&
                <Row className="db-remote-action-spacing db-first-remote-action-height">
                    <span className="db-remote-branch-label">To Remote Branch</span>
                    {newBranch &&
                        <Col md={6}>
                            <input
                                className = "tcf-input"
                                type="text"
                                placeholder="Local Branch ID"
                                value={remoteBranch}
                                width="40"
                                onChange={inputRemote}
                                id= "local_branch_id"
                            />
                        </Col>
                    }
                    {!newBranch &&
                        <Col md={6}>
                            <Select
                                placeholder = {remoteBranch}
                                className = "select-branch"
                                onChange ={changeRemote}
                                name = "merge_branch_target"
                                id= "merge_branch_target"
                                options = {ropts()}
                                defaultValue= {remoteBranch}
                            />
                        </Col>
                    }
                    <Col md={3}>
                        <span onClick={toggle_branch}>
                            <BranchInputToggler/>
                        </span>
                    </Col>
                </Row>
            }
            {!show_remote_branching &&
                <Row className="db-remote-action-spacing db-first-remote-action-height">
                    To Remote Database
                </Row>
            }
            <Row>
                {onPush &&
                    <button type="submit" onClick={doPush} className="tdb__button__base tdb__button__base--green synch-action-text db-remote-action-buttons">
                        <AiOutlineCloudUpload style={{"fontSize": "40px"}} color="fff" className="title-remote-action-icon"/>
                        <span className="title-remote-action" style={{"fontSize": "20px"}}> Push </span>
                    </button>
                }
                {!onPush &&
                    <button type="submit" className="tdb__button__base tdb__button__base--gray synch-action-text db-remote-action-buttons">
                        <AiOutlineCloudUpload style={{"fontSize": "40px"}} className="title-remote-action-icon"/>
                        <span className="title-remote-action" style={{"fontSize": "20px"}}>Push not permitted</span>
                    </button>
                }
            </Row>
            {show_local_branching &&
                <Row className="db-remote-action-spacing">
                    <span className="db-remote-branch-label">From Local Branch</span>
                    <Col md={6}>
                        <Select
                            placeholder = {localBranch}
                            className = "select-branch"
                            onChange ={changeLocal}
                            name = "merge_branch_target"
                            id= "merge_branch_target"
                            options = {bopts()}
                            defaultValue= {localBranch}
                        />
                    </Col>
                </Row>
            }
            {!show_local_branching &&
                <Row  className="db-remote-action-spacing">
                    From Local Database
                </Row>
            }
        </Col>
    )
}

export const BranchInputToggler = () => {
    return (
        <span className="remote-comparison-action" title="Toggle Branch Selector">
            New <AiOutlineBranches className='branch-update-action' />
        </span>
    )
    /*return (<span title="Toggle Branch Selector">
        <span className="db_info">New</span>
        <AiOutlineBranches className="db_info_icon_spacing"/>
    </span>)*/
}


export const PullControl = ({branches, repo, remote_branches, branch, onPull}) => {

    const [localBranch, setLocalBranch] = useState(branch)
    const [remoteBranch, setRemoteBranch] = useState(getDefaultRemoteBranch(remote_branches, branch))
    const [newBranch, setNewBranch] = useState()

    let show_remote_branching = (remote_branches.length > 1)
    let show_local_branching = true
    if(!branches || (branches.length == 1 && !show_remote_branching)){
        show_local_branching = false
    }

    function toggle_branch(){
        let p = !newBranch
        setNewBranch(p)
    }


    function getDefaultRemoteBranch(branches, br){
        if(branches){
            branches.map((item) => {
                if(item.branch == br) return br
            })
            if(branches[0]) return branches[0].branch
        }
        return "main"
    }

    function bopts(){
        return  branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
    }

    function ropts(){
        return remote_branches.map( (item) => {
            return {label: item.branch, value: item.branch}
        })
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

    function doPull(){
        if(newBranch){
            repo.local_status="missing"
        }
        onPull(localBranch, remoteBranch, repo)
    }
    return (
        <Col>
            {show_remote_branching &&
                <Row className="db-remote-action-spacing db-first-remote-action-height">
                    From Remote Branch
                    <Col md={6}>
                        <Select
                            placeholder = {remoteBranch}
                            className = "select-branch"
                            onChange ={changeRemote}
                            name = "merge_branch_target"
                            id= "merge_branch_target"
                            options = {ropts()}
                            defaultValue= {remoteBranch}
                        />
                    </Col>
                </Row>
            }
            {!show_remote_branching &&
                <Row className="db-remote-action-spacing  db-first-remote-action-height">
                    From Remote Database
                </Row>
            }
            <Row className="db-remote-action-spacing">
                <button type="submit" onClick={doPull} className="tdb__button__base tdb__button__base--green synch-action-text db-remote-action-buttons">
                    <AiOutlineCloudDownload style={{"fontSize": "40px"}} color="fff" className="title-remote-action-icon"/>
                    <span className="title-remote-action" style={{"fontSize": "20px"}}> Pull </span>
                </button>
            </Row>
            {show_local_branching &&
                <Row className="db-remote-action-spacing">
                    <span className="db-remote-branch-label">To Local Branch</span>
                    {newBranch &&
                        <Col md={6}>
                            <input
                                className = "tcf-input"
                                type="text"
                                placeholder="Local Branch ID"
                                value={localBranch}
                                width="40"
                                onChange={inputLocal}
                                id= "local_branch_id"
                            />
                        </Col>
                    }
                    {!newBranch &&
                        <Col md={6}>
                            <Select
                                placeholder = {localBranch}
                                className = "select-branch"
                                onChange ={changeLocal}
                                name = "merge_branch_target"
                                id= "merge_branch_target"
                                options = {bopts()}
                                defaultValue= {localBranch}
                            />
                        </Col>
                    }
                    <Col md={3}>
                        <span onClick={toggle_branch}>
                            <BranchInputToggler/>
                        </span>
                    </Col>
                </Row>
            }
            {!show_local_branching &&
                <Row>
                    To Local Database
                </Row>
            }
        </Col>
    )
}
