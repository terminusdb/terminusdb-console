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

var _reactHookForm = require("react-hook-form");

var _reactstrap = require("reactstrap");

var _formLabels = require("../../variables/formLabels");

var _databaseHomeLabels = require("../../variables/databaseHomeLabels");

var _reactSelect = _interopRequireDefault(require("react-select"));

var _renderTypeLabels = require("../../labels/renderTypeLabels");

var _extractStrings = require("../../utils/extractStrings");

var AddUserPermissionForm = function AddUserPermissionForm(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      userInfo = _useState2[0],
      setCreateUserInfo = _useState2[1];

  var selectedUsers = [];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var onSubmit = function onSubmit(data) {
    var doc = {
      id: props.id,
      Read: data.Read,
      Write: data.Write,
      Manage: data.Manage
    };
    setCreateUserInfo(doc);
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), !loading && /*#__PURE__*/_react["default"].createElement(_reactstrap.Alert, {
    color: "success"
  }, "Successfully added new User - ", /*#__PURE__*/_react["default"].createElement("b", null, (0, _extractStrings.stripDocFromUrl)(userInfo.id))), /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/_react["default"].createElement("label", null, " ", props.name, " "), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.READ.name,
    ref: register
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.READ.name
  }), _databaseHomeLabels.READ.label), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.WRITE.name,
    ref: register
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.WRITE.name
  }), _databaseHomeLabels.WRITE.label), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.MANAGE.name,
    ref: register
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.MANAGE.name
  }), _databaseHomeLabels.MANAGE.label), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.addUser.action.className,
    type: _formLabels.addUser.action.type
  }, " Add User")))), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }));
};

var _default = AddUserPermissionForm;
exports["default"] = _default;