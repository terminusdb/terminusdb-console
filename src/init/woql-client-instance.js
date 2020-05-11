import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';

export const WOQLContext = React.createContext();
export const WOQLClientObj = () => useContext(WOQLContext);

export const WOQLClientProvider = ({children,params}) => {

	const [loadingServer, setLoading] = useState(true);
  const [woqlClient, setWoqlClient] = useState(null);
  const [clientError, setError] = useState(false);

  let database=false;
  let account=false;

    /*
    * Important Warning Cannot update a component (`WOQLClientProvider`) while rendering a different component (`DBPages`). To locate the bad setState() call inside `DBPages`, follow the stack trace as described
    * if you do a setState outside the useEffect it can not trigger a new rendering in a different component
    */

  	useEffect(() => {
      const initWoqlClient = async () => {
      	const opts = params || {};
      	const dbClient = new TerminusClient.WOQLClient();
      	try{
  	    	const result = await dbClient.connect(opts);
  	    	setWoqlClient(dbClient);
  	    	setLoading(false);
          /*
          * we can't know when the server response will be arrive
          * if we have already set this variable we can unpdate woqlClient
          */
          if(database)setDatabase(database);
          if(account)setAccount(account);
  	    }catch(err){
  	    	setError(err);
  	    }
      };
      initWoqlClient();
      // eslint-disable-next-line
      }, [params]);

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
    };

    return (
      <WOQLContext.Provider
        value={{
          loadingServer,
          woqlClient,
          clientError,
          setAccount,
          setDatabase}}
          >
          {children}
      </WOQLContext.Provider>
    );
}
