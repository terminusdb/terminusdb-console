import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {useAuth0} from '../react-auth0-spa'
import {enrich_local_db_listing, append_remote_record} from "./repo-init-queries"
export const WOQLContext = React.createContext()
export const WOQLClientObj = () => useContext(WOQLContext)

export const WOQLClientProvider = ({children, params}) => {
    //if (window.location.search.includes("code=")) return null
    const [loadingServer, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(true)
    const [woqlClient, setWoqlClient] = useState(null)
    const [remoteClient, setRemoteClient] = useState(null)
    const [bffClient, setBffClient] = useState(null)
    const [clientError, setError] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [newKeyValue, setNewKeyValue] = useState()
    const [reloadKey, setReloadTime] = useState(0)
    const [contextEnriched, setContextEnriched ] = useState(0)
    const [remoteEnriched, setRemoteEnriched] = useState(false)
    const [initComplete, setInitComplete] = useState(false)
    const { user, loading, getTokenSilently } = useAuth0();
    
    /**
     * Called on init and only if the key changes afterwards
     */
    useEffect(() => {
        const initWoqlClient = async () => {
            setShowLogin(false)
            setConnecting(true)
            setError(false)

            const opts = params || {}
            const dbClient = new TerminusClient.WOQLClient(opts.server)

            if (!opts.key || opts.key === 'undefined') {
                setShowLogin(true)
            } 
            else {
                try {
                    await dbClient.connect(opts)
                    setWoqlClient(dbClient)
                    await enrich_local_db_listing(dbClient)
                    setConnecting(false)
                } catch (err) {
                    setConnecting(false)
                }
            }
        }
        initWoqlClient()
    }, [params, newKeyValue, reloadKey]);

    useEffect(() => {
        if(!loading && !user && woqlClient){
            setLoading(false)
        }
        else if(!loading && user && woqlClient && !remoteEnriched) {
            initRemoteConnection(user)
        }
     }, [loading, user, woqlClient])    

     useEffect(() => {
        if(remoteEnriched && woqlClient){
            try {
                consolidateView(remoteEnriched)
                setLoading(false)
            }
            catch(e) {
                console.log(e)
            }
        }
     }, [remoteEnriched, woqlClient])    



     async function initRemoteConnection(remote_user) {
        const jwtoken = await getTokenSilently()
        let hub_org = user['http://terminusdb.com/schema/system#agent_name']
        let hubcreds = {type: "jwt", key: jwtoken}
        const hubClient = new TerminusClient.WOQLClient(params.remote)
        hubClient.local_auth(hubcreds)
        hubClient.organization(hub_org) 
        hubClient.connection.user.id = hub_org
        hubClient.connection.user.author = remote_user.email
        setRemoteClient(hubClient)
        const bClient = new TerminusClient.WOQLClient(params.bff)
        bClient.local_auth(hubcreds)
        bClient.organization(hub_org) 
        bClient.connection.user.id = hub_org
        bClient.connection.user.author = remote_user.email
        setBffClient(bClient)
        let roledata = await bClient.getRoles(bClient.uid())
        setRemoteEnriched(roledata)
        if(roledata.databases) bClient.databases(roledata.databases) 
        if(roledata.invites) bClient.connection.user.invites = roledata.invites
        if(roledata.collaborators) bClient.connection.user.collaborators = roledata.collaborators
        if(roledata.organizations) bClient.connection.user.organizations = roledata.organizations
    }


    const setKey = (key) => {
        if (params) params.key = key
        window.sessionStorage.setItem('apiKey', key)
        setNewKeyValue(key)
        setReloadTime(Date.now())
    }

    const consolidateView = (remotedata) => {
        woqlClient.connection.user.logged_in = user['http://terminusdb.com/schema/system#agent_name']
        if(woqlClient.connection.author()){
            if(woqlClient.connection.author() != user.email){
                woqlClient.connection.user.local_author = woqlClient.connection.author()
                woqlClient.connection.user.problem = "mismatch"
                woqlClient.author(user.email)
            }
        }
        else {
            woqlClient.connection.user.problem = "missing"
            woqlClient.author(user.email)
        }
        let locals = woqlClient.databases()
        let locals_taken = []
        let updated = []
        if(remotedata.databases){
            for(var j = 0; j < remotedata.databases.length; j++){
                let found = false
                let remote = remotedata.databases[j]
                for(var i = 0; i < locals.length; i++){
                    let local = locals[i]
                    if(local.id && local.remote_url && _matches_hub_url(remote, local.remote_url)){
                        locals_taken.push(local.id)
                        local = append_remote_record(local, remote)
                        updated.push(local)
                        found = true
                        continue                        
                    }
                }
                if(!found){
                    let nlocal = remote
                    nlocal.id = ""
                    nlocal.organization = woqlClient.user_organization()
                    nlocal.type = "missing"
                    nlocal.remote_record = remote
                    nlocal.remote_url = remoteClient.server() + remote.organization + "/" + remote.id
                    nlocal.actions = ['clone']
                    updated.push(nlocal)
                }
            }
        }
        
        for(var i = 0; i<locals.length; i++){
            if(locals_taken.indexOf(locals[i].id) == -1){                                
                updated.push(locals[i])
            }
        }
        woqlClient.databases(updated)
    }


    function _matches_hub_url(rem, rem_url){
        let huburl = remoteClient.server() + rem.organization + "/" + rem.id
        return huburl == rem_url
    }

    /*
    //makes the user state (id, email, etc) line up between remote and local user objects
    //this happens before the console is drawn 
    function consolidate_user_state(remote_user){
        woqlClient.connection.user.logging_in = remote_user['http://terminusdb.com/schema/system#agent_name']
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
        
        setUpRemoteConnection()
    }, [user, woqlClient])




    function consolidate_database_views(remote_riches){
        woqlClient.connection.user.remote_assets = true
        let locals = woqlClient.databases()
        let locals_taken = []
        let updated = []
        let remdbs = bffClient.databases();
        if(remdbs){
            for(var j = 0; j < remdbs.length; j++){
                let found = false
                let remote = remdbs[j]
                for(var i = 0; i < locals.length; i++){
                    let local = locals[i]
                    if(local.id && local.remote_url && _matches_hub_url(remote, local.remote_url)){
                        locals_taken.push(local.id)
                        local = append_remote_record(local, remote)
                        updated.push(local)
                        found = true
                        continue                        
                    }
                }
                if(!found){
                    let nlocal = {id: "", "organization": woqlClient.user_organization(), label: remote.label, "comment": remote.comment }
                    nlocal.type = "missing"
                    nlocal.remote_record = remote
                    nlocal.remote_url = remoteClient.server() + remote.organization + "/" + remote.id
                    nlocal.actions = ['clone']
                    updated.push(nlocal)
                }
            }
        }
        
        for(var i = 0; i<locals.length; i++){
            if(locals_taken.indexOf(locals[i].id) == -1){                                
                updated.push(locals[i])
            }
        }
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
        }
     }, [connecting, loading, woqlClient, remoteClient])    

     useEffect(() => {
        if(woqlClient){  
            if(woqlClient.databases().length) {    
                woqlClient.user.local_assets = true     
                enrich_local_db_listing(woqlClient)
                .then(() => {
                    setLoading(false)
                    setContextEnriched(contextEnriched + 1)
                })
                .finally(() => {
                    setLoading(false)
                    setLocalEnriched(true)}
                    )
            }else {
                setLoading(false)
                setLocalEnriched(true)
            }
        }
     }, [woqlClient])


     useEffect(() => {
        async function getRemoteListings() {
            if (bffClient) {
                const jwtoken = await getTokenSilently()
                bffClient.local_auth({type: "jwt", key: jwtoken})
                let roledata = await bffClient.getRoles(bffClient.uid())
                if(roledata.databases) bffClient.databases(roledata.databases) 
                if(roledata.invites) bffClient.connection.user.invites = roledata.invites
                if(roledata.collaborators) bffClient.connection.user.collaborators = roledata.collaborators
                if(roledata.organizations) bffClient.connection.user.organizations = roledata.organizations
                setRemoteEnriched(roledata)
            }
        }
        getRemoteListings()
    }, [bffClient])

     useEffect(() => {
        if(remoteEnriched && localEnriched){
            setInitComplete(true)
        }
     }, [remoteEnriched, localEnriched])

     useEffect(() => {
        if(initComplete){
            consolidate_database_views(remoteEnriched)
            setContextEnriched(contextEnriched + 1)
            woqlClient.connection.user.logged_in = woqlClient.connection.user.logging_in  
        }
     }, [initComplete])
     */

    /**
     * Called after clone / create to create the db card for the new db and associate it with its remote
     */
    const refreshDBRecord = (id, org, action, meta) => {
        let usings = [org + "/" + id]
        let sysClient = woqlClient.copy()
        sysClient.set_system_db()
        return TerminusClient.WOQL.lib().assets_overview(usings, sysClient)
        .then((res) =>{
            if(res[0]){
                let local = res[0]
                local.id = id
                local.organization = org
                if(action == 'clone' && meta ){
                    local = append_remote_record(local, meta)
                }
                else if (action == 'create' && meta){
                    local.label = meta.label
                    local.comment = meta.comment
                } 
                let dbs = woqlClient.databases()
                dbs.push(local)
                setContextEnriched(contextEnriched + 1)
            }
        })
    }

    const reconnectToServer = () => {
        setContextEnriched(contextEnriched + 1)        
    }

    const refreshDBListing = () => {
        setContextEnriched(contextEnriched + 1)
    }

    return (
        <WOQLContext.Provider
            value={{
                loadingServer,
                woqlClient,
                clientError,
                setKey,
                bffClient,
                refreshDBRecord,
                refreshDBListing, 
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
