/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {Row, Col, Badge, Container} from "reactstrap"
import { AiOutlineCloudUpload, AiOutlineCloudDownload, AiOutlineBranches} from 'react-icons/ai';
import Select from "react-select";

export const SynchronizeActions = ({branches, repo, remote_branches, branch, onPush, onPull}) => { 
    return (
        <>
            <Col key="rc7" className="db-remote-action-box">
                <PullControl 
                    branches={branches}
                    remote_branches={remote_branches}
                    branch={branch}
                    onPull={onPull}
                    repo={repo}
                />
            </Col>
            <Col key="rc8" className="db-remote-action-box">
                <PushControl 
                    branches={branches}
                    remote_branches={remote_branches}
                    branch={branch}
                    onPush={onPush}
                    repo={repo}
                />
            </Col>
        </>
    )
}

export const PushControl = ({branches, repo, remote_branches, branch, onPush}) => {

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
                <Row>
                    To Remote Branch 
                    {newBranch && 
                        <input
                            className = "local-branch-input"
                            type="text"
                            placeholder="Local Branch ID"
                            value={remoteBranch}
                            width="40"
                            onChange={inputRemote}
                            id= "local_branch_id"
                        />
                    }
                    {!newBranch && 
                        <Select
                            placeholder = {remoteBranch}
                            className = "select-branch"
                            onChange ={changeRemote}
                            name = "merge_branch_target"
                            id= "merge_branch_target"
                            options = {ropts()}
                            defaultValue= {remoteBranch}
                        />                    
                    }
                    <span onClick={toggle_branch}>
                        <BranchInputToggler/>
                    </span>   
                </Row>        
            }
            {!show_remote_branching && 
                <Row>
                    To Remote Database
                </Row>
            }
            <Row>
                {onPush && 
                    <button type="submit" onClick={doPush} className="tdb__button__base tdb__button__base--green synch-action-text">
                        <AiOutlineCloudUpload style={{"fontSize": "6em"}} color="fff" className="title-remote-action-icon"/> 
                        <span className="title-remote-action" style={{"fontSize": "3em"}}> Push </span>
                    </button>
                }
                {!onPush && 
                    <button type="submit" className="tdb__button__base tdb__button__base--gray synch-action-text">
                        <AiOutlineCloudUpload style={{"fontSize": "6em"}} className="title-remote-action-icon"/> 
                        <span className="title-remote-action">Push not permitted</span>
                    </button>                
                }
            </Row>            
            {show_local_branching && 
                <Row>From Local Branch
                    <Select
                        placeholder = {localBranch}
                        className = "select-branch"
                        onChange ={changeLocal}
                        name = "merge_branch_target"
                        id= "merge_branch_target"
                        options = {bopts()}
                        defaultValue= {localBranch}
                    />                 
                </Row>        
            }
            {!show_local_branching && 
                <Row>
                    From Local Database
                </Row>
            }
        </Col>
    )
}

export const BranchInputToggler = () => {
    return (<span title="Toggle Branch Selector">
        <AiOutlineBranches className="db_info_icon_spacing"/>
        <span className="db_info">New</span>
    </span>)   
}


export const PullControl = ({branches, repo, remote_branches, branch, onPull}) => {

    const [localBranch, setLocalBranch] = useState(branch)
    const [remoteBranch, setRemoteBranch] = useState(getDefaultRemoteBranch(remote_branches, branch))
    const [newBranch, setNewBranch] = useState()

    let show_remote_branching = (remote_branches.length > 1)
    let show_local_branching = true
    if(branches.length == 1 && !show_remote_branching){
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
                <Row>
                    From Remote Branch 
                    <Select
                        placeholder = {remoteBranch}
                        className = "select-branch"
                        onChange ={changeRemote}
                        name = "merge_branch_target"
                        id= "merge_branch_target"
                        options = {ropts()}
                        defaultValue= {remoteBranch}
                    />
                </Row>        
            }
            {!show_remote_branching && 
                <Row>
                    From Remote Database 
                </Row>
            }
            <Row>
                <button type="submit" onClick={doPull} className="tdb__button__base tdb__button__base--green synch-action-text">
                    <AiOutlineCloudDownload style={{"fontSize": "6em"}} color="fff" className="title-remote-action-icon"/> 
                    <span className="title-remote-action" style={{"fontSize": "3em"}}> Pull </span>
                </button>
            </Row>
            {show_local_branching && 
                <Row>
                    To Local Branch 
                    {newBranch && 
                        <input
                            className = "local-branch-input"
                            type="text"
                            placeholder="Local Branch ID"
                            value={localBranch}
                            width="40"
                            onChange={inputLocal}
                            id= "local_branch_id"
                        />
                    }
                    {!newBranch && 
                        <Select
                            placeholder = {localBranch}
                            className = "select-branch"
                            onChange ={changeLocal}
                            name = "merge_branch_target"
                            id= "merge_branch_target"
                            options = {bopts()}
                            defaultValue= {localBranch}
                        />                    
                    }  
                    <span onClick={toggle_branch}>
                        <BranchInputToggler/>
                    </span>                      
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