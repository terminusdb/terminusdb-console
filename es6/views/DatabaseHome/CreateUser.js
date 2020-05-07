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

var CreateNewUser = function CreateNewUser(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      userInfo = _useState2[0],
      setCreateUserInfo = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var onSubmit = function onSubmit(data) {
    var doc = {
      id: data.userID,
      title: data.userName,
      description: data.userDescription,
      email: data.userEmail,
      key: data.userKey,
      Read: data.Read,
      Write: data.Write,
      Manage: data.Manage
    };
    setCreateUserInfo(doc);
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, !loading && /*#__PURE__*/_react["default"].createElement(_reactstrap.Alert, {
    color: "success"
  }, "Successfully created new User - ", /*#__PURE__*/_react["default"].createElement("b", null, userInfo.id)), /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _formLabels.createUser.id.label.htmlFor
  }, _formLabels.createUser.id.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.createUser.id.input.placeholder,
    className: _formLabels.createUser.id.input.className,
    name: _formLabels.createUser.id.input.name,
    ref: register({
      validate: function validate(value) {
        return value.length > 0;
      }
    })
  }), errors.userID && /*#__PURE__*/_react["default"].createElement("p", {
    className: _formLabels.createUser.id.error.className
  }, _formLabels.createUser.id.error.text), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createUser.userName.label.className,
    htmlFor: _formLabels.createUser.userName.label.htmlFor
  }, _formLabels.createUser.userName.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.createUser.userName.input.placeholder,
    className: _formLabels.createUser.userName.input.className,
    name: _formLabels.createUser.userName.input.name,
    ref: register({
      validate: function validate(value) {
        return value.length > 0;
      }
    })
  }), errors.userName && /*#__PURE__*/_react["default"].createElement("p", {
    className: _formLabels.createUser.userName.error.className
  }, _formLabels.createUser.userName.error.text), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createUser.userEmail.label.className,
    htmlFor: _formLabels.createUser.userEmail.label.htmlFor
  }, _formLabels.createUser.userEmail.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.createUser.userEmail.input.placeholder,
    className: _formLabels.createUser.userEmail.input.className,
    name: _formLabels.createUser.userEmail.input.name,
    ref: register
  }), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createUser.userDescription.label.className,
    htmlFor: _formLabels.createUser.userDescription.label.htmlFor
  }, _formLabels.createUser.userDescription.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.createUser.userDescription.input.placeholder,
    className: _formLabels.createUser.userDescription.input.className,
    name: _formLabels.createUser.userDescription.input.name,
    ref: register
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.READ.name,
    ref: register
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
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
    md: 4,
    className: "mb-4"
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
    md: 4,
    className: "mb-4"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.MANAGE.name
  }), _databaseHomeLabels.MANAGE.label)), /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.createUser.action.className,
    type: _formLabels.createUser.action.type
  }, _formLabels.createUser.action.text)), " ");
};

var _default = CreateNewUser;
exports["default"] = _default;