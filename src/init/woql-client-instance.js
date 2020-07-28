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
                    setLoading(false)
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
                setLoading(false)
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
        try {
            let roledata = await bClient.getRoles(bClient.uid())
            setRemoteEnriched(roledata)
            if(roledata.databases) bClient.databases(roledata.databases) 
            if(roledata.invites) bClient.connection.user.invites = roledata.invites
            if(roledata.collaborators) bClient.connection.user.collaborators = roledata.collaborators
            if(roledata.organizations) bClient.connection.user.organizations = roledata.organizations
            setContextEnriched(contextEnriched + 1)
        }
        catch(e){
            console.log(e)
            setLoading(false)
        }
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
                    let nlocal = _copy_db_card(remote)
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

    function _copy_db_card(card){
        let ncard = {}
        for(var k in card){
            if(Array.isArray(card[k])){
                ncard[k] = []
                for(var i = 0; i<card[k].length; i++){
                    if(typeof card[k][i] == "object"){
                        ncard[k].push(_copy_db_card(card[k][i]))   
                    }
                    else {
                        ncard[k].push(card[k][i])
                    }                
                }
            }
            else if(typeof card[k] == "object"){
                ncard[k] = _copy_db_card(card[k])   
            }
            else {
                ncard[k] = card[k]
            }
        }
        return ncard
    }


    function _matches_hub_url(rem, rem_url){
        let huburl = remoteClient.server() + rem.organization + "/" + rem.id
        return huburl == rem_url
    }
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
                    console.log(meta, local)
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
