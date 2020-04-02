import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { localSettings } from "./localSettings"
import {Row,Grid} from "react-bootstrap"

import * as consoleLib from '@terminusdb/terminusdb-console';

consoleLib.initFontAwesome();

const App = (props) => {
  const { user, loading,isAuthenticated } = consoleLib.useAuth0();

  const userMETADATA= user || {};

  const fluid =  !isAuthenticated ? {} : {fluid:true}

  const pathName = window.location.pathname;
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
          <consoleLib.PrivateRoute path = {consoleLib.SCHEMA_PAGE.page} component = {consoleLib.Schema} />
          <consoleLib.PrivateRoute path = "/" component = {consoleLib.MainPage} />
        </Switch>
        {/*<Footer />*/}
    </Router>

  );
};

export default App;
