import React from "react";
import { Router, Route, Switch } from "react-router-dom";
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
          <consoleLib.PrivateRoute path = {consoleLib.NEW_TEAM_PAGE.page} component = {consoleLib.CreateTeam} />
          <Route path = {consoleLib.DB_HOME_PAGE.page}
              component = {consoleLib.DatabaseHome} />
          <Route path = {consoleLib.SCHEMA_PAGE.page}
              component = {consoleLib.Schema} />
          <Route path = {consoleLib.QUERY_PAGE.page}
              component = {consoleLib.Query} />
          <consoleLib.PrivateRoute path = "/" component = {consoleLib.MainPage} />
        </Switch>
        {/*<Footer />*/}
    </Router>
  );
};

export default App;
