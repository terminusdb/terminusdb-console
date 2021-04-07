import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {useAuth0} from '../react-auth0-spa'
import {enrich_local_db_listing, append_remote_record} from "./repo-init-queries"
import {RefreshDatabaseRecord} from "../components/Query/CollaborateAPI"
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
    /*
    * count the remote operation  
    */
    const [contextEnriched, setContextEnriched ] = useState(0)
    /*
    * the user roles data 
    */
    const [remoteEnriched, setRemoteEnriched] = useState(false)
    const [initComplete, setInitComplete] = useState(false)
    const { user, loading:auth0Loading, getTokenSilently } = useAuth0();
    
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
            TerminusClient.WOQL.client(dbClient)
            if (!opts.key || opts.key === 'undefined') {
                setShowLogin(true)
            } 
            else {
                try {
                    await dbClient.connect(opts)                   
                   // await enrich_local_db_listing(dbClient)
                    setWoqlClient(dbClient)
                    setInitComplete(true)
                    setConnecting(false)
                } catch (err) {
                    console.log("__CONNECT_ERROR__",err)
                    setError(true)
                    setConnecting(false)
                    setLoading(false)
                }
            }
        }
        initWoqlClient()
    }, //[params, newKeyValue, reloadKey]);
    [params, reloadKey]);

    useEffect(() => {
        /*
        * it will be I have to null the server/bff
        * if the auth0Status has been loaded  and the user in not logged I set the loading to false
        */
        if(!auth0Loading && !user && woqlClient){
            setLoading(false)
        }
        /*
        * if the user is logged I'll call the remote server for get extra info about the db
        */
        else if(!auth0Loading && user && woqlClient && !remoteEnriched) {
            initRemoteConnection(user)
        }
     }, [auth0Loading, user, woqlClient])    

     /*
     * after get the user's rolesData
     */
     useEffect(() => {
        if(remoteEnriched && initComplete){
            try {
                consolidateView(remoteEnriched)
                setLoading(false)
            }
            catch(e) {
                console.log(e)
                setLoading(false)
            }
        }
     }, [remoteEnriched, initComplete])    



     async function initRemoteConnection(remote_user) {
        const jwtoken = await getTokenSilently()
        //console.log(remote_user)
        let hub_org = remote_user['http://terminusdb.com/schema/system#agent_name']
        let hubcreds = {type: "jwt", key: jwtoken}
        
        const hubClient = new TerminusClient.WOQLClient(params.remote)

        hubClient.localAuth(hubcreds)
        hubClient.organization(hub_org) 
        hubClient.connection.user.id = hub_org
        hubClient.connection.user.author = remote_user.email       
        setRemoteClient(hubClient)
        const bClient = new TerminusClient.WOQLClient(params.bff)
        bClient.localAuth(hubcreds)
        bClient.organization(hub_org) 
        bClient.connection.user.id = hub_org
        bClient.connection.user.author = remote_user.email
        setBffClient(bClient)
        try {
            /*
            * get the user roles from the remote administration db
            */
            let roledata = await bClient.getRoles(bClient.uid())
            setRemoteEnriched(roledata)
            console.log("____GET___ROLE___",roledata)
            //set the remote databases information in the bclient instance
            //bclient call the bff server
            if(roledata.databases) bClient.databases(roledata.databases) 
            if(roledata.invites) bClient.connection.user.invites = roledata.invites
            if(roledata.collaborators) bClient.connection.user.collaborators = roledata.collaborators
            if(roledata.organizations) {
                bClient.connection.user.organizations = roledata.organizations
            }
            setContextEnriched(contextEnriched + 1)
        }
        catch(e){
            console.log(e)
            setLoading(false)
        }
    }

    /*
    * insert the key for the basic authorization 
    */
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
                woqlClient.connection.user.localAuthor = woqlClient.connection.author()
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
        id = id || woqlClient.db()
        org = org || woqlClient.organization()
        let usings = [org + "/" + id]
        let sysClient = woqlClient.copy()
        sysClient.setSystemDb()
        return TerminusClient.WOQL.lib().assets_overview(usings, sysClient, true)
        .then((res) =>{
            if(res[0]){
                let local = res[0]
                if (action == 'create' && meta){
                    let dbs = woqlClient.databases()
                    local.label = meta.label
                    local.comment = meta.comment
                    dbs.push(local)
                } 
                else if(action == 'clone' && meta){
                    if(!meta.roles) {
                        meta.roles = ["read"]
                        meta.updated = local.updated
                        meta.branches = local.branches
                    }
                    if(!local.label && meta.label) local.label = meta.label
                    if(!local.comment && meta.comment) local.comment = meta.comment
                    local = append_remote_record(local, meta)
                    let dbs = woqlClient.databases()
                    let nudbs = []
                    let found = false
                    for(var i = 0; i<dbs.length; i++){
                        if(dbs[i] && dbs[i].remote_record && (dbs[i].remote_record.id == meta.id) && (dbs[i].remote_record.organization == meta.organization)){
                            found = true
                            nudbs.push(local)
                        }
                        else if(dbs[i]) {
                            nudbs.push(dbs[i])
                        }
                    }
                    if(!found) nudbs.push(local)
                    woqlClient.databases(nudbs)
                }
                else if(action == 'share' && meta){
                    let dbs = woqlClient.databases()
                    let nudbs = []
                    for(var i = 0; i<dbs.length; i++){
                        if(dbs[i] && (dbs[i].id == id) && (dbs[i].organization == org)){
                            for(var k in local){
                                if(k != "organization" && k != "id"){
                                    meta[k] = local[k]
                                }
                            }
                            meta.roles = ["create"]
                            local = append_remote_record(local, meta)
                            local.label = dbs[i].label
                            local.comment = dbs[i].comment
                            nudbs.push(local)
                        }
                        else if(dbs[i]) {
                            nudbs.push(dbs[i])
                        }
                    }
                    woqlClient.databases(nudbs)
                }
                else {
                    let odb = woqlClient.databaseInfo(id, org) 
                    if(odb){
                        for(var k in local){
                            odb[k] = local[k]
                        }
                    }
                    else {
                        let xudbs = woqlClient.databases()
                        xudbs.push(local)
                        woqlClient.databases(xudbs)
                    }
                }                
                setContextEnriched(contextEnriched + 1)
            }
            return woqlClient.databaseInfo()
        })
    }

    const asset_view = async(id, org) => {
        id = id || woqlClient.db()
        org = org || woqlClient.organization()
        let usings = [org + "/" + id]
        let sysClient = woqlClient.copy()
        sysClient.setSystemDb()
        return TerminusClient.WOQL.lib().assets_overview(usings, sysClient, true)
    }

    const add_db = (meta) => {
        let dbs = woqlClient.databases()
        dbs.push(meta)
        woqlClient.databases(dbs)
    }

    const addShare = async (id, org, meta) => {
        let res = await asset_view(id, org)
        if(res && res[0]){
            let dbrec = res[0]
            if(!meta.roles) {
                meta.roles = ["create"]
            }
            dbrec.remote_url = meta.remote_url            
            dbrec = append_remote_record(dbrec, meta)
            update_db(dbrec)
            let dmeta = await RefreshDatabaseRecord(meta, bffClient, getTokenSilently)
            if(dmeta) updateRemote(dmeta)  
            else {
                alert("No refresh")
                console.log(meta)
            }
            setContextEnriched(contextEnriched + 1)
            return dbrec
        }
    }

    
    const update_db = (meta) => {
        let dbs = woqlClient.databases()
        let nudbs = []
        for(var i = 0; i<dbs.length; i++){
            if(dbs[i].id == meta.id && dbs[i].organization == meta.organization){
                nudbs.push(meta)
            }
            else {
                nudbs.push(dbs[i])
            }
        }
        woqlClient.databases(nudbs)    
    }

    const addClone = async (id, org, meta) => {
        let res = await asset_view(id, org)
        if(res && res[0]){
            let dbrec = res[0]
            if(dbrec){
                dbrec.label = meta.label || meta.remote_record.label || id
            }
            dbrec.comment = meta.comment || ""
            if(!meta.remote_record.roles) {
                meta.remote_record.roles = ["read"]
            }
            dbrec = append_remote_record(dbrec, meta.remote_record)
            add_db(dbrec)
            let dmeta = await refreshRemote(meta.remote_record.organization, meta.remote_record.id)
            return dbrec
        }
    }

    /*
    *  wrap the error in a promise resolve with the error message
    */
    const refreshRemote = async (org, id) => {
        try{
            let dmeta = await RefreshDatabaseRecord({id: id, organization: org}, bffClient, getTokenSilently)
            console.log("REFRESH_REMOTE",dmeta)
            if(dmeta) updateRemote(dmeta)  
            //setContextEnriched(contextEnriched + 1)
            return dmeta
        }catch(err){
            Promise.resolve({ status: 'rejected', reason: err });   
        }
    }

    const refreshRemoteURL = async (url) => {
        let bits = url.split("/")
        if(bits.length < 2) return false
        let org = bits[bits.length-2]
        let id = bits[bits.length-1]
        return refreshRemote(org, id)
    }

    const addRemote = async (id, org, meta) => {
        let dbs = woqlClient.databases()
        console.log()
    }

    function is_hub_remote(url, id, org){
        return (url == remoteClient.server() + org + "/" + id)
    }

    function is_hub_url(url){
        let bits = url.split("/")
        if(bits.length < 2 || !remoteClient) return false
        let cand = remoteClient.server() + bits[bits.length-2] + "/" + bits[bits.length-1]
        return (url == cand)
    }


    const updateRemote = (dmeta) => {
        if(dmeta){
            let dbs = woqlClient.databases()
            for(var i = 0; i<dbs.length; i++){
                if(dbs[i].remote_url && is_hub_remote(dbs[i].remote_url, dmeta.id, dmeta.organization)){
                    dbs[i] = append_remote_record(dbs[i], dmeta)
                }
            }
            woqlClient.databases(dbs)
        }
        return dmeta
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
                refreshRemote,
                refreshRemoteURL,
                addShare,
                refreshDBRecord,
                refreshDBListing, 
                remoteEnriched,
                showLogin,
                is_hub_url,
                reconnectToServer,
                addClone,
                remoteClient,
                contextEnriched,
            }}
        >
            {children}
        </WOQLContext.Provider>
    )
}
