import React from "react"
import { Route, useParams, useRouteMatch, Switch} from "react-router-dom"
import { DB_QUERY_ROUTE, DB_SCHEMA_ROUTE, DB_DOCUMENT_ROUTE, SPECIFIC_DB_ROUTE, TERMINUS_ROUTE } from "../../constants/routes"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBHomeRoutes } from "./DBHomeRoutes"
import { SchemaRoutes, TerminusSchemaRoutes } from "./SchemaRoutes"
import QueryPage from "../../views/Pages/QueryPage"
import DocumentPage from "../../views/Pages/DocumentPage"
import TerminusHome from "../../views/Pages/TerminusHome"


export const DBRoutes = () => {
    let { path } = useRouteMatch();
    let routes = []
    routes.push(
        <Route key="terminus" path={`${path}${TERMINUS_ROUTE}`}>
            <MasterDBRoute />
        </Route>
    )
    routes.push(
        <Route key="specificdb" path={`${path}${SPECIFIC_DB_ROUTE}`}>
            <DBRoute/>
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}

/**
 * Routes specific to Terminus (master) DB 
 */
const MasterDBRoute = () => {
    let { path } = useRouteMatch();
    const {setDatabase, setAccount} = WOQLClientObj();
    setDatabase("terminus")
    setAccount(false)
    let routes = []
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
            <TerminusSchemaRoutes />
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
    let { path } = useRouteMatch();

    let { aid, dbid } = useParams();
    const {setDatabase, setAccount} = WOQLClientObj();
    setDatabase(dbid)
    setAccount(aid)
    let routes = []
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
