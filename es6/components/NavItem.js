"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.NavItems = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _pageLabels = require("../variables/pageLabels");

var _reactstrap = require("reactstrap");

var NavItems = function NavItems(props) {
  var toPage = props.to || _pageLabels.SERVER_HOME_PAGE;
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.NavLink, {
    tag: _reactRouterDom.NavLink,
    to: toPage,
    activeClassName: props.activeClassName,
    onClick: props.onClick,
    exact: true
  }, props.label));
};

exports.NavItems = NavItems;