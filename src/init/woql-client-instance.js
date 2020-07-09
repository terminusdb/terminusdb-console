import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {useAuth0} from '../react-auth0-spa'
import {enrich_local_db_listing} from "./repo-init-queries"

export const WOQLContext = React.createContext()
export const WOQLClientObj = () => useContext(WOQLContext)

export const WOQLClientProvider = ({children, params}) => {
    if (window.location.search.includes("code=")) return null
    const [loadingServer, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(true)
    const [woqlClient, setWoqlClient] = useState(null)
    const [remoteClient, setRemoteClient] = useState(null)
    const [bffClient, setBffClient] = useState(null)
    const [clientError, setError] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [newKeyValue, setNewKeyValue] = useState()
    const [reload, setReloadTime] = useState(0)
    const [contextEnriched, setContextEnriched ] = useState(0)
    const [localEnriched, setLocalEnriched] = useState(false)
    const [remoteEnriched, setRemoteEnriched] = useState(false)
    const { user, loading, getTokenSilently } = useAuth0();
    
    //makes the user state (id, email, etc) line up between remote and local user objects
    //this happens before the console is drawn 
    function consolidate_user_state(remote_user){
        woqlClient.connection.user.logged_in = true
        if(woqlClient.connection.author()){
            if(woqlClient.connection.author() != remote_user.email){
                woqlClient.connection.user.local_author = woqlClient.connection.author()
                woqlClient.connection.user.problem = "mismatch"
                woqlClient.author(remote_user.email)
            }
        }
        else {
            woqlClient.connection.user.problem = "missing"
            woqlClient.author(remote_user.email)
        }
    }

    useEffect(() => {
        async function setUpRemoteConnection() {
            if (user && woqlClient) {
                const jwtoken = await getTokenSilently()
                let hub_org = user['http://terminusdb.com/schema/system#agent_name']
                let hubcreds = {type: "jwt", key: jwtoken}
                woqlClient.remote_auth(hubcreds)
                const hubClient = new TerminusClient.WOQLClient(params.remote)
                hubClient.local_auth(hubcreds)
                hubClient.organization(hub_org) 
                hubClient.connection.user.id = hub_org
                hubClient.connection.user.author = user.email
                setRemoteClient(hubClient)
                const bClient = new TerminusClient.WOQLClient(params.bff)
                bClient.local_auth(hubcreds)
                bClient.organization(hub_org) 
                bClient.connection.user.id = hub_org
                bClient.connection.user.author = user.email
                setBffClient(bClient)            
            }
        }
        setUpRemoteConnection()
    }, [user, woqlClient])

    function _categorise_remote(rem){
        if(woqlClient.server() == rem.substring(woqlClient.server().length)) return "local"
        if(remoteClient.server() == rem.substring(remoteClient.server().length)) return "hub"
        return "missing"
    }

    function _matches_hub_url(rem, rem_url){
        let huburl = remoteClient.server() + rem.organization + "/" + rem.id
        return huburl == rem_url
    }


    function consolidate_database_views(remote_riches){
        woqlClient.connection.user.has_remote_roles = true
        woqlClient.connection.user.remote_roles = remote_riches.roles || false
        let locals = woqlClient.databases()
        let locals_taken = []
        let updated = []
        let remdbs = bffClient.databases();
        let remorgs = bffClient.organizations();
        if(remdbs){
            for(var j = 0; j < remdbs.length; j++){
                let found = false
                let remote = remdbs[j]
                for(var i = 0; i < locals.length; i++){
                    let local = locals[i]
                    if(local.remote && _matches_hub_url(remote, local.remote)){
                        locals_taken.push(local.id)
                        local.type = 'remote'
                        if(!local.label && remote.label) local.label = remote.label
                        if(!local.comment && remote.comment) local.comment = remote.comment
                        local.remote_record = remote
                        updated.push(local)
                        found = true
                        continue                        
                    }
                }
                if(!found){
                    let nlocal = {id: "", "organization": woqlClient.user_organization(), label: remote.label + " [*]", "comment": "Missing from local"}
                    nlocal.type = "missing"
                    nlocal.remote_record = remote
                    updated.push(nlocal)
                }
            }
        }
        for(var i = 0; i<locals.length; i++){
            if(locals_taken.indexOf(locals[i].id) == -1){
                if(locals[i].remote){
                    if(_categorise_remote(locals[i].remote) == 'local'){
                        locals[i].type = 'clone'
                    }
                    else {
                        locals[i].type = 'missing'
                    }
                }
                else {
                    locals[i].type = 'local'
                }
                updated.push(locals[i])
            }
        }
        woqlClient.connection.user.has_remote_roles = true
        woqlClient.databases(updated)
    }

    function launch_local_view(){
        woqlClient.connection.user.logged_in = false
        if(!woqlClient.connection.author()){
            woqlClient.connection.user.problem = "missing"
        }
    }

    useEffect(() => {
        if(!connecting && !loading && woqlClient){
            if(user && remoteClient){
                consolidate_user_state(user)
            } 
            else {
                launch_local_view()
            }
            setLoading(false)
        }
     }, [connecting, loading, woqlClient, remoteClient])    

     useEffect(() => {
        if(woqlClient){  
            if(woqlClient.user_databases().length) {         
                enrich_local_db_listing(woqlClient)
                .then(() => setContextEnriched(contextEnriched + 1))
                .finally(() => setLocalEnriched(true))
            }
            else setLocalEnriched(true)
        }
     }, [woqlClient])


     useEffect(() => {
        async function getRemoteListings() {
            if (bffClient) {
                const jwtoken = await getTokenSilently()
                bffClient.local_auth({type: "jwt", key: jwtoken})
                let roledata = await bffClient.getRoles(bffClient.uid())
                bffClient.connection.set_roles(roledata)
                setRemoteEnriched(roledata)
            }
        }
        getRemoteListings()
    }, [bffClient])

     useEffect(() => {
        if(remoteEnriched && localEnriched){
            consolidate_database_views(remoteEnriched)
            setContextEnriched(contextEnriched + 1)
        }
     }, [remoteEnriched, localEnriched])

     useEffect(() => {
        const initWoqlClient = async () => {
            setShowLogin(false)
            setConnecting(true)
            setError(false)

            const opts = params || {}
            const dbClient = new TerminusClient.WOQLClient(opts.server)

            if (!opts.key || opts.key === 'undefined') {
                setShowLogin(true)
            } else {
                try {
                    const result = await dbClient.connect(opts)
                    setWoqlClient(dbClient)
                    setConnecting(false)
                } catch (err) {
                    setError(err)
                }
            }
        }
        initWoqlClient()
        // eslint-disable-next-line
    }, [params,newKeyValue,reload]);

    const setKey = (key) => {
        if (params) params.key = key
        window.sessionStorage.setItem('apiKey', key)
        setNewKeyValue(key)
        setReloadTime(Date.now())
    }

    const reconnectToServer = () => {
        setLocalEnriched(false)
        return woqlClient.connect()
        .then(() => {
            if(user) {
                consolidate_user_state(user)
            }
            return enrich_local_db_listing(woqlClient)
            .then(() => setLocalEnriched(true))
        })
    }

    return (
        <WOQLContext.Provider
            value={{
                loadingServer,
                woqlClient,
                clientError,
                setKey,
                bffClient,
                showLogin,
                reconnectToServer,
                remoteClient,
                contextEnriched,
            }}
        >
            {children}
        </WOQLContext.Provider>
    )
}
