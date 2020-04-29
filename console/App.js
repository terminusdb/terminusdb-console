import React from "react";
import { Router, Route, Switch, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";
import { localSettings } from "./localSettings"
import {Row,Grid} from "react-bootstrap"
import TerminusClient from '@terminusdb/terminus-client';
import * as consoleLib from '@terminusdb/terminusdb-console';


//consoleLib.initFontAwesome();

const App = (props) => {
  const terminusClient = consoleLib.setTerminusClient(localSettings);
  return (   
    <Router history={consoleLib.history}>
        <Switch>
            <Route path = "/" exact component = {consoleLib.ServerHome} />
            <consoleLib.PrivateRoute path = {consoleLib.PROFILE_PAGE.page} component = {consoleLib.Profile} />
            <Route path = {consoleLib.SERVER_HOME_PAGE.page}
              component = {consoleLib.ServerHome} />
            <Route path = {consoleLib.NEW_DB_PAGE.page}
              component = {consoleLib.CreateDatabase} />
            <Route component={DBPages} path={consoleLib.DB_HOME_PAGE.page} />
            <consoleLib.PrivateRoute path = {consoleLib.NEW_TEAM_PAGE.page} component = {consoleLib.CreateTeam} />
            <consoleLib.PrivateRoute path = "/" component = {consoleLib.MainPage} />
        </Switch>
        {/*<Footer />*/}
    </Router>
  );
};

const DBPages = () => {
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
    if(page == "schema") return (
        <consoleLib.Schema db={dbid} account={account} />
    )
    else if(page == "document") return (
        <consoleLib.DocumentView db={dbid} account={account} />
    )
    else if(page == "query") return (
        <consoleLib.Query db={dbid} account={account} />
    )
    return (
        <consoleLib.DatabaseHome db={dbid} account={account}/>
    )
}

export default App;
