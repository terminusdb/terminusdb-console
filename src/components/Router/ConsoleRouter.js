import React from 'react'
import { createHashHistory } from "history"
import { ROUTER_TYPE, DB_ROUTE, PROFILE_ROUTE, SERVER_ROUTE, TERMINUS_ROUTE } from "./constants"
import { HashRouter, Switch, Route } from "react-router-dom";
import { DBRoutes } from "./DBRoutes"
import { ProfileRoutes } from "./ProfileRoutes"
import { ServerRoutes } from "./ServerRoutes"

export const ConsoleHistory = createHashHistory() 

export const ConsoleRouter = (props) => {
    function getSwitch(){
        return (
            <Switch>
                <Route path={DB_ROUTE} >
                    <DBRoutes />
                </Route>
                <Route path={PROFILE_ROUTE} >
                    <ProfileRoutes />
                </Route>
                <Route path={SERVER_ROUTE} >
                    <ServerRoutes />
                </Route>
            </Switch>
        )
    }
    return (
        <HashRouter history={props.history}>
            {getSwitch()}
        </HashRouter>
    )
}

export const goServerHome = () => {
    ConsoleHistory.replace(SERVER_ROUTE)
}

export const goDBHome = (db, aid) => {
    if(db == "terminus"){
        ConsoleHistory.push(DB_ROUTE + TERMINUS_ROUTE)
    }
    else {
        ConsoleHistory.push(`${DB_ROUTE}/${aid}/${db}`)
    }
}

