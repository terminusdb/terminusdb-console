/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {
    PUSH_REMOTE_FORM,
    SYNCHRONISE_FORM,
    PUSH_LOCAL_FORM,
    PULL_LOCAL_FORM,
    PULL_REMOTE_FORM,
    DEFAULT_LOCAL_PULL_COMMIT,
    DEFAULT_LOCAL_PUSH_COMMIT,
    DEFAULT_REMOTE_PULL_COMMIT,
    DEFAULT_REMOTE_PUSH_COMMIT,
} from './constants.dbcollaborate'
import {DBContextObj} from '../../components/Query/DBContext'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'
import {PageView} from '../Templates/PageView'
import {DBRemotes, DBRemoteSummary} from "./Remote"
import {RefreshDatabaseRecord, isHubURL, Fetch, Push, Pull, addRemote} from "../../components/Query/CollaborateAPI"

export const Synchronize = () => {
    const {repos, branches, updateBranches, branch} = DBContextObj()
    if (!repos) return null

    const { getTokenSilently } = useAuth0();

    const [sourceValues, setSourceValues] = useState()
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [operation, setOperation] = useState()
    const [isRemote, setIsRemote] = useState()
    const {woqlClient, bffClient, refreshDBRecord } = WOQLClientObj()

    let update_start = Date.now()

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
    }, [repos])

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

    if (report && report.status == TERMINUS_SUCCESS) {
        return <TerminusDBSpeaks report={report} />
    }

    function showAddRemote(){
        alert("show add piece")
    }

    async function doPull(local_branch, remote_branch, remote){
        let res = await Pull(local_branch, remote.title, remote_branch, remote.url, false, woqlClient, getTokenSilently)
    }

    async function doPush(local_branch, remote_branch, remote){
        let res = await Push(local_branch, remote.title, remote_branch, remote.url, false, woqlClient, getTokenSilently)
    }

    async function doFetch(remote){
        let res = await Fetch(remote.title, woqlClient, getTokenSilently)
        //alert("fetching remote " + remote.title)
    }

    function doDelete(remote){
        alert("deleting remote " + remote.title)
    }

    async function refresh(remote){
        //if(isHubURL(remote.url)){
            let bits = remote.url.split("/")
            let meta = {id: bits[bits.length-1], organization: bits[bits.length-2]}
            RefreshDatabaseRecord(meta, bffClient, getTokenSilently).then((data) => {
                console.log("got back data", data)
                alert("got it")
            })
            .catch((e) => console.log("got error", e))
        //}
        //else {
        //    console.log("Cant refresh non hub remotes")
        //}
    }

    let meta = woqlClient.get_database()


    if (!repos || !branches) {
        return <Loading type={TERMINUS_COMPONENT} />
    }
    return (
        <PageView>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {!loading && <>                
                <DBRemoteSummary repos={repos} woqlClient={woqlClient} onCreate={showAddRemote} key="dbsum" />
                <DBRemotes 
                    meta={meta}
                    repos={repos} 
                    branch={branch} 
                    onPush={doPush}
                    onPull={doPull}
                    onFetch={doFetch}
                    onDelete={doDelete}
                    onRefresh={refresh}
                    key="dbsumy" />
            </>}
        </PageView>
    )
}


