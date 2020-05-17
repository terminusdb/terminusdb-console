import React from "react"
import { Route, Switch } from "react-router-dom"
import { SERVER_ROUTE, CREATE_DB_ROUTE  } from "../../constants/routes"
import ServerHome from "../../views/ServerHome/ServerHome"


export const ServerRoutes = () => {
    let routes = []
    routes.push(<Route key="create" path={CREATE_DB_ROUTE}><ServerHome page={CREATE_DB_ROUTE} /></Route>)
    routes.push(<Route key="home" path={SERVER_ROUTE}><ServerHome /></Route>)
    return (<Switch>{routes}</Switch>)
}
