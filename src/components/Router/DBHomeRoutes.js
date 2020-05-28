import React, { useState } from "react"
import { Route, useRouteMatch, useLocation, Switch } from "react-router-dom"
import DatabaseHome from "../../views/Pages/DatabaseHome"
import {DB_COLLABORATE, DB_MANAGE} from "../../constants/routes"


export const DBHomeRoutes = () => {
    let { path } = useRouteMatch()
    let location = useLocation()
    let report = (location.state && location.state.report ? location.state.report : false)  
    let routes = []
    routes.push(
        <Route key="collab" path={`${path}${DB_COLLABORATE}`}>
            <DatabaseHome page={DB_COLLABORATE} report={report} />
        </Route>
    )
    routes.push(
        <Route key="manage" path={`${path}${DB_MANAGE}`}>
            <DatabaseHome page={DB_MANAGE} report={report} />
        </Route>
    )
    routes.push(
        <Route key="home" path="/">
            <DatabaseHome report={report} />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}
