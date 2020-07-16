import React from 'react'
import {Route, useParams, useRouteMatch, Switch} from 'react-router-dom'
import {
    DB_QUERY_ROUTE,
    DB_SCHEMA_ROUTE,
    DB_DOCUMENT_ROUTE,
    SPECIFIC_DB_ROUTE,
    TERMINUS_ROUTE,
} from '../../constants/routes'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBHomeRoutes} from './DBHomeRoutes'
import {SchemaRoutes} from './SchemaRoutes'
import QueryPage from '../../views/Pages/QueryPage'
import DocumentPage from '../../views/Pages/DocumentPage'
import TerminusHome from '../../views/Pages/TerminusHome'
import {DBContextProvider} from '../Query/DBContext'

export const DBRoutes = () => {
    const {woqlClient} = WOQLClientObj()

    const {path} = useRouteMatch()
    return (
        <Switch>
            <Route key="terminus" path={`${path}${TERMINUS_ROUTE}`}>
                <MasterDBRoute />
            </Route>
            <Route key="specificdb" path={`${path}${SPECIFIC_DB_ROUTE}`}>
                <DBRoute />
            </Route>
        </Switch>
    )
}

/**
 * Routes specific to Terminus (master) DB
 */
const MasterDBRoute = () => {
    const {path} = useRouteMatch()
    const {woqlClient} = WOQLClientObj()
    woqlClient.set_system_db()
    const routes = []
    routes.push(
        <Route key="query" path={`${path}${DB_QUERY_ROUTE}`}>
            <QueryPage />
        </Route>,
    )
    routes.push(
        <Route key="document" path={`${path}${DB_DOCUMENT_ROUTE}`}>
            <DocumentPage />
        </Route>,
    )
    routes.push(
        <Route key="terminusschema" path={`${path}${DB_SCHEMA_ROUTE}`}>
            <SchemaRoutes />
        </Route>,
    )
    routes.push(
        <Route key="thp" path={`${path}`}>
            <TerminusHome key="terminushome" />
        </Route>,
    )
    return <DBContextProvider woqlClient={woqlClient}><Switch>{routes}</Switch></DBContextProvider>
}

/**
 * Routes specific to any other specific database
 */
const DBRoute = () => {
    const {path} = useRouteMatch()

    const {aid, dbid} = useParams()
    const { woqlClient } = WOQLClientObj()
    woqlClient.db(dbid)
    woqlClient.organization(aid)
    const routes = []
    routes.push(
        <Route key="dbquery" path={`${path}${DB_QUERY_ROUTE}`}>
            <QueryPage />
        </Route>,
    )
    routes.push(
        <Route key="dbdoc" path={`${path}${DB_DOCUMENT_ROUTE}`}>
            <DocumentPage />
        </Route>,
    )
    routes.push(
        <Route key="dbschema" path={`${path}${DB_SCHEMA_ROUTE}`}>
            <SchemaRoutes />
        </Route>,
    )
    routes.push(
        <Route key="dbhp" path={`${path}`}>
            <DBHomeRoutes key="dbhome" />
        </Route>,
    )
    return <DBContextProvider woqlClient={woqlClient}><Switch>{routes}</Switch></DBContextProvider>
}
