"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.CustomButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/extends"));

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var CustomButton = function CustomButton(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.Button, (0, _extends2["default"])({
    className: props.btnClasses
  }, props.buttonName));
};

exports.CustomButton = CustomButton;