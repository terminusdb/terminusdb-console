import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {useAuth0} from '../react-auth0-spa'
import {enrich_local_db_listing, append_remote_record} from "./repo-init-queries"
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
                woqlClient.connection.user.remote_id = remote_user['http://terminusdb.com/schema/system#agent_name']
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


    function _matches_hub_url(rem, rem_url){
        let huburl = remoteClient.server() + rem.organization + "/" + rem.id
        return huburl == rem_url
    }


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
                    if(local.remote_url && _matches_hub_url(remote, local.remote_url)){
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
            if(woqlClient.user_databases().length) {    
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

    /**
     * Called after clone / create to create the db card for the new db and associate it with its remote
     */
    const refreshDBRecord = (id, org, action, meta) => {
        let usings = ["/" + org + "/" + id]
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
        //setLocalEnriched(false)
        //woqlClient.user.local_assets = false     
        //return woqlClient.connect()
        //.then(() => {
        //    if(user) {
        //        consolidate_user_state(user)
        //    }
        //    return enrich_local_db_listing(woqlClient)
        //    .then(() => setLocalEnriched(true))
        //})
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
