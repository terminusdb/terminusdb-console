import React  from "react";
import {LoginPage,ConsoleRouter, ConsoleHistory, LoadingAppPage, ConnectionErrorPage, WOQLClientObj} from '@terminusdb/terminusdb-console';

/**
 * Loads the client and connects to the server before doing anything else
 * @param {*} props 
 */
const App = (props) => {
  const { showLogin, loadingServer, clientError, woqlClient} = WOQLClientObj();

  if (showLogin) return  <LoginPage/>
  if (clientError) return <ConnectionErrorPage/>;
  if (loadingServer) return <LoadingAppPage/>;
  
  return (
      <ConsoleRouter history={ConsoleHistory}/>
  )
}

export default App;
