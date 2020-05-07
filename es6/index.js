"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$keys = require("@babel/runtime-corejs2/core-js/object/keys");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var _exportNames = {
  Auth0Provider: true,
  useAuth0: true,
  history: true,
  PrivateRoute: true,
  Loading: true,
  ErrorPage: true,
  NavBar: true,
  Profile: true,
  ServerHome: true,
  DatabaseHome: true,
  Schema: true,
  Query: true,
  DocumentView: true,
  initFontAwesome: true,
  CreateDatabase: true,
  WOQLClientObj: true,
  WOQLClientProvider: true
};

_Object$defineProperty(exports, "Auth0Provider", {
  enumerable: true,
  get: function get() {
    return _reactAuth0Spa.Auth0Provider;
  }
});

_Object$defineProperty(exports, "useAuth0", {
  enumerable: true,
  get: function get() {
    return _reactAuth0Spa.useAuth0;
  }
});

_Object$defineProperty(exports, "history", {
  enumerable: true,
  get: function get() {
    return _history2["default"];
  }
});

_Object$defineProperty(exports, "PrivateRoute", {
  enumerable: true,
  get: function get() {
    return _PrivateRoute2["default"];
  }
});

_Object$defineProperty(exports, "Loading", {
  enumerable: true,
  get: function get() {
    return _Loading2["default"];
  }
});

_Object$defineProperty(exports, "ErrorPage", {
  enumerable: true,
  get: function get() {
    return _ErrorPage2["default"];
  }
});

_Object$defineProperty(exports, "NavBar", {
  enumerable: true,
  get: function get() {
    return _NavBar2["default"];
  }
});

_Object$defineProperty(exports, "Profile", {
  enumerable: true,
  get: function get() {
    return _Profile2["default"];
  }
});

_Object$defineProperty(exports, "ServerHome", {
  enumerable: true,
  get: function get() {
    return _ServerHome2["default"];
  }
});

_Object$defineProperty(exports, "DatabaseHome", {
  enumerable: true,
  get: function get() {
    return _DatabaseHome2["default"];
  }
});

_Object$defineProperty(exports, "Schema", {
  enumerable: true,
  get: function get() {
    return _SchemaView["default"];
  }
});

_Object$defineProperty(exports, "Query", {
  enumerable: true,
  get: function get() {
    return _QueryView["default"];
  }
});

_Object$defineProperty(exports, "DocumentView", {
  enumerable: true,
  get: function get() {
    return _DocumentView2["default"];
  }
});

_Object$defineProperty(exports, "initFontAwesome", {
  enumerable: true,
  get: function get() {
    return _initFontAwesome2["default"];
  }
});

_Object$defineProperty(exports, "CreateDatabase", {
  enumerable: true,
  get: function get() {
    return _CreateDatabaseView["default"];
  }
});

_Object$defineProperty(exports, "WOQLClientObj", {
  enumerable: true,
  get: function get() {
    return _woqlClientInstance.WOQLClientObj;
  }
});

_Object$defineProperty(exports, "WOQLClientProvider", {
  enumerable: true,
  get: function get() {
    return _woqlClientInstance.WOQLClientProvider;
  }
});

require("./index.css");

require("./css/main.css");

require("./App.css");

var _reactAuth0Spa = require("./react-auth0-spa");

var _history2 = _interopRequireDefault(require("./utils/history"));

var _PrivateRoute2 = _interopRequireDefault(require("./components/PrivateRoute"));

var _Loading2 = _interopRequireDefault(require("./components/Loading"));

var _ErrorPage2 = _interopRequireDefault(require("./components/ErrorPage"));

var _NavBar2 = _interopRequireDefault(require("./components/NavBar"));

var _Profile2 = _interopRequireDefault(require("./views/Profile"));

var _ServerHome2 = _interopRequireDefault(require("./views/ServerHome"));

var _DatabaseHome2 = _interopRequireDefault(require("./views/DatabaseHome/DatabaseHome"));

var _SchemaView = _interopRequireDefault(require("./views/Schema/SchemaView"));

var _QueryView = _interopRequireDefault(require("./views/Query/QueryView"));

var _DocumentView2 = _interopRequireDefault(require("./views/Document/DocumentView"));

var _pageLabels = require("./variables/pageLabels");

_Object$keys(_pageLabels).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pageLabels[key];
    }
  });
});

var _initFontAwesome2 = _interopRequireDefault(require("./init/initFontAwesome"));

var _CreateDatabaseView = _interopRequireDefault(require("./views/NewDatabase/CreateDatabaseView"));

var _woqlClientInstance = require("./init/woql-client-instance");
