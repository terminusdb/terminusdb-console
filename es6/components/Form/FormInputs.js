"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.FormInputs = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

function FieldGroup(_ref) {
  var label = _ref.label,
      props = (0, _objectWithoutProperties2["default"])(_ref, ["label"]);
  return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.FormGroup, null, /*#__PURE__*/_react["default"].createElement(_reactBootstrap.ControlLabel, null, label), /*#__PURE__*/_react["default"].createElement(_reactBootstrap.FormControl, props));
}

var FormInputs = function FormInputs(props) {
  var row = [];

  for (var i = 0; i < props.ncols.length; i++) {
    row.push( /*#__PURE__*/_react["default"].createElement("div", {
      key: i,
      className: props.ncols[i]
    }, /*#__PURE__*/_react["default"].createElement(FieldGroup, props.properties[i])));
  }

  return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.Row, null, row);
};

exports.FormInputs = FormInputs;