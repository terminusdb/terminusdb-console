"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Auth0Provider = exports.useAuth0 = exports.Auth0Context = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _auth0SpaJs = _interopRequireDefault(require("@auth0/auth0-spa-js"));

var DEFAULT_REDIRECT_CALLBACK = function DEFAULT_REDIRECT_CALLBACK() {
  return window.history.replaceState({}, document.title, window.location.pathname);
};

var Auth0Context = _react["default"].createContext();

exports.Auth0Context = Auth0Context;

var useAuth0 = function useAuth0() {
  return (0, _react.useContext)(Auth0Context);
};

exports.useAuth0 = useAuth0;

var Auth0Provider = function Auth0Provider(_ref) {
  var children = _ref.children,
      _ref$onRedirectCallba = _ref.onRedirectCallback,
      onRedirectCallback = _ref$onRedirectCallba === void 0 ? DEFAULT_REDIRECT_CALLBACK : _ref$onRedirectCallba,
      initOptions = (0, _objectWithoutProperties2["default"])(_ref, ["children", "onRedirectCallback"]);

  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      isAuthenticated = _useState2[0],
      setIsAuthenticated = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      user = _useState4[0],
      setUser = _useState4[1];

  var _useState5 = (0, _react.useState)(),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      auth0Client = _useState6[0],
      setAuth0 = _useState6[1];

  var _useState7 = (0, _react.useState)(true),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      popupOpen = _useState10[0],
      setPopupOpen = _useState10[1];

  (0, _react.useEffect)(function () {
    var initAuth0 = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var auth0FromHook, _yield$auth0FromHook$, appState, isAuthenticated, _user;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _auth0SpaJs["default"])(initOptions);

              case 2:
                auth0FromHook = _context.sent;
                setAuth0(auth0FromHook);

                if (!window.location.search.includes("code=")) {
                  _context.next = 10;
                  break;
                }

                _context.next = 7;
                return auth0FromHook.handleRedirectCallback();

              case 7:
                _yield$auth0FromHook$ = _context.sent;
                appState = _yield$auth0FromHook$.appState;
                onRedirectCallback(appState);

              case 10:
                _context.next = 12;
                return auth0FromHook.isAuthenticated();

              case 12:
                isAuthenticated = _context.sent;
                setIsAuthenticated(isAuthenticated);

                if (!isAuthenticated) {
                  _context.next = 19;
                  break;
                }

                _context.next = 17;
                return auth0FromHook.getUser();

              case 17:
                _user = _context.sent;
                setUser(_user);

              case 19:
                setLoading(false);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function initAuth0() {
        return _ref2.apply(this, arguments);
      };
    }();

    initAuth0(); // eslint-disable-next-line
  }, []); //

  var loginWithPopup = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var params,
          user,
          _args2 = arguments;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              params = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              setPopupOpen(true);
              _context2.prev = 2;
              _context2.next = 5;
              return auth0Client.loginWithPopup(params);

            case 5:
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](2);
              console.error(_context2.t0);

            case 10:
              _context2.prev = 10;
              setPopupOpen(false);
              return _context2.finish(10);

            case 13:
              _context2.next = 15;
              return auth0Client.getUser();

            case 15:
              user = _context2.sent;
              setUser(user);
              setIsAuthenticated(true);

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 7, 10, 13]]);
    }));

    return function loginWithPopup() {
      return _ref3.apply(this, arguments);
    };
  }();

  var handleRedirectCallback = /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var user;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              setLoading(true);
              _context3.next = 3;
              return auth0Client.handleRedirectCallback();

            case 3:
              _context3.next = 5;
              return auth0Client.getUser();

            case 5:
              user = _context3.sent;
              setLoading(false);
              setIsAuthenticated(true);
              setUser(user);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function handleRedirectCallback() {
      return _ref4.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react["default"].createElement(Auth0Context.Provider, {
    value: {
      isAuthenticated: isAuthenticated,
      user: user,
      loading: loading,
      popupOpen: popupOpen,
      loginWithPopup: loginWithPopup,
      handleRedirectCallback: handleRedirectCallback,
      getIdTokenClaims: function getIdTokenClaims() {
        return auth0Client.getIdTokenClaims.apply(auth0Client, arguments);
      },
      loginWithRedirect: function loginWithRedirect() {
        return auth0Client.loginWithRedirect.apply(auth0Client, arguments);
      },
      getTokenSilently: function getTokenSilently() {
        return auth0Client.getTokenSilently.apply(auth0Client, arguments);
      },
      getTokenWithPopup: function getTokenWithPopup() {
        return auth0Client.getTokenWithPopup.apply(auth0Client, arguments);
      },
      logout: function logout() {
        return auth0Client.logout.apply(auth0Client, arguments);
      }
    }
  }, children);
};

exports.Auth0Provider = Auth0Provider;