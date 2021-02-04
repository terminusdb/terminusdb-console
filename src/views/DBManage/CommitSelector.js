import React, {useState, useEffect, Fragment} from 'react'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {printts} from '../../constants/dates'
import {Row, Col, Container} from "react-bootstrap" //replaced
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import {BranchSelector} from '../../components/History/BranchSelector'
import {MAIN_BRANCH} from "./constants.dbmanage"


export const CommitSelector = ({branch, ref, branches, contextText, onSelect, onChangeBranch, commit, woqlClient, firstCommit, time, actionMessage, setTargetBranch}) => {
    //const [targetCommit, setTargetCommit] = useState(ref)
    const [manuallyUpdated, setManuallyUpdated] = useState(false)
    const [myBranch, setMyBranch] = useState(MAIN_BRANCH)
    const [targetCommit, setTargetCommit] = useState(branches[myBranch].head)

    function setCurrentItem(item){
        if(item && item.commit != targetCommit && (!manuallyUpdated)){
            updateTargetCommit(item.commit)
        }
    }

    function updateTargetCommit(c){
        setTargetCommit(c)
        if(onSelect) onSelect(c)
    }

    function changeBranch(mybranch){
        setMyBranch(mybranch)
        setTargetCommit(branches[mybranch].head)
        if(onChangeBranch) onChangeBranch(mybranch)
    }


    function setCommitID(c){
        if(c && c.target){
            let update = c.target.value.length > 0
            setManuallyUpdated(update);
            updateTargetCommit(c.target.value)
        }
    }

    function unsetManual(){
        setManuallyUpdated(false)
    }

    function getContextDescription(){
        if(branches && branches[myBranch] && branches[myBranch].head == targetCommit){
            return "Latest Commit on " + myBranch + " branch"
        }
        return ""
    }

    let setCommit = manuallyUpdated ? unsetManual : null

    return (
    <Container>
        <Row className="commit-selector-header">
            <Col className="commit-title-col" md={2}>
                <span className="commit-selector-title">
                        {contextText} {myBranch}
                </span>
            </Col>
            <Col md={3} className='commit-branch-context'>
                {getContextDescription()}
            </Col>
            <Col md={5} className="commit-id-col" >
                <span className="commit-id-label">
                        Commit ID
                </span>
                <span className="commit-id-input-box">
                    <input
                        className="commit-id-input"
                        value={targetCommit}
                        onChange={setCommitID}
                        id="create_branch_source"
                    />
                </span>
            </Col>
            <Col md={2} className='commit-branch-selector'>
                <BranchSelector onChange={changeBranch} currentBranch={myBranch} setTargetBranch={setTargetBranch}/>
            </Col>
        </Row>
        <Row>
            <div className="history__nav history__nav--noshadow ">
                <TimelineCommits
                    branch={myBranch}
                    woqlClient={woqlClient}
                    onChange={setCurrentItem}
                    headMessage={actionMessage}
                    setHead={setCommit}
                    currentCommit={targetCommit} //  currentCommit={commit}
                    firstCommit={firstCommit}
                    currentStartTime={time}
                />
            </div>
        </Row>
    </Container>)
}
