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
import Loading from "../../components/Reports/Loading"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import { DATETIME_COMPLETE, DATETIME_REGULAR, DATE_REGULAR } from "../../constants/dates"
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCopy, AiFillWarning,
    AiOutlineCloudSync, AiOutlineCloudDownload, AiOutlineFork, AiFillCheckCircle,AiFillEdit, AiFillCopy,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild,
    AiOutlineGlobal, AiOutlineLink, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete, AiFillDatabase} from 'react-icons/ai';
import Select from "react-select";
import { validURL } from '../../utils/helperFunctions'

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
    let pull_title = "Pull Changes"

    let show_branch_choosers = (branches && branches.length> 1) || (remote_branches && remote_branches.length> 1)

    if(localBranch && show_branch_choosers && branches && branches.length){
        pull_title += " to branch " + localBranch
    }
    localCols.push(
        <Row key="lc1" className="db-remote-action-label">Local Database</Row>
    )
    localCols.push(
        <Col key="lc2" md={7} className="db-remote-action-display-controls">
            {(localBranch && remoteBranch) &&
                <button type="submit" onClick={pull} className="tdb__button__base tdb__button__base--green">
                    {pull_title}
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
                <Col key="lc3" md={4} className="db-remote-action-display-controls">
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
                <Col key="lc4" md={4} className="db-remote-action-display-controls">
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
    let push_title = "Push Changes"
    if(remoteBranch && show_branch_choosers && remote_branches && remote_branches.length){
        push_title += " to branch " + remoteBranch
    }
    remoteCols.push(
        <Row key="rc1" className="db-remote-action-label">Remote Database</Row>
    )
    if(onPush){
        remoteCols.push(
            <Col key="rc2" md={7} className="db-remote-action-display-controls">
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
            <Col key="rc3" md={7} className="db-remote-action-display-controls">
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
            <Col key="rc4" md={7} className="db-remote-action-display-controls">
                {(localBranch && remoteBranch) &&
                    <button type="submit" className="tdb__button__base tdb__button__base--gray">
                        Push not permitted
                    </button>
                }
            </Col>
        )
    }
    if(show_branch_choosers){
        if(remote_branches && remote_branches.length){
            if(remote_branches.length >1){
                let ropts = remote_branches.map( (item) => {
                    return {label: item.branch, value: item.branch}
                })
                remoteCols.push(
                    <Col key="rc5" md={4} className="db-remote-action-display-controls">
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
                <Col key="rc6" md={4} className="db-remote-action-display-controls">
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
            <Col key="rc7" md={5} className="db-remote-action-box">
                {localCols}
            </Col>
            <Col key="rc8" md={5}className="db-remote-action-box">
                {remoteCols}
            </Col>
        </>
    )
}