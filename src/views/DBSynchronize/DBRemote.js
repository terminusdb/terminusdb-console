/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {Row, Col, Badge, Container} from "reactstrap"
import Loading from "../../components/Reports/Loading"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import {SynchronizeActions} from "./SynchronizeActions"
import {RemoteComparison} from "./DBDifferences"
import {RefreshDatabaseRecord, Fetch, Push, Pull, addRemote } from "../../components/Query/CollaborateAPI"
import {DBRemoteCard} from "./DBRemoteCard"
/*
    Main controller for a particular remote
    contains user reporting and main view logic
*/

export const DBRemote = ({repo, user, meta, branch, onDelete, onRefresh, onLogin, woqlClient, getTokenSilently, branchesUpdated}) => {
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [upperReport, setUpperReport] = useState()
    const [myLocal, setMyLocal] = useState(meta)
    const [myRemote, setMyRemote] = useState()

    useEffect(() => {
        if(meta.remote_url && meta.remote_url == repo.url){
            setMyRemote(meta.remote_record)
        }
        else {
            onRefresh(repo).then((upd) => setMyRemote(upd))
        }
    }, [])

    function loadRemote(meta, repo){
        if(repo.type == "remote") return false
        if(meta.remote_url && meta.remote_url == repo.url){
            return meta.remote_record
        }
        onRefresh(repo).then((upd) => setMyRemote(upd))
        return false
    }

    let update_start = Date.now()//timer for api calls

    async function onPush(local_branch, remote_branch, remote){
        setLoading(true)
        setUpperReport(false)
        setReport(false)
        return Push(local_branch, remote.title, remote_branch, remote.url, false, woqlClient, getTokenSilently)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully pushed updates to ${remote.title} ${remote_branch} from local ${local_branch}`,
                time: Date.now() - update_start
            }
            setReport(newrep)
            remoteRefresh()
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to push updates to ${remote.title} ${remote_branch} from local ${local_branch}`,
                time: Date.now() - update_start,
                error: e
            }
            setReport(newrep)
        })
        .finally(() => setLoading(false))        
    }

    async function remoteRefresh(){
        if(repo.type == "remote") return
        setLoading(true)
        setUpperReport(false)
        setReport(false)
        onRefresh(repo).then((upd) => {
            setMyRemote(upd)
            if(myLocal.remote_url && myLocal.remote_url == repo.url){
                let abc = myLocal
                abc.remote_record = upd
                setMyLocal(abc)
            }
        }).finally(() => setLoading(false))
    }

    async function repoRefresh(){
        if(branchesUpdated) branchesUpdated()
    }

    async function onPull(local_branch, remote_branch, remote){
        setLoading(true)
        setUpperReport(false)
        setReport(false)
        update_start = Date.now()
        if(remote && remote.local_status && remote.local_status == "missing"){
            let newb = await woqlClient.branch(local_branch, true)
            .catch((e) => {
                let erep = {
                    status: TERMINUS_ERROR,
                    message: `Failed to create new local branch ${local_branch} to pull to`,
                    time: Date.now() - update_start,
                    error: e
                }
                setReport(erep)
            })
        }
        let no_auth = (remote.type == "remote")
        return Pull(local_branch, remote.title, remote_branch, remote.url, false, woqlClient, getTokenSilently, no_auth)
        .then((data) => {
                let newrep = {
                    status: TERMINUS_SUCCESS,
                    message: `Successfully pulled updates from ${remote.title} ${remote_branch} to local ${local_branch}`,
                    time: Date.now() - update_start
                }
                setReport(newrep)
                repoRefresh()
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to pull updates from ${remote.title} ${remote_branch} to local ${local_branch}`,
                time: Date.now() - update_start,
                error: e
            }
            setReport(newrep)
        })
        .finally(() => setLoading(false))        
    }

    async function onFetch(remote){
        setUpperReport(false)
        setReport(false)
        setLoading(true)
        update_start = Date.now()
        let no_auth = (remote.type == "remote")
        return Fetch(remote.title, remote.url, woqlClient, getTokenSilently, no_auth)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully fetched ${remote.title} from ${remote.url}`,
                time: Date.now() - update_start
            }
            setUpperReport(newrep)
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to fetch ${remote.title} from ${remote.url}`,
                time: Date.now() - update_start,
                error: e
            }
            setUpperReport(newrep)
        })
        .finally(() => setLoading(false))        
    }

    async function remoteFetch(){
        remoteRefresh()
        onFetch(repo)
    }

    let remote_branches = (myRemote && myRemote.branches ? myRemote.branches : [])
    let show_actions = (repo.type == "local" || (repo.type == "hub" && user.logged_in))
    let show_branches = (remote_branches.length > 0)

    let submit = false

    let doPush = onPush
    if(!myRemote){
        doPush = false
    }
    else {
        if(repo.type == "hub"){
            if(!myRemote|| !_allowed_push(myRemote.roles)){
                doPush = false
            }
            if(user.logged_in){
                //submit = function(){
                //    alert("testing")
                //}
            }
        }
        else if(repo.type == "remote"){
            doPush = false
        }
    }

    function _allowed_push(roles){
        if(roles && roles.indexOf('create') != -1) return true
        if(roles && roles.indexOf('write') != -1) return true
        return false
    }

    return (
        <Col>
            {loading && 
                <Loading type={TERMINUS_COMPONENT}/>
            }
            <Row key='xyz3' className="mydbcard">
                <DBRemoteCard 
                    onFetch={onFetch}
                    user={user}
                    onRefresh={remoteFetch}
                    onDelete={onDelete}
                    local={myLocal}
                    remote={myRemote}
                    repo={repo}
                />        
            </Row>            
            {upperReport &&
                <TerminusDBSpeaks report={upperReport} />
            } 
            {show_actions && 
                <Row key='r79' className='remote-synch-actions'>
                    <SynchronizeActions 
                        repo={repo} 
                        remote_branches={remote_branches} 
                        branches={myLocal.branches} 
                        branch={branch} 
                        onPull={onPull} 
                        onPush={doPush}
                        onSubmitUpdate={submit}
                    />
                </Row>
            }
            {report &&
                <TerminusDBSpeaks report={report} />
            } 
            {show_branches && 
                <Row key='r78' className='remote-comparison'>
                    <RemoteComparison 
                        repo={repo} 
                        local={myLocal}
                        remote={myRemote}
                        onPush={doPush} 
                        onSubmitUpdate={submit} 
                        onPull={onPull}
                    />
                </Row>
            }
        </Col>
    )
}
