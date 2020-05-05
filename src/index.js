//export { ChartComponent } from './ChartComponent';
import "./index.css";
import "./css/main.css"
import "./App.css";
export {Auth0Provider, useAuth0} from "./react-auth0-spa";
export history from "./utils/history";

export PrivateRoute from "./components/PrivateRoute";
export Loading from "./components/Loading";
export ErrorPage from "./components/ErrorPage";
export NavBar from "./components/NavBar";
export Profile from "./views/Profile";
export MainPage from "./views/MainPage";
export CreateTeam from "./views/CreateTeam"
export ServerHome from "./views/ServerHome"
export Collaborate from "./views/Collaborate"
export DatabaseHome from "./views/DatabaseHome/DatabaseHome"
export Schema from "./views/Schema/SchemaView"
export Query from "./views/Query/QueryView"
export DocumentView from "./views/Document/DocumentView"
export * from './variables/pageLabels'
export initFontAwesome from "./init/initFontAwesome";
export CreateDatabase from "./views/NewDatabase/CreateDatabaseView"
export {WOQLClientObj,WOQLClientProvider} from "./init/woql-client-instance"
