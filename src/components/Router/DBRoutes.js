import React from "react"
import { Route, useParams, useRouteMatch, Switch} from "react-router-dom"
import { DB_QUERY_ROUTE, DB_SCHEMA_ROUTE, DB_DOCUMENT_ROUTE, SPECIFIC_DB_ROUTE, TERMINUS_ROUTE } from "../../constants/routes"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBHomeRoutes } from "./DBHomeRoutes"
import { SchemaRoutes, TerminusSchemaRoutes } from "./SchemaRoutes"
import QueryPage from "../../views/Pages/QueryPage"
import DocumentPage from "../../views/Pages/DocumentPage"
import TerminusHome from "../../views/Pages/TerminusHome"

//import {HistoryNavigatorProvider} from "../../init/history-navigator-instance"
import {DBContextProvider} from "../Query/DBContext"


export const DBRoutes = () => {
    const { woqlClient } = WOQLClientObj();

    const { path } = useRouteMatch();
    return (
        <DBContextProvider woqlClient={woqlClient}>
            <Switch>
                <Route key="terminus" path={`${path}${TERMINUS_ROUTE}`}>
                    <MasterDBRoute />
                </Route>
                <Route key="specificdb" path={`${path}${SPECIFIC_DB_ROUTE}`}>
                        <DBRoute/>
                </Route>
            </Switch>
        </DBContextProvider>
    )
}

/*
<HistoryNavigatorProvider>
    <DBRoute/>
</HistoryNavigatorProvider>
*/

/**
 * Routes specific to Terminus (master) DB 
 */
const MasterDBRoute = () => {
    const { path } = useRouteMatch();
    const {setDatabase, setAccount} = WOQLClientObj();
    setDatabase("terminus")
    setAccount(false)
    const routes = []
    routes.push(
        <Route key="query" path={`${path}${DB_QUERY_ROUTE}`}>
            <QueryPage />
        </Route>
    )
    routes.push(
        <Route key="document" path={`${path}${DB_DOCUMENT_ROUTE}`}>
            <DocumentPage />
        </Route>
    )
    routes.push(
        <Route key="terminusschema" path={`${path}${DB_SCHEMA_ROUTE}`}>
            <SchemaRoutes />
        </Route>
    )
    routes.push(
        <Route key="thp" path={`${path}`}>
            <TerminusHome key="terminushome" />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}

/**
 * Routes specific to any other specific database
 */
const DBRoute = () => {
    const { path } = useRouteMatch();

    const { aid, dbid } = useParams();
    const {setDatabase, setAccount} = WOQLClientObj();
    setDatabase(dbid)
    setAccount(aid)
    const routes = []
    routes.push(
        <Route key="dbquery" path={`${path}${DB_QUERY_ROUTE}`}>
            <QueryPage />
        </Route>
    )
    routes.push(
        <Route key="dbdoc" path={`${path}${DB_DOCUMENT_ROUTE}`}>
            <DocumentPage />
        </Route>
    )
    routes.push(
        <Route key="dbschema" path={`${path}${DB_SCHEMA_ROUTE}`}>
            <SchemaRoutes />
        </Route>
    )
    routes.push(
        <Route key="dbhp" path={`${path}`}>
            <DBHomeRoutes key="dbhome" />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
} 
