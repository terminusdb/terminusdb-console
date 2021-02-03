import React, {useState, useEffect} from "react";
import { Branch } from "./Branch"
import { Merge } from "./Merge"
import { MANAGE_SECTIONS, SQUASH_BRANCH_FORM, RESET_BRANCH_FORM, OPTIMIZE_BRANCH_FORM, MAIN_BRANCH } from "./constants.dbmanage"
import {TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import { RiverOfSections } from "../Templates/RiverOfSections"
import { ConsoleNavbar } from "../../components/Navbar/ConsoleNavbar"
import {PageView} from "../Templates/PageView"
import {ControlledTable} from '../Tables/ControlledTable'
import { FrameViewer } from '@terminusdb/terminusdb-react-components';
import {BiArrowBack, BiNetworkChart} from "react-icons/bi"
import TerminusClient from '@terminusdb/terminusdb-client'
import {RiDeleteBin5Line} from "react-icons/ri"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {BranchNavBar} from "./BranchNavBar"
import Loading from '../../components/Reports/Loading'
import {BranchCommits} from "./BranchCommits"
import {Reset} from "./Reset"
import {Squash} from "./Squash"
import {ActionHeader} from "./ActionHeader"


export const ManageDB = (props) => {
    const {graphs, ref, branch, updateBranches, setHead}=DBContextObj()
    const {woqlClient}=WOQLClientObj()
    const [branchCount, setBranchCount]=useState()
    const [branchAction, setBranchAction]=useState({})
    const [loading, setLoading]=useState(false)
    const [reportMsg, setReport]=useState(false)

    const branchCountQuery = () => {
        let WOQL=TerminusClient.WOQL
        return WOQL.count("v:Count", WOQL.lib().branches())
    }

    const [updateQuery, report, bCount, woql]=WOQLQueryContainerHook(
        woqlClient,
        branchCountQuery(),
        branch,
        ref,
    )

    useEffect(() => {
        if(bCount){
            let v = 0
            if(bCount.bindings && bCount.bindings[0] && bCount.bindings[0]['Count']['@value'])
                v = bCount.bindings[0]['Count']['@value']
            setBranchCount(v)
        }
    }, [bCount])

    function getBranchQuery(){
        return TerminusClient.WOQL.lib().branches()
    }

    const [query, setQuery] = useState(getBranchQuery())

    const getDeleteButton=(cell)=>{
        if(cell.row.values["Branch ID"]["@value"] == MAIN_BRANCH) return <span/>
		return <span className="schema-toolbar-delete-holder" title={"Delete Document"}>
            <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete'/>
        </span>
	}

    function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

    const onDelete = (branch) => {
        let update_start = Date.now()
        setLoading(true)
        woqlClient.deleteBranch(branch).then((results) => {
            setReport({status: TERMINUS_SUCCESS, message: "Successfully deleted branch " + branch})
            updateBranches(MAIN_BRANCH)
        })
        .catch((err) => process_error(err, update_start, "Failed to delete branch " + branch))
        .finally(() => {
            setBranchAction({branch:false, create:false, merge:false, reset: false, squash: false})
            setLoading(false)
        })
    }

    const onSquash = (branch, commit) => {
        let update_start = Date.now()
        var new_commit
        setLoading(true)
        woqlClient.squashBranch(branch, commit).then((results) => {
            if(results["api:commit"]){
                var cmt = results["api:commit"].split("/");
                new_commit = cmt.pop()
            }
            woqlClient.resetBranch(branch, new_commit).then((results) => {
                setReport({status: TERMINUS_SUCCESS, message: SQUASH_BRANCH_FORM.squashBranchSuccessMessage + branch})
                setHead(branch, {commit: new_commit})
                setBranchAction({branch:branchAction.branch, create:false, merge:false, reset: false, squash: false})
            })
        })
        .catch((err) => process_error(err, update_start, SQUASH_BRANCH_FORM.squashBranchFailureMessage + branch))
        .finally(() => setLoading(false))
    }

    const onReset = (branch, commit) => {
        let update_start = Date.now()
        setLoading(true)
        woqlClient.resetBranch(branch, commit).then((results) => {
            setReport({status: TERMINUS_SUCCESS, message: RESET_BRANCH_FORM.resetBranchSuccessMessage + branch})
            setHead(branch, {commit: commit})
            setBranchAction({branch:branch, create:false, merge:false, reset: false, squash: false})
        })
        .catch((err) => process_error(err, update_start, RESET_BRANCH_FORM.resetBranchFailureMessage + branch))
        .finally(() => setLoading(false))
    }

    const onOptimize = (branch) => {
        let update_start = Date.now()
        var message = OPTIMIZE_BRANCH_FORM.optimizeSystemSuccessMessage
        setLoading(true)
        woqlClient.optimize_branch(branchAction.branch).then(()=>{
            setReport({status: TERMINUS_SUCCESS, message: OPTIMIZE_BRANCH_FORM.optimizeSuccessMessage + branch})
            setBranchAction({branch:branchAction.branch, create:false, merge:false, reset: false, squash: false})
        })
        .catch((err) => process_error(err, update_start, OPTIMIZE_BRANCH_FORM.optimizeFailureMessage + branch))
        .finally(() => setLoading(false))
    }

    const onClose = () => {
		setBranchAction({branch:branchAction.branch, create:false, merge:false, reset: false, squash: false})
        setReport(false)
	}


    const deleteBranch = (cell) => {
        if(cell.row.values["Branch ID"]["@value"] == "main") return
        let branch=cell.row.original["Branch ID"]["@value"]
        onDelete(branch)
    }

    let onBranchClick = function(cell){
        let row = cell.row
        setReport(false)
        if(row) {
            let branchID=row.original["Branch ID"]["@value"]
            setBranchAction({branch: branchID})
            updateBranches(branchID)
        }
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Branch ID", "Commit ID", "Time", "Delete")
    tabConfig.column("Time").header("Last Commit Time").minWidth(50).width(80).renderer({type: "time"}).click(onBranchClick)
    tabConfig.column("Delete").minWidth(80).width(80).unsortable(true).click(deleteBranch).render(getDeleteButton)
    tabConfig.column("Commit ID").header("Latest Commit").click(onBranchClick)
    tabConfig.column("Branch ID").click(onBranchClick)
    tabConfig.pager("remote")
    tabConfig.pagesize(10)


    return (
        <div id={props.id} className="console__page h-100" id="terminus-console-page">
            <ConsoleNavbar onHeadChange={props.onHeadChange} />
            <BranchNavBar branchCount={branchCount} setBranchAction={setBranchAction} branchAction={branchAction} onDelete={onDelete} onOptimize={onOptimize} setReport={setReport}/>
            <main className="console__page__container console__page__container--width">
                {loading && <Loading type={TERMINUS_COMPONENT} />}
                {reportMsg  && <div className='row generic-message-holder'>
                        <TerminusDBSpeaks report={reportMsg} />
                    </div>
                }
                {branchAction.title && <ActionHeader onClose={onClose} branchAction={branchAction}/>}
                {branchAction.create && <Branch key="branch" setBranchAction={setBranchAction} setReport={setReport}/>}
                {branchAction.merge && <Merge key="merge" currentBranch={branchAction.branch} setBranchAction={setBranchAction} setReport={setReport}/>}
                {branchAction.reset && <Reset key="reset" branch={branchAction.branch} commit={branchAction.commit} onReset={onReset}/>}
                {branchAction.squash && <Squash key="squash" branch={branchAction.branch} onSquash={onSquash}/>}
                {!branchAction.branch && <ControlledTable
                    limit={tabConfig.pagesize()}
                    query={query}
                    view={tabConfig}
                />}
                {branchAction.branch && <BranchCommits selectedBranch={branchAction.branch} onReset={onReset} setBranchAction={setBranchAction}/>}
            </main>
        </div>

    )
}
