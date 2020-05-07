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

var _reactAuth0Spa = require("../../react-auth0-spa");

var _content = require("../../variables/content");

var _NavBar = _interopRequireDefault(require("../../components/NavBar"));

var _tabLabels = require("../../labels/tabLabels");

var _helperFunctions = require("../../utils/helperFunctions");

var _reactBootstrapTabs = require("react-bootstrap-tabs");

var _DatabaseDetails = _interopRequireDefault(require("./DatabaseDetails"));

var _Collaborate = _interopRequireDefault(require("./Collaborate"));

var _ManageDatabase = _interopRequireDefault(require("./ManageDatabase"));

var _queryList = require("../../utils/queryList");

var _formLabels = require("../../variables/formLabels");

var _HistoryNavigator = require("../../components/HistoryNavigator/HistoryNavigator");

var _woqlClientInstance = require("../../init/woql-client-instance");

var tag = _interopRequireWildcard(require("../../labels/tags"));

var DatabaseHome = function DatabaseHome(props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      created = _useState2[0],
      setCreated = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      commitInfo = _useState4[0],
      setCommitInfo = _useState4[1];

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      isAuthenticated = _useAuth.isAuthenticated;

  var _WOQLClientObj = (0, _woqlClientInstance.WOQLClientObj)(),
      woqlClient = _WOQLClientObj.woqlClient;

  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Container, {
    fluid: true,
    className: "h-100 pl-0 pr-0"
  }, /*#__PURE__*/_react["default"].createElement(_NavBar["default"], null), /*#__PURE__*/_react["default"].createElement(_reactstrap.Container, {
    className: "flex-grow-1"
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("legend", null, (0, _helperFunctions.getCurrentDBName)(woqlClient)), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement(_HistoryNavigator.HistoryNavigator, {
    setCreated: setCreated,
    setCommitInfo: setCommitInfo
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-5"
  }), isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tabs, null, /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.DETAILS_TAB
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement(_DatabaseDetails["default"], {
    created: created,
    commitInfo: commitInfo
  })), /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.COLLABORATE_TAB
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement(_Collaborate["default"], null)), /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.MANAGE_TAB
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement(_ManageDatabase["default"], null))), !isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tabs, null, /*#__PURE__*/_react["default"].createElement(_reactBootstrapTabs.Tab, {
    label: _tabLabels.DETAILS_TAB
  }, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement(_DatabaseDetails["default"], {
    created: created,
    commitInfo: commitInfo
  })))));
};

var _default = DatabaseHome;
exports["default"] = _default;