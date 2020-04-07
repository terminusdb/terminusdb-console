import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import HomeNavBar from "./components/HomeNavBar";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home_web";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";
import MainPage from "./views/MainPage";
import CreateDatabase from "./views/NewDatabase/CreateDatabaseView"
import CreateTeam from "./views/CreateTeam"
import ServerHome from "./views/ServerHome"
import Download from "./views/Download"
import DatabaseHome from "./views/DatabaseHome/DatabaseHome"
import Schema from "./views/Schema/SchemaView"
import Query from "./views/Query/QueryView"
import { setTerminusClient } from "./init/initializeGlobalState"
import { localSettings } from "./config/localSettings"
import * as labels from './variables/pageLabels'

import "./css/main.css"

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./init/initFontAwesome";
initFontAwesome();

const App = (props) => {
  const { user, loading,isAuthenticated } = useAuth0();

  const userMETADATA= user || {};

  //console.log("______userMETADATA________", user);

  if(user && user['https://terminushub/afterSignUp']){
      history.replace('/download')
  }

  if (loading) {
    return <Loading />;
  }

  const fluid =  !isAuthenticated ? {} : {fluid:true}

  const pathName = window.location.pathname;
  const dbClient = setTerminusClient(localSettings);

  return (
    <Router history={history}>
        <Switch>
          <Route path = "/" exact component = {Home} />
          <PrivateRoute path = {labels.PROFILE_PAGE.page} component = {Profile} />
          <PrivateRoute path = {labels.SERVER_HOME_PAGE.page} component = {ServerHome} />
          <PrivateRoute path = {labels.NEW_DB_PAGE.page} component = {CreateDatabase} />
          <PrivateRoute path = {labels.NEW_TEAM_PAGE.page} component = {CreateTeam} />
          <PrivateRoute path = {labels.DOWNLOAD_PAGE.page} component = {Download} />
          <PrivateRoute path = {labels.DB_HOME_PAGE.page} component = {DatabaseHome} />
          <PrivateRoute path = {labels.SCHEMA_PAGE.page} component = {Schema} />
          <PrivateRoute path = {labels.QUERY_PAGE.page} component = {Query} />
          <PrivateRoute path = "/" component = {MainPage} />
        </Switch>
        {<Footer />}
    </Router>
  );
};

/*
 <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <Container {...fluid} className="h-100">
          <Switch>
            {!isAuthenticated && <Route path="/" exact component={Home} /> }
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/newDB" component={CreateDatabase} />
            <PrivateRoute path="/newTeam" component={CreateTeam} />
            <PrivateRoute path="/" component={MainPage} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>*/

export default App;
