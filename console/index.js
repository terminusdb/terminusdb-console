import React from 'react'
import ReactDOM from 'react-dom'
//import './index.css'
import App from './App'
import {Auth0Provider,history} from '@terminusdb/terminusdb-console'
//ReactDOM.render(<AppTest />, document.getElementById('root'))
import config from "./auth_config.json";

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin} //{`${window.location.origin}/download`}
    onRedirectCallback={onRedirectCallback}
  >
    <App/>
  </Auth0Provider>,
  document.getElementById("root")
);
