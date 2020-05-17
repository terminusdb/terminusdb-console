import React from "react"
import { Route, useRouteMatch, Switch } from "react-router-dom"
import DatabaseHome from "../../views/DatabaseHome/DatabaseHome"
import {DB_COLLABORATE, DB_MANAGE} from "./constants"

export const DBHomeRoutes = () => {
    let { path } = useRouteMatch();

    let routes = []
    routes.push(
        <Route key="collab" path={`${path}${DB_COLLABORATE}`}>
            <DatabaseHome page={DB_COLLABORATE} />
        </Route>
    )
    routes.push(
        <Route key="manage" path={`${path}${DB_MANAGE}`}>
            <DatabaseHome page={DB_MANAGE} />
        </Route>
    )
    routes.push(
        <Route key="dbhomio" path="/">
            <DatabaseHome />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}
