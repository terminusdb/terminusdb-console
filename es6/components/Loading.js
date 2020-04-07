"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _loading = _interopRequireDefault(require("../assets/loading.svg"));

var Loading = function Loading() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "spinner"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: _loading["default"],
    alt: "Loading"
  }));
};

var _default = Loading;
exports["default"] = _default;