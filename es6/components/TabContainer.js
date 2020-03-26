"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.TabContainer = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _tabLabels = require("../labels/tabLabels");

var _renderTypeLabels = require("../labels/renderTypeLabels");

var _globalStateLabels = require("../labels/globalStateLabels");

var _RenderTable = _interopRequireDefault(require("../components/RenderTable"));

var _RenderSnippet = _interopRequireDefault(require("../components/RenderSnippet"));

var _QueryHook3 = require("../hooks/QueryHook");

var _APICallsHook3 = require("../hooks/APICallsHook");

var _initializeGlobalState = require("../init/initializeGlobalState");

//import { Input } from "reactstrap";
var TabContainer = function TabContainer(props) {
  var state = props.tab || _tabLabels.CLASSES_TAB;
  var isClassTab = false,
      isPropertyTab = false,
      isOWLTab = false;
  if (props.activeTab == _tabLabels.CLASSES_TAB.state) isClassTab = true;else if (props.activeTab == _tabLabels.PROPERTIES_TAB.state) isPropertyTab = true;else if (props.activeTab == _tabLabels.OWL_TAB.state) isOWLTab = true;

  var getDataProvider = function getDataProvider() {
    if (props.activeTab === _tabLabels.OWL_TAB.state) {
      var _APICallsHook = (0, _APICallsHook3.APICallsHook)(state.command, _renderTypeLabels.RENDER_TYPE_SNIPPET),
          _APICallsHook2 = (0, _slicedToArray2["default"])(_APICallsHook, 1),
          dataCallResponse = _APICallsHook2[0];

      return dataCallResponse;
    } else {
      var _QueryHook = (0, _QueryHook3.QueryHook)(state.command, _renderTypeLabels.RENDER_TYPE_TABLE),
          _QueryHook2 = (0, _slicedToArray2["default"])(_QueryHook, 1),
          dataResponse = _QueryHook2[0];

      return dataResponse;
    }
  };

  return /*#__PURE__*/_react["default"].createElement("div", null, isClassTab && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tab-co"
  }, /*#__PURE__*/_react["default"].createElement(_RenderTable["default"], {
    dataProvider: getDataProvider()
  })), isPropertyTab && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tab-co"
  }, /*#__PURE__*/_react["default"].createElement(_RenderTable["default"], {
    dataProvider: getDataProvider()
  })), isOWLTab && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tab-co"
  }, /*#__PURE__*/_react["default"].createElement(_RenderSnippet["default"], {
    dataProvider: getDataProvider()
  })));
};

exports.TabContainer = TabContainer;