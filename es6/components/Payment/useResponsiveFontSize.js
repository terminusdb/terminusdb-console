"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useResponsiveFontSize;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = require("react");

function useResponsiveFontSize() {
  var getFontSize = function getFontSize() {
    return window.innerWidth < 450 ? "16px" : "18px";
  };

  var _useState = (0, _react.useState)(getFontSize),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      fontSize = _useState2[0],
      setFontSize = _useState2[1];

  (0, _react.useEffect)(function () {
    var onResize = function onResize() {
      setFontSize(getFontSize());
    };

    window.addEventListener("resize", onResize);
    return function () {
      window.removeEventListener("resize", onResize);
    };
  });
  return fontSize;
}