import React from 'react'
import ReactDOM from 'react-dom'
//import './index.css'
import App from './App'
import {Auth0Provider,history} from '@terminusdb/terminusdb-console'
//ReactDOM.render(<AppTest />, document.getElementById('root'))
import config from "./auth_config.json";
import { localSettings } from "./localSettings" 
import {WOQLClientProvider} from '@terminusdb/terminusdb-console'; 

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

/*
*initialize woqlClient
*/
//WOQLClientProvider(localSettings);

ReactDOM.render(
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin} //{`${window.location.origin}/download`}
      onRedirectCallback={onRedirectCallback}
      audience={config.audience}
    > 
      <WOQLClientProvider params={localSettings} >
        <App/>
      </WOQLClientProvider>
    </Auth0Provider>,
  document.getElementById("root")
);

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
