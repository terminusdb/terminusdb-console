import React from "react";
import {ConsoleRouter, ConsoleHistory, LoadingAppPage, ConnectionErrorPage, WOQLClientObj} from '@terminusdb/terminusdb-console';

/**
 * Loads the client and connects to the server before doing anything else
 * @param {*} props 
 */
const App = (props) => {
  const { loadingServer, clientError, woqlClient} = WOQLClientObj();

  if (clientError) return <ConnectionErrorPage/>;
  if (loadingServer) return <LoadingAppPage/>;
  
  return (
      <ConsoleRouter history={ConsoleHistory}/>
  )
}

export default App;
