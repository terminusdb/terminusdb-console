import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';

export const WOQLContext = React.createContext();
export const WOQLClientObj = () => useContext(WOQLContext);

export const WOQLClientProvider = ({children,params}) => {

	const [loadingServer, setLoading] = useState(true);
    const [woqlClient, setWoqlClient] = useState(null);
    const [clientError, setError] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [newKeyValue, setNewKeyValue] = useState(undefined);
    const [reload, setReloadTime] = useState(0);

    let database=false;
    let account=false;
    //let key;

        /*
        * Important Warning Cannot update a component (`WOQLClientProvider`) while rendering a different component (`DBPages`). To locate the bad setState() call inside `DBPages`, follow the stack trace as described
        * if you do a setState outside the useEffect it can not trigger a new rendering in a different component
        */

        useEffect(() => {
        const initWoqlClient = async () => {
            setShowLogin(false);
            setLoading(true);
            setError(false);

            const opts = params || {};
            const dbClient = new TerminusClient.WOQLClient();

            if(!opts.key){
                setShowLogin(true);
            }else{
                try{
                    const result = await dbClient.connect(opts);
                    setWoqlClient(dbClient);               
                    setLoading(false);
                    /*
                    * we can't know when the server response will be arrive
                    * if we have already set this variable we can unpdate woqlClient
                    */
                    if(database)setDatabase(database)
                    if(account)setAccount(account)
                }catch(err){
                    setError(err)
                }
            }
        }
        initWoqlClient();
        // eslint-disable-next-line
        }, [params,newKeyValue]);


        const setKey=(key)=>{
            if(params)params.key=key
            window.sessionStorage.setItem("apiKey", key);
            setNewKeyValue(key)
        }
        /*
        * you can change the woqlCLient settings
        */
        const setAccount =(accountName) => {
            if(woqlClient){
                woqlClient.account(accountName)
                account=woqlClient.account();
            }else{
                /*
                * I'm save the value in the variable in any case
                */
                account=accountName
            }

        };

        const reconnectServer= ()=>{
            //setReloadTime(Date.now());
        }

        const setDatabase =(dbName) => {
            if(woqlClient){
                woqlClient.db(dbName)
                database=woqlClient.db();
            }else{
            /*
            * I'm save the value in the variable in any case
            */
            database=dbName;
            }
        }

        return (
        <WOQLContext.Provider
            value={{
                loadingServer,
                woqlClient,
                clientError,
                setAccount,
                setDatabase,
                setKey,
                showLogin,
                reconnectServer
            }}
        >
            {children}
        </WOQLContext.Provider>
        )
    }
