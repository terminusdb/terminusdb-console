import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Auth0Provider, ConsoleHistory} from '@terminusdb/terminusdb-console'
import config from './auth_config.json'
import {localSettings} from './localSettings'
import {WOQLClientProvider ,redirect_uri} from '@terminusdb/terminusdb-console'


const onRedirectCallback = appState => {
  console.log("___CALLBACK___",window.location.pathname)

  ConsoleHistory.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : ''
  );
};

/*
 * Wraps the entire application in a auth0 domain
 * initializes woqlClient and passes it off to the app to connect
 */
console.log("___REDIRECT__CALL__",redirect_uri);


ReactDOM.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
        audience={config.audience}
    >
      <WOQLClientProvider params={localSettings}>
          <App />
      </WOQLClientProvider>
    </Auth0Provider>,
    document.getElementById('root'),
)
