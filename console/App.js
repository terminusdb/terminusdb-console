import React from "react";
import { Router, Route, Switch, useRouteMatch } from "react-router-dom";

import TerminusClient from '@terminusdb/terminusdb-client';
import * as consoleLib from '@terminusdb/terminusdb-console';

const App = (props) => {
  const { loadingServer, clientError, woqlClient} = consoleLib.WOQLClientObj();

  if (clientError) return <consoleLib.ErrorPage/>;
  if (loadingServer) return <consoleLib.Loading/>;

  //return(<consoleLib.TestHome/>);

  return (

        <Router history={consoleLib.history}>
            <Switch>
                <Route path = "/" exact component = {consoleLib.ServerHome} />
                <Route path = "/test" exact component = {consoleLib.TestHome} />
                <Route path = "/test01" exact component = {consoleLib.TestHome01} />
                <Route path = {consoleLib.NEW_DB_PAGE.page} component = {consoleLib.CreateDatabase} />
                <Route path = {consoleLib.SERVER_HOME_PAGE.page} component = {consoleLib.ServerHome} />
                <Route path = {consoleLib.NEW_DB_PAGE.page} component = {consoleLib.CreateDatabase} />
                <Route path = {consoleLib.PROFILE_PAGE.page} component = {consoleLib.Profile} />
                <Route component={DBPages} path={consoleLib.DB_HOME_PAGE.page} />
            </Switch>
        </Router>

  );
};
//<Route path = "/" exact component = {consoleLib.ServerHome} />
//paths = /db/account/dbid/$PAGE
const DBPages = () => {
    const {setDatabase, setAccount} = consoleLib.WOQLClientObj();

    let match = useRouteMatch();
    let direction = match.params[0]
    let parts = direction.split("/")
    let page = ""
    let account = ""
    let dbid = ""

    if(parts[0] == "terminus"){
        dbid = parts[0]
        page = parts[1] || ""
    }
    else {
        account = parts[0]
        dbid = parts[1]
        page = parts[2] || ""
    }

    setDatabase(dbid)
    setAccount(account)

    const pageLink = '/' + page;

    if(pageLink  == consoleLib.SCHEMA_PAGE.page) return (
        <consoleLib.Schema />
    )
    else if(pageLink == consoleLib.DOCUMENT_PAGE.page) return (
        <consoleLib.DocumentView />
    )
    else if(pageLink == consoleLib.QUERY_PAGE.page) return (
        <consoleLib.Query />
    )
    return (
        <consoleLib.DatabaseHome/>
    )
}

export default App;
