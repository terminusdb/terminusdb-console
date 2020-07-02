import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {useAuth0} from '../react-auth0-spa'
import {enrich_local_db_listing, enrich_remote_listing} from "./repo-init-queries"

export const WOQLContext = React.createContext()
export const WOQLClientObj = () => useContext(WOQLContext)

export const WOQLClientProvider = ({children, params}) => {
    const [loadingServer, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(true)
    const [woqlClient, setWoqlClient] = useState(null)
    const [remoteClient, setRemoteClient] = useState(null)
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
                let hubcreds = {type: "jwt", key: jwtoken, user: user.nickname}
                woqlClient.remote_auth(hubcreds)
                const hubClient = new TerminusClient.WOQLClient(params.remote)
                hubClient.local_auth(hubcreds)
                hubClient.connection.user.id = user.nickname
                hubClient.author(user.email)
                setRemoteClient(hubClient)
            }
        }
        setUpRemoteConnection()
    }, [user, woqlClient])

    function consolidate_database_views(remote_riches){
        //need to merge the results of the remote call 
        //with the local view        
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
        if(remoteClient){
            enrich_remote_listing(remoteClient, woqlClient)
            .then(() => setRemoteEnriched(true))
        } 
    }, [remoteClient])
   

     useEffect(() => {
        if(remoteEnriched && localEnriched){
            consolidate_database_views(woqlClient, remoteClient)
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
