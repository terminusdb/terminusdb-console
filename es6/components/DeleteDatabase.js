"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactstrap = require("reactstrap");

var _content = require("../variables/content");

var DeleteDatabaseModal = function DeleteDatabaseModal(props) {
  var className = props.className;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      modal = _useState2[0],
      setModal = _useState2[1];

  var toggle = function toggle() {
    return setModal(!modal);
  };

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    color: "danger",
    onClick: toggle
  }, _content.deleteDatabaseLabels.title), /*#__PURE__*/_react["default"].createElement(_reactstrap.Modal, {
    isOpen: modal,
    toggle: toggle,
    className: className
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalHeader, {
    toggle: toggle
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalBody, null, /*#__PURE__*/_react["default"].createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."), /*#__PURE__*/_react["default"].createElement(Form, null, /*#__PURE__*/_react["default"].createElement(Row, {
    form: true,
    className: "mt-4"
  }, /*#__PURE__*/_react["default"].createElement(Col, {
    md: 8
  }, /*#__PURE__*/_react["default"].createElement(FormGroup, null, /*#__PURE__*/_react["default"].createElement(FormText, null, _content.deleteDatabaseLabels.confirmText), /*#__PURE__*/_react["default"].createElement(Input, {
    type: "text",
    name: "dbname",
    id: "dbname"
  })))))), /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalFooter, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    color: "primary",
    onClick: toggle
  }, "Delete Database"), ' ', /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    color: "secondary",
    onClick: toggle
  }, "Cancel"))));
};

var _default = DeleteDatabaseModal;
exports["default"] = _default;