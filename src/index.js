//export { ChartComponent } from './ChartComponent';
import "./css/index.css";
import "./css/main.css"
import "./css/App.css";
export {Auth0Provider, useAuth0} from "./react-auth0-spa";
export history from "./utils/history";
export PrivateRoute from "./components/PrivateRoute";
export Loading from "./components/Loading";
export ErrorPage from "./components/ErrorPage";
export Profile from "./views/Profile";
export ServerHome from "./views/ServerHome"
export DatabaseHome from "./views/DatabaseHome/DatabaseHome"
export Schema from "./views/Schema/SchemaView"
export Query from "./views/Query/QueryView"
export DocumentView from "./views/Document/DocumentView"
export * from './variables/pageLabels'
export {initFontLib} from "./init/initFontAwesome";
export CreateDatabase from "./views/NewDatabase/CreateDatabaseView"
export {WOQLClientObj,WOQLClientProvider} from "./init/woql-client-instance"
//export TestHome from "./views/TestHome";
//export TestHome01 from "./views/TestHome01";