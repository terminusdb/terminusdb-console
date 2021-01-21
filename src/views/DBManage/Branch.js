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
import {legalURLID} from "../../components/Query/CollaborateAPI"
import {Col, Row, Container, Alert} from "react-bootstrap" //replaced
import Loading from '../../components/Reports/Loading'
import Select from "react-select"

export const Branch = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref, branches, consoleTime, DBInfo, setHead, updateBranches} = DBContextObj()

    const [loading, setLoading] = useState(false)

    const [sourceCommit, setSourceCommit] = useState()
    const [newID, setNewID] = useState()
    const [submissionProblem, setSubmissionProblem] = useState()
    const [branchType, setBranchType] = useState("head")

    let update_start = Date.now()

    function updateBranchType(e){
        setBranchType(e.value)
    }

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
            alert("yoyo")
            setHead(newID)
        }
    }, [branches])

    const [report, setReport] = useState()

    function afterCreate(update_start){
        let message = `${CREATE_BRANCH_FORM.branchSuccessMessage} ${newID}`
        let rep = {
            message: message,
            status: TERMINUS_SUCCESS,
            time: Date.now() - update_start,
        }
        setReport(rep)
        updateBranches(newID)
    }

    function onCreate() {
        setLoading(true)
        let update_start = Date.now()
        let nc = woqlClient.copy()
        let source_free = (branchType == "empty")
        if(branchType != "empty"){
            nc.ref(sourceCommit)
        }
        nc.branch(newID, source_free)
        .then(() => afterCreate(update_start))
        .catch((err) => {
            let message = `${CREATE_BRANCH_FORM.branchFailureMessage} ${newID} `
            setReport({error: err, status: TERMINUS_ERROR, message: message})
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function selectCommitID(c){
        if(c != sourceCommit){
            setSourceCommit(c)
            setSubmissionProblem(false)
        }
    }

    function updateID(c){
        if(c && c.target){
            setNewID(c.target.value)
            setSubmissionProblem(false)
        }
    }

    function setUserError(field, msg){
        setSubmissionProblem(msg)
    }

    function checkSubmission(){
        if(branchType != "empty"){
            if(!sourceCommit){
                return setUserError("create_branch_source", "You must select a commit to start the new branch from")
            }
            else if(sourceCommit.length < 30){
                return setUserError("create_branch_source", "Incorrect format for commit ID - it should be a 30 character string")
            }                    
        }
        if(newID && newID.length){
            let nid = newID.trim()
            if(typeof branches[nid] != "undefined"){
                return setUserError("create_branch_id", "A branch already exists with the same ID - choose a new ID")
            }
            else {
                if(!legalURLID(nid)){
                    return setUserError("create_branch_id", "Branch IDs can only include lowercase characters, numbers and underscores and be no more than 40 characters long")
                }
                return onCreate()
            }
        }
        else {
            return setUserError("create_branch_id", "You must supply an ID for the new branch")
        }
    }


    if (report && report.status == TERMINUS_SUCCESS) {
        return (<div className='row generic-message-holder'><TerminusDBSpeaks report={report} /></div>)
    }

    if(!DBInfo) return null

    let btypes = [
        {value: "head", label: "Branch from Current Head"},
        {value: "empty", label: "Empty branch"},
        {value: "choose", label: "Choose Commit to Branch from"}
    ]

    let ph = ""
    for(var i = 0; i<btypes.length; i++){
        if(branchType == btypes[i].value) ph = btypes[i].label
    }

    let showAlert = submissionProblem ? {} : {style:{visibility:'hidden' , flexGrow:1}}
    return (<>
            {loading && <Loading type={TERMINUS_COMPONENT} />}

            <Container>
            <div className='row generic-message-holder' {...showAlert}>
                <Alert color='warning' className="flex-grow-1">
                    {submissionProblem || 'noValue'}
                </Alert>
            </div>                    

            {report && report.status != TERMINUS_SUCCESS &&
                 <div className='row generic-message-holder'><TerminusDBSpeaks report={report} /></div>
            }
            <Row className="new-branch">
                <Col className="branch-type-col" >
                    <Select 
                        className = ""
                        placeholder = {ph}
                        defaultValue={branchType}
                        width="40"
                        options={btypes}
                        onChange={updateBranchType}
                        id="create_branch_id"
                    />
                </Col>
                <Col className="branch-id-col" >
                    <input 
                        className = "tcf-input"
                        placeholder = "Enter New Branch ID"
                        value={newID}
                        width="40"
                        onChange={updateID}
                        id="create_branch_id"
                    />
                </Col>
                <Col>
                    <button type="submit" onClick={checkSubmission} className="mt-1 tdb__button__base tdb__button__base--green">
                        Create New Branch
                    </button>
                </Col>
            </Row> 
            { branchType == "choose" &&            
                <Row>
                    <CommitSelector 
                        branch={branch} 
                        branches={branches}
                        contextText={"Start New Branch From "}
                        commit={ref}
                        onSelect={selectCommitID}
                        firstCommit={DBInfo.created}
                        woqlClient={woqlClient}
                        actionMessage="Start New Branch From This Commit"
                    />
                </Row>
            }
            </Container>
        </>
    )
}
