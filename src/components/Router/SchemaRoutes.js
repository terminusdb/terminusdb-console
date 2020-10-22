import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import {SCHEMA_PROPERTIES_ROUTE, 
        SCHEMA_CLASSES_ROUTE, 
        SCHEMA_OWL_ROUTE,
        DB_SCHEMA_ROUTE,
        SCHEMA_PREFIXES_ROUTE, 
        SCHEMA_GRAPHS_ROUTE,
        SCHEMA_MODEL_ROUTE } from "../../constants/routes"
import SchemaPage from "../../views/Pages/SchemaPage"
import {ModelBuilder} from "../../views/Pages/ModelBuilder"


export const SchemaRoutes = () => {

    const {path} = useRouteMatch()

    console.log("SCHEMA_ROUTERS",path)
    let routes = []

    routes.push(
        <Route  key="properties" path={`${path}${SCHEMA_PROPERTIES_ROUTE}`}>
            <SchemaPage page={SCHEMA_PROPERTIES_ROUTE} />           
        </Route>
    )
    routes.push(
        <Route key="owl" path={`${path}${SCHEMA_OWL_ROUTE}`}>
            <SchemaPage page={SCHEMA_OWL_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="graphs" path={`${path}${SCHEMA_GRAPHS_ROUTE}`}>
            <SchemaPage page={SCHEMA_GRAPHS_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="prefixes" path={`${path}${SCHEMA_PREFIXES_ROUTE}`}>
            <SchemaPage page={SCHEMA_PREFIXES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="classes" path={`${path}${SCHEMA_CLASSES_ROUTE}`}>
            <SchemaPage page={SCHEMA_CLASSES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="schema_build" path={`${path}${SCHEMA_MODEL_ROUTE}`}>
           <ModelBuilder/>
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}
