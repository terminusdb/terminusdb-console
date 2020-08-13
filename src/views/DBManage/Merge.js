/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TCForm, TCRow} from '../../components/Form/FormComponents'
import {MERGE_BRANCH_FORM} from './constants.dbmanage'
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
import Select from "react-select";


export const Merge = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref, branches, consoleTime, DBInfo, updateBranches} = DBContextObj()

    const [loading, setLoading] = useState(false)

    const [sourceCommit, setSourceCommit] = useState()
    const [starterBranch, setStarterBranch] = useState()
    const [targetBranch, setTargetBranch] = useState()
    const [submissionProblem, setSubmissionProblem] = useState()
    const [manuallyUpdated, setManuallyUpdated] = useState(false)

    let update_start = Date.now()

    useEffect(() => {
        if(ref && !sourceCommit){
            setSourceCommit(ref)
            setStarterBranch(branch)
        }
        else if(!sourceCommit){
            let guess = false
            for(var b in branches){
                if(b != branch){
                    if(!guess) guess = branches[b]
                    else if(branches[b].updated > guess.updated){
                        guess = branches[b]
                    }
                }
            }
            let chosen = guess ? guess.id : branch
            setStarterBranch(chosen)
            setSourceCommit(branches[chosen].head)
        }
        if(branch && !targetBranch){
            setTargetBranch(branch)
        }
    }, [branch, ref, consoleTime, branches])

    const [report, setReport] = useState()
    function onCreate() {
        setLoading(true)
        update_start = Date.now()
        let nClient = woqlClient.copy()
        nClient.ref(false)
        nClient.checkout(values.target)
        nClient.remote_auth(nClient.local_auth())
        let rebase_source = {
            rebase_from: frombase,
        }
        if (values.commit) rebase_source.message = values.commit
        return nClient
            .rebase(rebase_source)
            .then(() => {
                let message = `${MERGE_BRANCH_FORM.mergeSuccessMessage} into branch ${values.target}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterCreate(values.target)
            })
            .catch((err) => {
                let message = `${MERGE_BRANCH_FORM.mergeFailureMessage} into branch ${values.target} `
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

    function changeTarget(a){
        setTargetBranch(a.value)
    }

    if (report && report.status == TERMINUS_SUCCESS) {
        return <TerminusDBSpeaks report={report} />
    }
    let setHead = manuallyUpdated ? unsetManual : false

    if(!starterBranch || !targetBranch) return null

    let bopts = ((branches && Object.keys(branches).length) ? Object.values(branches).map( (item) => {
        return {label: item.id, value: item.id}
    }) : [])
    return (<>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            <Container>
                <Row>
                    <CommitSelector 
                        branch={starterBranch} 
                        commit={ref}
                        onSelect={selectCommitID}
                        firstCommit={DBInfo.created}
                        woqlClient={woqlClient}
                        setHead={setHead} 
                        actionMessage="Merge From This Commit"
                    />
                </Row>
                <Row>
                    <Col>
                        <Row>Merge From Commit
                            <input 
                                className = ""
                                type="text"
                                value={sourceCommit}
                                width="40"
                                onChange={setCommitID}
                                id= "merge_branch_source"
                            />
                        </Row>
                        <Row>Merge Into Branch
                            <Select
                                className = ""
                                onChange ={changeTarget}
                                name = "merge_branch_target"
                                id= "merge_branch_target"
                                options = {bopts}
                                defaultValue= {targetBranch}
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
                            Merge into {targetBranch} Branch
                        </button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

