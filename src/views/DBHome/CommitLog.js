import React, {useEffect, useState} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {ControlledTable} from '../Tables/ControlledTable'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'
import {RESET_BRANCH} from "../DBManage/constants.dbmanage"
import {Row, Col} from "react-bootstrap" //replaced
import {BiGitCommit, BiArrowBack} from "react-icons/bi"

export const CommitLog = ({selectedBranch, setBranchAction, getResetButton}) => {
    const {woqlClient} = WOQLClientObj()
    let {branch, branches, ref, consoleTime, prefixes, commits}=DBContextObj()

    const [query, setQuery] = useState()
    const [commit, setCommit] = useState()

    let limit = LATEST_UPDATES_LENGTH

    function getLatestTitle(){
        let tstr = ""
        if(ref && consoleTime){
            tstr += "Updates before " + printts(consoleTime, DATETIME_COMPLETE)
        }
        if(branches) {
            let bstr = ""
            if(Object.keys(branches).length > 1){
                bstr = " on " + branch + " branch"
            }
            if(tstr && bstr){
                return tstr + bstr
            }
            else if(tstr) return tstr
            else return "Latest Updates" + bstr
        }

    }

    function get_query(b, r){
        let WOQL = TerminusClient.WOQL
        let q = WOQL.query()
        if(r){
            q = WOQL.lib().commit_history(r)
        }
        else {
            q = WOQL.and(
                WOQL.lib().active_commit_id(b, false, "Active ID"),
                WOQL.lib().commit_history("v:Active ID")
            )
        }
        let woql = WOQL.select("v:Author", "v:Commit ID", "v:Message", "v:Time", q)
        return woql;
    }

    useEffect(() => {
        //if(branch){
            setQuery(get_query(branch, ref))
        //}
    }, [branch, ref, branches, commits])

    let cellClick = (cell) => {
        let cmt = {}
        cmt.id = cell.row.original["Commit ID"]["@value"]
        cmt.author = cell.row.original["Author"]["@value"]
        cmt.time = cell.row.original["Time"]["@value"]
        setCommit(cmt)
    }

    function resetBranch (cell) {
        let cmt= cell.row.original["Commit ID"]["@value"]
        let title=RESET_BRANCH + cmt
        setBranchAction({branch:branch, create:false, merge:false, reset: true, squash: false, title:title, commit: cmt})
    }

    function unsetCommit(){
        setCommit()
    }

    const tabConfig= TerminusClient.View.table();
    //tabConfig.row().click(rowClick)
    if(selectedBranch){
        tabConfig.column_order("Time", "Author", "Commit ID", "Message", "Reset")
        tabConfig.column("Reset").minWidth(80).width(80).unsortable(true).click(resetBranch).render(getResetButton)
    }
    else tabConfig.column_order("Time", "Author", "Commit ID", "Message")
    tabConfig.column("Time").width(180).renderer({type: "time"}).click(cellClick)
    tabConfig.column("Message").width(300).click(cellClick)
    tabConfig.column("Commit ID").click(cellClick)
    tabConfig.pager("remote")
    tabConfig.pagesize(limit)
    if(!query) return null
    if(commit){
        return <CommitView commit={commit} onClose={unsetCommit}/>
    }
    return (<Row className="update-list">
        <div className="sub-headings latest-update-heading">
            {getLatestTitle()}
        </div>
        <div style={{width: "100%"}}>
            <ControlledTable hook="auto" limit={limit} query={query} view={tabConfig} />
        </div>
    </Row>)
}

export const CommitView = ({commit, onClose}) => {
    const {woqlClient} = WOQLClientObj()
    const {prefixes} = DBContextObj()
    const WOQL = TerminusClient.WOQL
    function getUsing(cid){
        return woqlClient.resource("ref", cid)
    }

    function getRemovedTriplesQuery(cid){
        return WOQL.using(getUsing(cid)).removed_triple("v:Removed Subject", "v:Removed Property", "v:Removed Object")
    }

    function getRemovedQuadsQuery(cid){
        return WOQL.using(getUsing(cid)).removed_quad("v:Removed Subject", "v:Removed Property", "v:Removed Object", "v:Graph")
    }

    function getAddedTriplesQuery(cid){
        return WOQL.using(getUsing(cid)).added_triple("v:Added Subject", "v:Added Property", "v:Added Object")
    }

    function getAddedQuadsQuery(cid){
        return WOQL.using(getUsing(cid)).added_quad("v:Added Subject", "v:Added Property", "v:Added Object", "v:Graph")
    }

    const tabaConfig= TerminusClient.View.table();
    tabaConfig.pager("remote").pagesize(10)
    const tabbConfig= TerminusClient.View.table();
    tabbConfig.pager("remote").pagesize(10)
    const tabcConfig= TerminusClient.View.table();
    tabcConfig.pager("remote").pagesize(10)
    const tabdConfig= TerminusClient.View.table();
    tabdConfig.pager("remote").pagesize(10)
    return (<Row className="update-list">
        <CommitHeader commit={commit} onClose={onClose}/>
        <Row className="sub-headings latest-update-heading" key="addedData">
            Added Data
        </Row>
        <div style={{width: "100%"}}>
            <ControlledTable hook="auto" limit={tabaConfig.pagesize()} query={getAddedTriplesQuery(commit.id)} view={tabaConfig} />
        </div>
        <div className="sub-headings latest-update-heading" key="removedData">
            Removed Data
        </div>
        <div style={{width: "100%"}}>
            <ControlledTable hook="auto" limit={tabcConfig.pagesize()} query={getRemovedTriplesQuery(commit.id)} view={tabcConfig} />
        </div>
    </Row>)
}

export const CommitHeader = ({commit, onClose}) => {
    let dt=printts(commit.time, DATETIME_COMPLETE)
    return <Row  className='commit-log-header'>
        <Col md={11}>
            <span style={{fontSize: "2em"}}>
                <BiGitCommit className="db_info_icon_spacing" style={{marginRight: "5px"}}/>
                <span className="commit-log-title">
                    {"Commit"} {commit.id} {dt} {commit.author}
                </span>
            </span>
        </Col>
        <Col md={1}>
            <span style={{fontSize: "2em"}}>
                <span onClick={onClose} className="d-nav-icons" title={"Go back"}>
                    <BiArrowBack className="db_info_icon_spacing"/>
                </span>
            </span>
        </Col>
    </Row>


    //return <div>{`Commit ${commit.id} ${commit.time} ${commit.author}`} <button onClick={onClose}>Close</button></div>
}
