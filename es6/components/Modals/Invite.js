"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.InviteModal = void 0;

var _react = _interopRequireDefault(require("react"));

var _FormGroups = require("../Form/FormGroups");

var _reactstrap = require("reactstrap");

var InviteModal = function InviteModal(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Modal, {
    isOpen: props.isOpen,
    toggle: props.toggle
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalHeader, {
    toggle: props.toggle
  }, "Invite Users"), /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalBody, null, "You can Invite users to access this database", /*#__PURE__*/_react["default"].createElement(_FormGroups.FormGroups, {
    type: "text",
    name: "email",
    description: "Via Email",
    input: true
  }), /*#__PURE__*/_react["default"].createElement(_FormGroups.FormGroups, {
    type: "select",
    name: "user_list",
    description: "Add Users locally",
    select: true
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalFooter, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    color: "primary",
    onClick: props.toggle
  }, "Invite"), ' '));
};

exports.InviteModal = InviteModal;