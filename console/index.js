import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Auth0Provider, ConsoleHistory} from '@terminusdb/terminusdb-console'
import config from "./auth_config.json"
import { localSettings } from "./localSettings" 
import {WOQLClientProvider} from '@terminusdb/terminusdb-console'

const onRedirectCallback = appState => {
   ConsoleHistory.go(-2)
}

/*
* Wraps the entire application in a auth0 domain
* initializes woqlClient and passes it off to the app to connect
*/
console.log("PATH_NAME",window.location.origin + window.location.pathname);
ReactDOM.render(
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin + window.location.pathname} //{`${window.location.origin}/download`}
      onRedirectCallback={onRedirectCallback}
      audience={config.audience}
    > 
        <WOQLClientProvider params={localSettings} >
            <App/>
        </WOQLClientProvider>
    </Auth0Provider>,
    document.getElementById("root")
)

/*
<Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin} //{`${window.location.origin}/download`}
      onRedirectCallback={onRedirectCallback}
      audience={config.audience}
    > 
    <App/>
   </Auth0Provider>*/
