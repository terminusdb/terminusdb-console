"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Navs = void 0;

var _react = _interopRequireDefault(require("react"));

var _NavItem = require("./NavItem");

var _reactstrap = require("reactstrap");

var Navs = function Navs(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Nav, {
    className: props.className,
    navbar: true
  }, /*#__PURE__*/_react["default"].createElement(_NavItem.NavItems, {
    to: props.page,
    activeClassName: props.activeClassName,
    label: props.label
  }));
};

exports.Navs = Navs;