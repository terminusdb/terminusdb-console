import React , {Fragment} from "react"
import { Route, Switch, useParams } from "react-router-dom"
import {SERVER_ROUTE,SPECIFIC_DB_ROUTE, SPECIFIC_ORG_ROUTE, CREATE_DB_ROUTE,CLONE_DB_ROUTE,COLLABORATE_DB_ROUTE} from "../../constants/routes"
import ServerHome from "../../views/Pages/ServerHome"
import CollaboratePage from "../../views/Pages/CollaboratePage"
import ClonePage from "../../views/Pages/ClonePage"
import CreateDBPage from "../../views/Pages/CreateDBPage"
import { useAuth0 } from "../../react-auth0-spa";
import PrivateRoute from './PrivateRoute';

export const ServerRoutes = () => {

    return (
        <Switch>
            <Route path={SERVER_ROUTE} exact component={ServerHome} />
            <Route path={CREATE_DB_ROUTE} exact component={CreateDBPage} />
            <PrivateRoute path={CLONE_DB_ROUTE}>
                <CloneRoutes />
            </PrivateRoute>                  
            <PrivateRoute path={COLLABORATE_DB_ROUTE} component={CollaboratePage} exact/>                  
        </Switch>
    )
}

export const CloneRoutes = () => {
    return (
        <Switch>
            <Route key="specificclone" path={`${CLONE_DB_ROUTE}${SPECIFIC_DB_ROUTE}`}>
                <HubDBPage />    
            </Route>
            <Route key="orgclones" path={`${CLONE_DB_ROUTE}${SPECIFIC_ORG_ROUTE}`}>
                <HubOrgPage />    
            </Route>
            <Route key="cp">
                <ClonePage />
            </Route>
        </Switch>
    )
}

const HubDBPage= ()=>{
    const {aid, dbid} = useParams()
    return <ClonePage organization={aid} db={dbid} />
}

const HubOrgPage= ()=>{
    const {aid} = useParams()
    return <ClonePage organization={aid} />
}


