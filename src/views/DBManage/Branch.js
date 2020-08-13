/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TCForm, TCRow} from '../../components/Form/FormComponents'
import {CREATE_BRANCH_FORM, BRANCH_SOURCE_FORM} from './constants.dbmanage'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts} from '../../constants/dates'
import {CommitSelector} from "./CommitSelector"
import {Col, Row, Container, Alert} from "reactstrap"
import Loading from '../../components/Reports/Loading'

export const Branch = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref, branches, consoleTime, DBInfo, updateBranches} = DBContextObj()

    const [loading, setLoading] = useState(false)

    const [sourceCommit, setSourceCommit] = useState()
    const [newID, setNewID] = useState()
    const [submissionProblem, setSubmissionProblem] = useState()
    const [manuallyUpdated, setManuallyUpdated] = useState(false)

    let update_start = Date.now()

    useEffect(() => {
        if(ref && !sourceCommit){
            setSourceCommit(ref)
        }
        else if(branch && !sourceCommit){
            setSourceCommit(branches[branch].head)
        }
    }, [branch, ref, consoleTime])

    const [report, setReport] = useState()

    function onCreate() {
        setLoading(true)
        update_start = Date.now()
        let nc = woqlClient.copy()
        nc.ref(sourceCommit)
        nc.branch(newID)
        .then(() => {
            let message = `${CREATE_BRANCH_FORM.branchSuccessMessage} ${newID}`
            let rep = {
                message: message,
                status: TERMINUS_SUCCESS,
                time: Date.now() - update_start,
            }
            setReport(rep)
            updateBranches()
        })
        .catch((err) => {
            let message = `${CREATE_BRANCH_FORM.branchFailureMessage} ${newID} `
            setReport({error: err, status: TERMINUS_ERROR, message: message})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function setCommitID(c){
        if(c && c.target){
            let update = c.target.value.length > 0
            setManuallyUpdated(update);
            setSourceCommit(c.target.value)
        }
    }

    function selectCommitID(c){
        if(c != sourceCommit && (!manuallyUpdated)){
            setSourceCommit(c)
        }
    }

    function unsetManual(){
        setManuallyUpdated(false)
    }

    function updateID(c){
        if(c && c.target){
            setNewID(c.target.value)
        }
    }

    function setUserError(field, msg){
        setSubmissionProblem(msg)
    }

    function checkSubmission(){
        if(!sourceCommit){
            return setUserError("create_branch_source", "You must select a commit to start the new branch from")
        }
        else if(sourceCommit.length < 30){
            return setUserError("create_branch_source", "Incorrect format for commit ID - it should be a 30 character string")
        }                    
        if(newID && newID.length){
            if(typeof branches[newID] != "undefined"){
                return setUserError("create_branch_id", "A branch already exists with the same ID - choose a new ID")
            }
            else {
                return onCreate()
            }
        }
        else {
            return setUserError("create_branch_id", "You must supply an ID for the new branch")
        }
    }

    if (report && report.status == TERMINUS_SUCCESS) {
        return <TerminusDBSpeaks report={report} />
    }
    let setHead = manuallyUpdated ? unsetManual : false
    return (<>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            <Container>
                <Row>
                    <CommitSelector 
                        branch={branch} 
                        commit={ref}
                        onSelect={selectCommitID}
                        firstCommit={DBInfo.created}
                        woqlClient={woqlClient}
                        setHead={setHead} 
                        actionMessage="Start New Branch From This Commit"
                    />
                </Row>
                <Row>
                    <Col>
                        <Row>Start Branch From Commit
                            <input 
                                className = ""
                                type="text"
                                value={sourceCommit}
                                width="40"
                                onChange={setCommitID}
                                id= "create_branch_source"
                            />
                        </Row>
                        <Row>New Branch ID
                        <input 
                            type="text"
                            className = ""
                            value={newID}
                            width="40"
                            onChange={updateID}
                            id="create_branch_id"
                        />
                        </Row>
                    </Col>
                    <Col>
                        {submissionProblem && 
                            <Alert color='warning'>
                                {submissionProblem}
                            </Alert>
                        }
                        <button type="submit" onClick={checkSubmission} className="primary">
                            Create New Branch
                        </button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

