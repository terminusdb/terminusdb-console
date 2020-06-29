/**
 * Controller application for collaboration management
 */
import React, {useState, useEffect} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {MANAGE_COLLABORATORS} from './constants.dbcollaborate'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'
import {WOQLClientObj} from '../../init/woql-client-instance'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import { TERMINUS_ERROR } from '../../constants/identifiers'
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks'
import { CollaboratorList } from '../Tables/CollaboratorList'
import {DBContextObj} from '../../components/Query/DBContext'
import {AddCollaborators} from './AddCollaborators'
import {RemoveCollaborators} from './RemoveCollaborators'
import {CollaborateToolbar} from './CollaborateToolbar'
export const Collaborators = () => {
    //if the db is hosted on hub -> we show super cool stuff
    //otherwise we show a very boring and low-level capabilities management screen

    const {loading, user} = useAuth0()
    const {woqlClient} = WOQLClientObj()
    const {repos} = DBContextObj()
    const [localLoading, setLocalLoading] = useState(true)
    const [remoteLoading, setRemoteLoading] = useState()
    const [remoteClient, setRemoteClient] = useState()
    const [userList, setUserList] = useState()
    const [report, setReport] = useState()

    const [view, setView] = useState('list')

    useEffect(() => {
        if (repos && !loading) {
            if(repos.remote){
                createRemoteClient(repos.remote.url)
            }
        }
    }, [repos, loading])

    useEffect(() => {
        getLocalUsers()
    }, [])

    function addLocalUsers(results){
        let locals = {}
        for(var i = 0; i<results.bindings.length; i++){
            let bind = results.bindings[i]
            let agent_id = bind['Agent']['@value']
            if(agent_id){
                if(!locals[agent_id]){
                    locals[agent_id] = { 
                        "User ID": bind['Agent'], 
                        "User Type": "Local",
                        "Owner": "No",
                        "Manager": "No",
                        "Editor": "No",
                        "Consumer": "No",
                    }                    
                }
                if(bind['Action_ID']){
                    let short = TerminusClient.UTILS.shorten(bind['Action_ID'])
                    if( short == 'system:manage_capabilities'){
                        locals[agent_id].Manager = "Yes"
                    }
                    if(short == 'system:delete_database'){
                        locals[agent_id].Owner = "Yes"
                    }
                    if(short == 'system:clone'){
                        locals[agent_id].Consumer = "Yes"
                    }
                    if(short == 'system:push'){
                        locals[agent_id].Editor = "Yes"
                    }
                }
            }
        }
        setUserList(Object.values(locals))
    }

    function addRemoteUsers(results){
        alert("remote users: " + JSON.stringify(results))
    }

    function createRemoteClient(url){
        alert("remote client is " + url)
        const dbClient = new TerminusClient.WOQLClient(url)
        if(user){
            alert(JSON.stringify(user))
            dbClient.remote_auth({type: "jwt", key: user.token})
            getRemoteUsers(dbClient)
        }
        setRemoteClient(dbClient)
    }

    function getLocalUsers(){
        setLocalLoading(true)
        woqlClient.getRoles(false, woqlClient.db(),  woqlClient.organization())
        .then((results) => {
            addLocalUsers(results)
        })
        .catch((err) => {
            setReport({error: err, status: TERMINUS_ERROR, message: "Failed to load local user list"})
        })
        .finally(() => setLocalLoading(false))
    }

    function getRemoteUsers(dbClient){
        setRemoteLoading(true)
        dbClient.getRoles(false, woqlClient.db(), woqlClient.organization())
        .then((results) => {
            addRemoteUsers(results)
        })
        .finally(() => setRemoteLoading(false))
    }

    function setAdding(){
        setView('add')
    }

    function setRemoving(){
        setView('remove')
    }

    function executeAction(){
        alert(view)
    }
    
    function setList(){ 
        setView('list')
    }

    return (<>
        {localLoading && 
            <Loading />
        }
        {(!localLoading && report) && 
            <TerminusDBSpeaks report={report} />
        }
        {!localLoading && view == 'list' && 
            <CollaborateToolbar
                onAdd={setAdding}
                onRemove={setRemoving}
                onCancel={setList}
                onSubmit={executeAction}
                editmode={view}
            />
        }
        {(view == 'list') && 
            <CollaboratorList users={userList} />
        }
        {(view == 'add') && 
            <AddCollaborators users={userList} onCancel={setList} client={remoteClient}/>
        }
        {(view == 'remove') && 
            <RemoveCollaborators users={userList} onCancel={setList} client={remoteClient}/>
        }
    </>)
}
