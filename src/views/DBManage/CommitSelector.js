import React, {useState, useEffect, Fragment} from 'react'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {printts} from '../../constants/dates'
import {Row, Col, Container} from "reactstrap"
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import {BranchSelector} from '../../components/History/BranchSelector' 


export const CommitSelector = ({branch, ref, branches, contextText, onSelect, onChangeBranch, commit, woqlClient, firstCommit, time, actionMessage}) => {
    const [sourceCommit, setSourceCommit] = useState(ref)
    const [manuallyUpdated, setManuallyUpdated] = useState(false)
    const [myBranch, setMyBranch] = useState(branch)

    function setCurrentItem(item){
        if(item && item.commit != sourceCommit && (!manuallyUpdated)){
            updateSourceCommit(item.commit)
        }
    }

    function updateSourceCommit(c){
        setSourceCommit(c)
        if(onSelect) onSelect(c)
    }

    function changeBranch(mybranch){
        setMyBranch(mybranch)
        if(onChangeBranch) onChangeBranch(mybranch)
    }

    function setCommitID(c){
        if(c && c.target){
            let update = c.target.value.length > 0
            setManuallyUpdated(update);
            updateSourceCommit(c.target.value)
        }
    }
    
    function unsetManual(){
        setManuallyUpdated(false)
    }

    function getContextDescription(){
        if(branches && branches[myBranch] && branches[myBranch].head == sourceCommit){
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
                        {contextText}
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
                        value={sourceCommit}
                        onChange={setCommitID}
                        id="create_branch_source"
                    />
                </span>
            </Col>
            <Col md={2} className='commit-branch-selector'>
                <BranchSelector onChange={changeBranch} currentBranch={myBranch}/>    
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
                    currentCommit={commit}
                    firstCommit={firstCommit}
                    currentStartTime={time} 
                />
            </div>
        </Row>
    </Container>)
}
