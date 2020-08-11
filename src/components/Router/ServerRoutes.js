import React , {Fragment} from "react"
import { Route, Switch } from "react-router-dom"
import {SERVER_ROUTE,CREATE_DB_ROUTE,CLONE_DB_ROUTE,COLLABORATE_DB_ROUTE} from "../../constants/routes"
import ServerHome from "../../views/Pages/ServerHome"
import CollaboratePage from "../../views/Pages/CollaboratePage"
import ClonePage from "../../views/Pages/ClonePage"
import CreateDBPage from "../../views/Pages/CreateDBPage"

export const ServerRoutes = () => {
    /*let routes = []
    routes.push(<Route key="create" path={CREATE_DB_ROUTE}><ServerHome page={CREATE_DB_ROUTE} /></Route>)
    let srout = LoadServerHomePage()
    if(srout) routes.push(<Route key="home" path={SERVER_ROUTE}>{srout}</Route>)*/
    return (<Fragment>
	    		<Route path={SERVER_ROUTE} exact>
	    			<ServerHome page={ServerHome} />
	    		</Route>
	    		<Route path={CREATE_DB_ROUTE} exact>
	    			<CreateDBPage page={ServerHome} />
	    		</Route>
	    		<Route path={CLONE_DB_ROUTE} exact >
                    <ClonePage/>
                </Route>
	    		<Route path={COLLABORATE_DB_ROUTE} exact>
                    <CollaboratePage/>
                </Route>
    		</Fragment>)
}


const LoadServerHomePage = () => {
    //if(window.location.search.includes("code=")){
        //return null //reduce flicker by showing nothing on login callbacks
    //}
    return <ServerHome />
}