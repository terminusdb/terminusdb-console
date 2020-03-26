"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactstrap = require("reactstrap");

var ListGroupItemObject = function ListGroupItemObject(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Row, {
    className: "border-top border-left border-right p-4 row"
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    className: "mb-2"
  }, props.heading), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex text-box"
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      whiteSpace: "pre-line"
    }
  }, props.text)));
};

var ContentList = function ContentList(props) {
  var items = props.items || [];
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    className: "border-bottom"
  }, items.map(function (item) {
    return /*#__PURE__*/_react["default"].createElement(ListGroupItemObject, item);
  }));
};

var _default = ContentList;
exports["default"] = _default;