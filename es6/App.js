"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _reactstrap = require("reactstrap");

var _PrivateRoute = _interopRequireDefault(require("./components/PrivateRoute"));

var _Loading = _interopRequireDefault(require("./components/Loading"));

var _HomeNavBar = _interopRequireDefault(require("./components/HomeNavBar"));

var _NavBar = _interopRequireDefault(require("./components/NavBar"));

var _Footer = _interopRequireDefault(require("./components/Footer"));

var _Home_web = _interopRequireDefault(require("./views/Home_web"));

var _Profile = _interopRequireDefault(require("./views/Profile"));

var _reactAuth0Spa = require("./react-auth0-spa");

var _history = _interopRequireDefault(require("./utils/history"));

var _MainPage = _interopRequireDefault(require("./views/MainPage"));

var _CreateDatabaseView = _interopRequireDefault(require("./views/NewDatabase/CreateDatabaseView"));

var _CreateTeam = _interopRequireDefault(require("./views/CreateTeam"));

var _ServerHome = _interopRequireDefault(require("./views/ServerHome"));

var _Download = _interopRequireDefault(require("./views/Download"));

var _DatabaseHome = _interopRequireDefault(require("./views/DatabaseHome/DatabaseHome"));

var _SchemaView = _interopRequireDefault(require("./views/Schema/SchemaView"));

var _QueryView = _interopRequireDefault(require("./views/Query/QueryView"));

var _initializeGlobalState = require("./init/initializeGlobalState");

var _localSettings = require("./config/localSettings");

var labels = _interopRequireWildcard(require("./variables/pageLabels"));

require("./css/main.css");

require("./App.css");

var _initFontAwesome = _interopRequireDefault(require("./init/initFontAwesome"));

// styles
// fontawesome
(0, _initFontAwesome["default"])();

var App = function App(props) {
  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      user = _useAuth.user,
      loading = _useAuth.loading,
      isAuthenticated = _useAuth.isAuthenticated;

  var userMETADATA = user || {}; //console.log("______userMETADATA________", user);

  if (user && user['https://terminushub/afterSignUp']) {
    _history["default"].replace('/download');
  }

  if (loading) {
    return /*#__PURE__*/_react["default"].createElement(_Loading["default"], null);
  }

  var fluid = !isAuthenticated ? {} : {
    fluid: true
  };
  var pathName = window.location.pathname;
  var dbClient = (0, _initializeGlobalState.setTerminusClient)(_localSettings.localSettings);
  return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Router, {
    history: _history["default"]
  }, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
    path: "/",
    exact: true,
    component: _Home_web["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.PROFILE_PAGE.page,
    component: _Profile["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.SERVER_HOME_PAGE.page,
    component: _ServerHome["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.NEW_DB_PAGE.page,
    component: _CreateDatabaseView["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.NEW_TEAM_PAGE.page,
    component: _CreateTeam["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.DOWNLOAD_PAGE.page,
    component: _Download["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.DB_HOME_PAGE.page,
    component: _DatabaseHome["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.SCHEMA_PAGE.page,
    component: _SchemaView["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: labels.QUERY_PAGE.page,
    component: _QueryView["default"]
  }), /*#__PURE__*/_react["default"].createElement(_PrivateRoute["default"], {
    path: "/",
    component: _MainPage["default"]
  })), /*#__PURE__*/_react["default"].createElement(_Footer["default"], null));
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


var _default = App;
exports["default"] = _default;