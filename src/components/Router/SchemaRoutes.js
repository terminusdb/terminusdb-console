import React from "react"
import { Route, Switch } from "react-router-dom"
import {SCHEMA_PROPERTIES_ROUTE, SCHEMA_CLASSES_ROUTE, SCHEMA_OWL_ROUTE, SCHEMA_PREFIXES_ROUTE, SCHEMA_GRAPHS_ROUTE } from "../../constants/routes"
import SchemaPage from "../../views/Pages/SchemaPage"


export const SchemaRoutes = () => {
    let routes = []
    routes.push(
        <Route  key="properties" path={SCHEMA_PROPERTIES_ROUTE}>
            <SchemaPage page={SCHEMA_PROPERTIES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="owl" path={SCHEMA_OWL_ROUTE}>
            <SchemaPage page={SCHEMA_OWL_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="graphs" path={SCHEMA_GRAPHS_ROUTE}>
            <SchemaPage page={SCHEMA_GRAPHS_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="prefixes" path={SCHEMA_PREFIXES_ROUTE}>
            <SchemaPage page={SCHEMA_PREFIXES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route key="classes" path={SCHEMA_CLASSES_ROUTE}>
            <SchemaPage page={SCHEMA_CLASSES_ROUTE} />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}
