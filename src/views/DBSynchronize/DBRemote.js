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
    const [cmeta, setCmeta] = useState(meta)

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
        alert("refresh remote")
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

    let remote_branches = (cmeta.remote_record && cmeta.remote_record.branches ? cmeta.remote_record.branches : [])
    let show_actions = (repo.type == "local" || (repo.type == "hub" && user.logged_in))
    let show_branches = (remote_branches.length > 0)

    let submit = false

    let doPush = onPush
    if(!cmeta.remote_record){
        doPush = false
    }
    else {
        if(repo.type == "hub"){
            if(!cmeta.remote_record || !_allowed_push(cmeta.remote_record.roles)){
                doPush = false
            }
            if(user.logged_in){
                submit = function(){
                    alert("testing")
                }
            }
        }
        else if(repo.type == "remote"){
            doPush = false
        }
    }

    function _allowed_push(roles){
        if(roles.indexOf('create') != -1) return true
        if(roles.indexOf('write') != -1) return true
        return false
    }

    return (
        <Col>
            {loading && 
                <Loading />
            }
            <Row key='xyz3' className="mydbcard">
                <DBRemoteCard 
                    onFetch={onFetch}
                    user={user}
                    onRefresh={onRefresh}
                    onDelete={onDelete}
                    local={cmeta}
                    remote={cmeta.remote_record}
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
                        branches={cmeta.branches} 
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
                        local={cmeta}
                        remote={cmeta.remote_record}
                        onPush={doPush} 
                        onSubmitUpdate={submit} 
                        onPull={onPull}
                    />
                </Row>
            }
        </Col>
    )
}


    /*
    useEffect(() => {
        if (repos) {
            let rem = repos.remote || repos.local_clone
            if(!rem){
                let db = woqlClient.get_database()
                rem = {url: db.remote_url, remote: ""}
            }
            setSourceValues({
                remote_url: rem.url,
                remote: rem.title,
                operation: '',
            })
            if (repos.remote) setIsRemote(true)
            else setIsRemote(false)
        }
    }, [repos])*/

    /*

    function pushLocal(deets) {
        let from_branch = deets.local_branch || 'main'
        let commit = deets.commit || DEFAULT_LOCAL_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'main',
            message: commit,
        }
        //create copy so we don't change internal state of woqlClient inadvertently
        let nClient = woqlClient.copy()

        nClient.remote_auth( nClient.local_auth() )
        nClient.checkout(from_branch)
        setLoading(true)
        update_start = Date.now()
        nClient
            .push(push_to)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPush()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function pullLocal(deets) {
        let to_branch = deets.local_branch || 'main'
        let commit = deets.commit || DEFAULT_LOCAL_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'main',
            message: commit,
        }
        //create copy so we don't change internal state of woqlClient inadvertently
        let nClient = woqlClient.copy()
        nClient.remote_auth(nClient.local_auth())
        if (to_branch != nClient.checkout()) nClient.checkout(to_branch)
        update_start = Date.now()
        setLoading(true)
        nClient
            .pull(pull_from)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPull()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function afterPush() {
        //alert("Push was successful")
    }

    function afterPull() {
        updateBranches()
    }

    async function pushRemote(deets) {
        let from_branch = deets.local_branch || 'main'
        let commit = deets.commit || DEFAULT_REMOTE_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'main',
            message: commit,
        }
        update_start = Date.now()

        let nClient = woqlClient.copy()
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
       

        //if (deets.user && deets.password) {
        //    nClient.remote_auth({type: 'basic', key: deets.password, user: deets.user})
        //}
        nClient.checkout(from_branch)
        setLoading(true)
        nClient
            .push(push_to)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPush()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    async function pullRemote(deets) {
        let to_branch = deets.local_branch || 'main'
        let commit = deets.commit || DEFAULT_REMOTE_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'main',
            message: commit,
        }
        let nClient = woqlClient.copy()
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
 
        //if (deets.user && deets.password) {
        //    nClient.remote_auth({type: 'basic', key: deets.password, user: deets.user})
        //}
        if (to_branch != nClient.checkout()) nClient.checkout(to_branch)
        setLoading(true)
        update_start = Date.now()
        nClient
            .pull(pull_from)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPull()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }
    */
