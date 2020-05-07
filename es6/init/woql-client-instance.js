"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.WOQLClientProvider = exports.WOQLClientObj = exports.WOQLContext = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var WOQLContext = _react["default"].createContext();

exports.WOQLContext = WOQLContext;

var WOQLClientObj = function WOQLClientObj() {
  return (0, _react.useContext)(WOQLContext);
};

exports.WOQLClientObj = WOQLClientObj;

var WOQLClientProvider = function WOQLClientProvider(_ref) {
  var children = _ref.children,
      params = _ref.params;

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      loadingServer = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      woqlClient = _useState4[0],
      setWoqlClient = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      clientError = _useState6[0],
      setError = _useState6[1];

  var database = false;
  var account = false;
  /*
  * Important Warning Cannot update a component (`WOQLClientProvider`) while rendering a different component (`DBPages`). To locate the bad setState() call inside `DBPages`, follow the stack trace as described
  * if you do a setState outside the useEffect it can not trigger a new rendering in a different component
  */

  (0, _react.useEffect)(function () {
    var initWoqlClient = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var opts, dbClient, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = params || {};
                dbClient = new _terminusClient["default"].WOQLClient();
                _context.prev = 2;
                _context.next = 5;
                return dbClient.connect(opts);

              case 5:
                result = _context.sent;
                setWoqlClient(dbClient);
                setLoading(false);
                /*
                * we can't know when the server response will be arrive
                * if we have already set this variable we can unpdate woqlClient
                */

                if (database) setDatabase(database);
                if (account) setAccount(account);
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](2);
                setError(_context.t0);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 12]]);
      }));

      return function initWoqlClient() {
        return _ref2.apply(this, arguments);
      };
    }();

    initWoqlClient(); // eslint-disable-next-line
  }, [params]);
  /*
  * you can change the woqlCLient settings
  */

  var setAccount = function setAccount(accountName) {
    if (woqlClient) {
      woqlClient.account(accountName);
      account = woqlClient.account();
    } else {
      /*
      * I'm save the value in the variable in any case
      */
      account = accountName;
    }
  };

  var setDatabase = function setDatabase(dbName) {
    if (woqlClient) {
      woqlClient.db(dbName);
      database = woqlClient.db();
    } else {
      /*
      * I'm save the value in the variable in any case
      */
      database = dbName;
    }
  };

  return /*#__PURE__*/_react["default"].createElement(WOQLContext.Provider, {
    value: {
      loadingServer: loadingServer,
      woqlClient: woqlClient,
      clientError: clientError,
      setAccount: setAccount,
      setDatabase: setDatabase
    }
  }, children);
};

exports.WOQLClientProvider = WOQLClientProvider;