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
    const {branch, ref, branches, consoleTime, DBInfo, setHead, updateBranches} = DBContextObj()

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

    useEffect(() => {
        if(loading && newID){
            setHead(newID)
        }
    }, [branches])

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
    let setCommit = manuallyUpdated ? unsetManual : null

    let showAlert = submissionProblem ? {} : {style:{visibility:'hidden' , flexGrow:1}}
    return (<>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
{/*
            <TCForm
                layout={[3]}
                fields={BRANCH_SOURCE_FORM.fields}
                onChange={onSourceUpdate}
                values={sourceValues}
                report={{status: TERMINUS_INFO, message: BRANCH_SOURCE_FORM.infoMessage}}
            />
            <TCForm
                onSubmit={onCreate}
                report={report}
                layout={[1, 1]}
                onChange={onUpdate}
                fields={CREATE_BRANCH_FORM.fields}
                values={values}
                buttons={btns}
            />
*/}
            <Container>
                <Row>
                    <CommitSelector 
                        branch={branch} 
                        commit={ref}
                        onSelect={selectCommitID}
                        firstCommit={DBInfo.created}
                        woqlClient={woqlClient}
                        setHead={setCommit} 
                        actionMessage="Start New Branch From This Commit"
                    />
                </Row>
                <div className='row' {...showAlert}>
                    <Alert color='warning' className="flex-grow-1">
                        {submissionProblem || 'noValue'}
                    </Alert>
                </div>
                <Row>
                   
                    <Col>
                        <Row className="mb-4">Start Branch From Commit
                            <input 
                                className = "mt-2"
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
                            className = "mt-2"
                            value={newID}
                            width="40"
                            onChange={updateID}
                            id="create_branch_id"
                        />
                        </Row>
                    </Col>
                    <div className="justify-content-end flex-grow-1 d-flex align-items-baseline">
                        <button type="submit" onClick={checkSubmission} className="tdb__button__base tdb__button__base--green">
                            Create New Branch
                        </button>
                    </div>
                </Row>
            </Container>
        </>
    )
}

