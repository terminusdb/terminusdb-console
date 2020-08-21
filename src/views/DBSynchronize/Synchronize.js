/**
 * Controller application for synchronize page
 */
import React, {useState, useEffect} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {DBContextObj} from '../../components/Query/DBContext'
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import {PageView} from '../Templates/PageView'
import {DBRemotes} from "./DBRemotes"
import {DBRemoteSummary} from "./DBRemoteSummary"
import {RefreshDatabaseRecord, removeRemote, addRemote, isLocalURL} from "../../components/Query/CollaborateAPI"
import {AddRemote} from "./AddRemote"
import {CreateDatabase} from "../CreateDB/CreateDatabase"

export const Synchronize = () => {
    const {woqlClient, bffClient, refreshDBRecord, remoteClient } = WOQLClientObj()
    const {repos, branches, updateRepos, branch, updateBranches} = DBContextObj()
    const { getTokenSilently, loginWithRedirect } = useAuth0();

    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [operation, setOperation] = useState()
    const [meta, setMeta] = useState()
    //let meta = woqlClient.get_database()
    let user = woqlClient.user()   

    useEffect(() => {
        if(branches){
            if(meta) {
                refreshDBRecord()
                .then(() => {
                    let lmeta = woqlClient.get_database()
                    setMeta(lmeta)        
                })
            }
            else {
                setMeta(woqlClient.get_database())
            }
        }
    }, [branches])

    let update_start = Date.now()

    function isHubURL(url){
        if(remoteClient){
            return isLocalURL(url, remoteClient)             
        }
        let x = "https://hub."
        if(x == url.substring(0, x.length)) return true
        return false
    }


   
    function showAddRemote(){
        setOperation("create")
    }

    function showShareDB(){
        setOperation("share")
    }

    function unsetOperation(){
        setOperation(false)
    }

    function doDelete(remote){
        setLoading(true)
        update_start = Date.now()
        removeRemote(remote.title, woqlClient, getTokenSilently)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully removed remote ${remote.title}`,
                time: Date.now() - update_start
            }
            unsetOperation()
            updateRepos()
            setReport(newrep)
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to add remote ${remote.title}`,
                time: Date.now() - update_start,
                error: e
            }
            unsetOperation()
            setReport(newrep)
            updateRepos()
        })
        .finally(() => setLoading(false))
    }

    async function onRefresh(remote){
        let bits = remote.url.split("/")
        let hmeta = {id: bits[bits.length-1], organization: bits[bits.length-2]}
        if(isHubURL(remote.url)){
            return RefreshDatabaseRecord(hmeta, bffClient, getTokenSilently)
        }
        else if(isLocalURL(remote.url, woqlClient)){
            return refreshDBRecord(hmeta.id, hmeta.organization).then(() => woqlClient.get_database(hmeta.id, hmeta.organization))
        }
    }

    async function doAddRemote(id, url){
        setLoading(true)
        update_start = Date.now()
        addRemote(id, url, woqlClient, getTokenSilently)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully added remote ${id} and fetched from remote ${url}`,
                time: Date.now() - update_start
            }
            unsetOperation()
            updateRepos()
            setReport(newrep)
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to add remote ${id} from URL ${url}`,
                time: Date.now() - update_start,
                error: e
            }
            unsetOperation()
            setReport(newrep)
            updateRepos()
        })
        .finally(() => setLoading(false))
    }
    if(!repos || !branches || !meta ) return null
    return (
        <PageView>
            {loading && <Loading />}
            {!loading && !operation &&                 
                <DBRemoteSummary 
                    repos={repos} 
                    woqlClient={woqlClient} 
                    onCreate={showAddRemote} 
                    onShare={showShareDB} 
                    isHubURL={isHubURL}
                    onLogin={loginWithRedirect} 
                />
            }
            {report && 
                <span className="database-summary-listing">
                    <TerminusDBSpeaks report={report} />
                </span>
            }
            {!loading && !operation &&                 
                <DBRemotes 
                    woqlClient={woqlClient}
                    meta={meta}
                    user={user}
                    repos={repos} 
                    branch={branch}                     
                    onLogin={loginWithRedirect} 
                    onDelete={doDelete}
                    onRefresh={onRefresh}
                    isHubURL={isHubURL}
                    getTokenSilently={getTokenSilently}
                    branchesUpdated={updateBranches}
                />
            }
            {(operation && operation == "share") && 
                <CreateDatabase from_local={meta} />
            }
            {(operation && operation == "create") && 
               <AddRemote 
                    onCreate={doAddRemote} 
                    onCancel={unsetOperation} 
                    isHubURL={isHubURL}
                    repos={repos} 
                />
            }
        </PageView>
    )
}


