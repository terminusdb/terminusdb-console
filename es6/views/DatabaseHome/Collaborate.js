"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactAuth0Spa = require("../../react-auth0-spa");

var _reactHookForm = require("react-hook-form");

var _FormInputs = require("../../components/Form/FormInputs");

var _reactstrap = require("reactstrap");

var _databaseHomeLabels = require("../../variables/databaseHomeLabels");

var _formLabels = require("../../variables/formLabels");

var _fakeUserData = require("../../temp/fakeUserData");

var _iconLabels = require("../../labels/iconLabels");

var _reactBootstrapTabs = require("react-bootstrap-tabs");

var _tabLabels = require("../../labels/tabLabels");

var _CreateUser = _interopRequireDefault(require("./CreateUser"));

var _UserList = _interopRequireDefault(require("./UserList"));

var _AddUsers = _interopRequireDefault(require("./AddUsers"));

var Collaborate = function Collaborate(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      isAuthenticated = _useAuth.isAuthenticated,
      user = _useAuth.user; //junk database


  var dbStats = _databaseHomeLabels.WRITE.label;
  /*some mechanism to check if db is shared with other users based on that set users */

  var users = true;
  var managePermissions = true;
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Card, null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.collaborate.accessHeader.className,
    htmlFor: _formLabels.collaborate.accessHeader.name
  }, _formLabels.collaborate.accessHeader.label), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.READ.name,
    ref: register,
    checked: dbStats === _databaseHomeLabels.READ.name
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
    name: _databaseHomeLabels.READ.name,
    ref: register,
    checked: dbStats === _databaseHomeLabels.WRITE.name
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.WRITE.name
  }), _databaseHomeLabels.WRITE.label), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "checkbox",
    name: _databaseHomeLabels.MANAGE.name,
    ref: register,
    checked: dbStats === _databaseHomeLabels.MANAGE.name
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _databaseHomeLabels.MANAGE.name
  }), _databaseHomeLabels.MANAGE.label)), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), managePermissions && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tabs, null, /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.CURRENT_USERS
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement(_UserList["default"], null)), /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.ADD_USER
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement(_AddUsers["default"], null))), " ")));
};

var _default = Collaborate;
exports["default"] = _default;