"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var ErrorPage = function ErrorPage() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "notfound"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    "class": "notfound"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    "class": "notfound-404"
  }, /*#__PURE__*/_react["default"].createElement("h1", null, "Oops!"), /*#__PURE__*/_react["default"].createElement("h2", null, "TerminusDB Server can't be found"))));
};

var _default = ErrorPage;
exports["default"] = _default;