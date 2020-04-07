"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Card = void 0;

var _react = _interopRequireDefault(require("react"));

var Card = function Card(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "card" + (props.plain ? " card-plain" : "")
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "header" + (props.hCenter ? " text-center" : "")
  }, /*#__PURE__*/_react["default"].createElement("legend", {
    className: "user-card-title"
  }, props.title), /*#__PURE__*/_react["default"].createElement("p", {
    className: "category"
  }, props.category)), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "content" + (props.ctAllIcons ? " all-icons" : "") + (props.ctTableFullWidth ? " table-full-width" : "") + (props.ctTableResponsive ? " table-responsive" : "") + (props.ctTableUpgrade ? " table-upgrade" : "")
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-5"
  }), props.content));
};

exports.Card = Card;