import React from "react"
import { Route, Switch } from "react-router-dom"
import { SERVER_ROUTE, CREATE_DB_ROUTE  } from "../../constants/routes"
import ServerHome from "../../views/Pages/ServerHome"

export const ServerRoutes = () => {
    let routes = []
    routes.push(<Route key="create" path={CREATE_DB_ROUTE}><ServerHome page={CREATE_DB_ROUTE} /></Route>)
    let srout = LoadServerHomePage()
    if(srout) routes.push(<Route key="home" path={SERVER_ROUTE}>{srout}</Route>)
    return (<Switch>{routes}</Switch>)
}


const LoadServerHomePage = () => {
    if(window.location.search.includes("code=")){
        return null //reduce flicker by showing nothing on login callbacks
    }
    return <ServerHome />
}