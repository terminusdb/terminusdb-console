import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Auth0Provider, ConsoleHistory} from '@terminusdb/terminusdb-console'
import {auth0_conf} from './auth_config'
import {localSettings} from './localSettings'
import {WOQLClientProvider ,redirect_uri} from '@terminusdb/terminusdb-console'


const onRedirectCallback = appState => {
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

ReactDOM.render(
    <Auth0Provider
        domain={auth0_conf.domain}
        client_id={auth0_conf.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
        audience={auth0_conf.audience}
    >
      <WOQLClientProvider params={localSettings}>
          <App />
      </WOQLClientProvider>
    </Auth0Provider>,
    document.getElementById('root'),
)
