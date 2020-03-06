//export { ChartComponent } from './ChartComponent';
import "./index.css";
import "./css/main.css"
import "./App.css";
export {Auth0Provider} from "./react-auth0-spa";
export history from "./utils/history";

export PrivateRoute from "./components/PrivateRoute";
export Loading from "./components/Loading";
export NavBar from "./components/NavBar";
export Profile from "./views/Profile";
export { useAuth0 } from "./react-auth0-spa";
export MainPage from "./views/MainPage";
export CreateTeam from "./views/CreateTeam"
export ServerHome from "./views/ServerHome"
export Collaborate from "./views/Collaborate"
export DatabaseHome from "./views/DatabaseHome/DatabaseHome"
export Schema from "./views/Schema/SchemaHome"
export { setTerminusClient } from "./init/initializeGlobalState"
export { localSettings } from "./config/localSettings"
export * from './variables/pageLabels'
export initFontAwesome from "./init/initFontAwesome";
export CreateDatabase from "./views/NewDatabase/CreateDatabase"



/*import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
//import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";

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
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
//// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
