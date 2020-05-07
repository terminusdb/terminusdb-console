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

var _reactAuth0Spa = require("../react-auth0-spa");

var _reactHookForm = require("react-hook-form");

var _FormInputs = require("../components/Form/FormInputs");

var _reactstrap = require("reactstrap");

var _databaseHomeLabels = require("../variables/databaseHomeLabels");

var _helperFunctions = require("../utils/helperFunctions");

var _formLabels = require("../variables/formLabels");

var Commit = function Commit(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      userInfo = _useState2[0],
      setCreateUserInfo = _useState2[1];

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      user = _useAuth.user,
      isAuthenticated = _useAuth.isAuthenticated,
      loginWithRedirect = _useAuth.loginWithRedirect,
      logout = _useAuth.logout;

  var onSubmit = function onSubmit(data) {
    if (!user) {
      loginWithRedirect(); // authenticate
    }

    console.log('commit something');
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _formLabels.commit.act.label.htmlFor
  }, _formLabels.commit.act.label.text), /*#__PURE__*/_react["default"].createElement("textarea", {
    placeholder: _formLabels.commit.act.input.placeholder,
    className: _formLabels.commit.act.input.className,
    name: _formLabels.commit.act.input.name,
    ref: register({
      validate: function validate(value) {
        return value.length > 0;
      }
    })
  }), errors.commit && /*#__PURE__*/_react["default"].createElement("p", {
    className: _formLabels.commit.act.error.className
  }, _formLabels.commit.act.error.text)), " ");
};

var _default = Commit;
exports["default"] = _default;