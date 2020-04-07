"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _logo = _interopRequireDefault(require("../assets/logo.svg"));

var Hero = function Hero() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "text-center hero my-5"
  }, /*#__PURE__*/_react["default"].createElement("h1", {
    className: "mb-4"
  }, "The platform for modern applications"), /*#__PURE__*/_react["default"].createElement("p", {
    className: "lead"
  }, "This library implements a way to store triple data - data that consists of a subject, predicate and an object, where object can either be some value, or a node (a string that can appear both in subject and object position)."));
};

var _default = Hero; //<!--<img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />-->

exports["default"] = _default;