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
import {Col, Row, Container, Alert} from "react-bootstrap"
import Loading from '../../components/Reports/Loading'
import Select from "react-select"
import {MAIN_BRANCH} from "./constants.dbmanage"


export const Merge = ({currentBranch, setReport, setBranchAction}) => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref, branches, consoleTime, DBInfo} = DBContextObj()

    const [loading, setLoading] = useState(false)
    const [targetBranch, setTargetBranch] = useState(branch)
    const [sourceBranch, setSourceBranch] = useState(MAIN_BRANCH)
    const [sourceCommit, setSourceCommit] = useState(branches[MAIN_BRANCH].head)
    const [selectedCommit, setSelectedCommit]=useState(selectedCommit)

    useEffect(() => {
        if(ref && !sourceCommit){
            setSourceCommit(ref)
            setSourceBranch(branch)
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
            setSourceBranch(branch)
            setSourceCommit(branches[branch].head)
        }
        if(branch && !sourceCommit){
            setSourceBranch(branch)
        }
    }, [branch, ref, consoleTime, branches])


    /*const [targetCommit, setTargetCommit] = useState()
    const [starterBranch, setStarterBranch] = useState()*/
    const [commitMsg, setCommitMsg] = useState("")
    const [submissionProblem, setSubmissionProblem] = useState()

    let update_start = Date.now()

    /*useEffect(() => {
        if(ref && !targetCommit){
            setTargetCommit(ref)
            setStarterBranch(branch)
        }
        else if(!targetCommit){
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
            setStarterBranch(branch)
            setTargetCommit(branches[currentBranch].head)
        }
        if(branch && !targetBranch){
            setTargetBranch(branch)
        }
    }, [branch, ref, consoleTime, branches]) */

    //const [report, setReport] = useState()

    function getMergeRoot(){
        let b = isBranchHead(sourceCommit)
        //return woqlClient.resource('branch', b)
        if(b) return woqlClient.resource('branch', b)
        return woqlClient.resource('ref', sourceCommit)
    }

    function isBranchHead(myref){
        for(var b in branches){
            if(b !== branch){
                if(branches[b].head == sourceCommit){
                    return b
                }
            }
        }
        return false
    }


    function onCreate() {
        setLoading(true)
        update_start = Date.now()
        let nClient = woqlClient.copy()
        nClient.ref(false)
        nClient.checkout(targetBranch)
        nClient.remote_auth(nClient.local_auth())
        let url = `admin/${woqlClient.db()}/local/commit/${selectedCommit}`

        let rebase_source = {
            //rebase_from: getMergeRoot(),
           //rebase_from: woqlClient.resource('ref', sourceCommit)
           rebase_from: url
        }
        if (commitMsg) rebase_source.message = commitMsg
        else rebase_source.message = `Merging from ${selectedCommit}, branch ${sourceBranch}, into branch ${targetBranch} with console`

        return nClient
            .rebase(rebase_source)
            .then(() => {
                let message = `${MERGE_BRANCH_FORM.mergeSuccessMessage} ${sourceBranch} into branch ${targetBranch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setBranchAction({branch:targetBranch, create:false, merge:false, reset: false, squash: false})
                setReport(rep)
            })
            .catch((err) => {
                let message = `${MERGE_BRANCH_FORM.mergeFailureMessage} into branch ${targetBranch} `
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function selectCommitID(c){
        setSubmissionProblem(false)
        if(c != sourceCommit){
            //setTargetCommit(c)
        }
    }

    function changeSourceBranch(b){
        setSubmissionProblem(false)
        //setStarterBranch(b)
    }

    /*function changeTarget(a){
        if(a && a.value && a.value != targetBranch){
            setSubmissionProblem(false)
            setTargetBranch(a.value)
        }
    }  */

    function updateCommitMsg(a){
        if(a && a.target){
            setSubmissionProblem(false)
            setCommitMsg(a.target.value)
        }
    }

    function setUserError(field, msg){
        setSubmissionProblem(msg)
    }



    function checkSubmission(){
        setReport()
        if(!selectedCommit){
            return setUserError("create_branch_source", "You must select a commit to start the new branch from")
        }
        else if(selectedCommit.length < 30){
            return setUserError("create_branch_source", "Incorrect format for commit ID - it should be a 30 character string")
        }
        if(!targetBranch){
            return setUserError("create_branch_target", "You must select a branch to merge into")
        }
        if(!(branches && branches[targetBranch])){
            return setUserError("create_branch_target", `Selected branch ${targetBranch} not found`)
        }
        //if(branches[targetBranch].head == targetCommit){
        if(branches[branch].head == selectedCommit){
            return setUserError("create_branch_target", `Selected branch ${selectedCommit} is the same as source commit - cannot merge a commit with itself`)
        }
        let isbranch = isBranchHead(sourceCommit)
        if(false && !isbranch){
            return setUserError("create_branch_source", `Selected source commit ${sourceCommit} is not the head of a branch. The source of a merge must be the head of a branch - you can create a new branch from the desired comment and merge from it.`)
        }
        return onCreate()
    }

    function getContextText(){
        return `Merge from branch ${sourceBranch} to ${targetBranch}`
    }


    /*if (report && report.status == TERMINUS_SUCCESS) {
        return (<span className="database-list-intro"><TerminusDBSpeaks report={report} /></span>)
    }*/

    if(!sourceBranch || !targetBranch) return null

    const showAlert = submissionProblem ? {} : {style:{visibility:'hidden'}}

    let bopts = ((branches && Object.keys(branches).length) ? Object.values(branches).map( (item) => {
        return {label: item.id, value: item.id}
    }) : [])


    return (<>
            <Container className="new-branch">
                <Row>
                    <CommitSelector
                        branch={targetBranch}
                        branches={branches}
                        onChangeBranch={changeSourceBranch}
                        contextText={getContextText()}
                        commit={ref}
                        onSelect={selectCommitID}
                        firstCommit={DBInfo.created}
                        woqlClient={woqlClient}
                        setSourceBranch={setSourceBranch}
                        sourceBranch={sourceBranch}
                        actionMessage="Merge From This Commit"
                        setSelectedCommit={setSelectedCommit}
                    />
                </Row>
                <div className='row' {...showAlert}>
                    <Alert variant='warning' className="flex-grow-1">
                        {submissionProblem || 'noValue'}
                    </Alert>
                </div>
                {/*report &&
                    <TerminusDBSpeaks report={report} />
                */}
                <Col className="merge-inputs">
                    {/*<Row className="merge-branch">
                        <Col className="branch-selector-title-col" md={2}>
                            <span className="commit-selector-title">
                                Merge Into Branch
                            </span>
                        </Col>
                        <Col md={4} className="branch-selector-col" >
                            <Select
                                placeholder = {targetBranch}
                                className = "select-branch"
                                onChange ={changeTarget}
                                name = "merge_branch_target"
                                id= "merge_branch_target"
                                options = {bopts}
                                defaultValue= {targetBranch}
                            />
                        </Col>
                    </Row>*/}
                    <Row className="merge-commit">
                        <Col className="commit-log-title" md={2}>
                            <span className="commit-selector-title">
                                Commit Log Message
                            </span>
                        </Col>
                        <Col md={7} className="commit-log-col" >
                            <input
                                className = "commit-log-input"
                                type="text"
                                placeholder="Enter message for commit log"
                                value={commitMsg}
                                width="40"
                                onChange={updateCommitMsg}
                                id= "merge_branch_source"
                            />
                        </Col>
                    </Row>
                </Col>
                <div className="justify-content-end flex-grow-1 d-flex align-items-baseline" style={{"z-index": 99999}}>
                    <Col md={10}>
                    </Col>
                    <Col md={2}>
                        <button type="submit" onClick={checkSubmission} className="tdb__button__base tdb__button__base--green">
                            Merge into {targetBranch} Branch
                        </button>
                    </Col>
                </div>
            </Container>
        </>
    )
}

/*
<div className="tdb__loading__parent">
<Container>

</Container>
{(loading || !branches) && <Loading type={TERMINUS_COMPONENT} />}
</div>
*/
