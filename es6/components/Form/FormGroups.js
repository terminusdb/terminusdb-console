"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.FormGroups = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactstrap = require("reactstrap");

var FormGroups = function FormGroups(props) {
  var select = props.select || false;
  var input = props.input || false;
  var users = ['jose', 'who']; //junk data

  return /*#__PURE__*/_react["default"].createElement(_reactstrap.FormGroup, {
    check: true,
    className: "mb-3 mt-3"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Label, {
    check: true
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.FormText, {
    color: "muted"
  }, props.description), select && /*#__PURE__*/_react["default"].createElement(_reactstrap.Input, {
    type: props.type,
    name: props.name
  }, /*#__PURE__*/_react["default"].createElement("option", null, users[0]), /*#__PURE__*/_react["default"].createElement("option", null, users[1])), input && /*#__PURE__*/_react["default"].createElement(_reactstrap.Input, {
    type: props.type,
    name: props.name
  }), props.label));
};

exports.FormGroups = FormGroups;