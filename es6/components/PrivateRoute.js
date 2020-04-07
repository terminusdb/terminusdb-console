"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/extends"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _reactAuth0Spa = require("../react-auth0-spa");

var PrivateRoute = function PrivateRoute(_ref) {
  var Component = _ref.component,
      path = _ref.path,
      rest = (0, _objectWithoutProperties2["default"])(_ref, ["component", "path"]);

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      isAuthenticated = _useAuth.isAuthenticated,
      loginWithRedirect = _useAuth.loginWithRedirect;

  (0, _react.useEffect)(function () {
    var fn = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (isAuthenticated) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return loginWithRedirect({
                  appState: {
                    targetUrl: path
                  }
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function fn() {
        return _ref2.apply(this, arguments);
      };
    }();

    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  var render = function render(props) {
    return isAuthenticated === true ? /*#__PURE__*/_react["default"].createElement(Component, props) : null;
  };

  return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, (0, _extends2["default"])({
    path: path,
    render: render
  }, rest));
};

PrivateRoute.propTypes = {
  component: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]).isRequired,
  path: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]).isRequired
};
var _default = PrivateRoute;
exports["default"] = _default;