import React , {Fragment} from "react"
import { Route, Switch } from "react-router-dom"
import {SERVER_ROUTE,CREATE_DB_ROUTE,CLONE_DB_ROUTE,COLLABORATE_DB_ROUTE} from "../../constants/routes"
import ServerHome from "../../views/Pages/ServerHome"
import CollaboratePage from "../../views/Pages/CollaboratePage"
import ClonePage from "../../views/Pages/ClonePage"
import CreateDBPage from "../../views/Pages/CreateDBPage"
import { useAuth0 } from "../../react-auth0-spa";
import PrivateRoute from './PrivateRoute';

export const ServerRoutes = () => {
    //const { isAuthenticated} = useAuth0();

    return (<Switch>
                <Route path={SERVER_ROUTE} exact component={ServerHome} />
                <Route path={CREATE_DB_ROUTE} exact component={CreateDBPage} />
                <PrivateRoute path={CLONE_DB_ROUTE} component={ClonePage} exact/>
                <PrivateRoute path={COLLABORATE_DB_ROUTE} component={CollaboratePage} exact/>                  
    		</Switch>)
}

const testPage= ()=>{
    return <div>HELLO HELLO</div>
}

/*
        <PrivateRoute path={COLLABORATE_DB_ROUTE} component={CollaboratePage} exact/>

 <Route path={CLONE_DB_ROUTE} exact >
                    <ClonePage/>
                </Route>
                <Route path={COLLABORATE_DB_ROUTE} exact>
                    <CollaboratePage/>
                </Route>*/