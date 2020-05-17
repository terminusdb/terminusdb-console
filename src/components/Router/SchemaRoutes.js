import React from "react"
import { Route, Switch } from "react-router-dom"
import {SCHEMA_PROPERTIES_ROUTE, SCHEMA_CLASSES_ROUTE, SCHEMA_OWL_ROUTE, SCHEMA_PREFIXES_ROUTE, SCHEMA_GRAPHS_ROUTE } from "./constants"
import SchemaPage from "../../views/Schema/SchemaPage"
import TerminusSchemaPage  from "../../views/Schema/TerminusSchemaPage"


export const SchemaRoutes = () => {
    let routes = []
    routes.push(
        <Route path={SCHEMA_PROPERTIES_ROUTE}>
            <SchemaPage page={SCHEMA_PROPERTIES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_OWL_ROUTE}>
            <SchemaPage page={SCHEMA_OWL_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_GRAPHS_ROUTE}>
            <SchemaPage page={SCHEMA_GRAPHS_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_PREFIXES_ROUTE}>
            <SchemaPage page={SCHEMA_PREFIXES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_CLASSES_ROUTE}>
            <SchemaPage page={SCHEMA_CLASSES_ROUTE} />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}

export const TerminusSchemaRoutes = () => {
    let routes = []
    routes.push(
        <Route path={SCHEMA_PROPERTIES_ROUTE}>
            <TerminusSchemaPage page={SCHEMA_PROPERTIES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_OWL_ROUTE}>
            <TerminusSchemaPage page={SCHEMA_OWL_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_PROPERTIES_ROUTE}>
            <TerminusSchemaPage page={SCHEMA_PROPERTIES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_PREFIXES_ROUTE}>
            <TerminusSchemaPage page={SCHEMA_PREFIXES_ROUTE} />
        </Route>
    )
    routes.push(
        <Route path={SCHEMA_CLASSES_ROUTE}>
            <TerminusSchemaPage page={SCHEMA_CLASSES_ROUTE} />
        </Route>
    )
    return (<Switch>{routes}</Switch>)
}
