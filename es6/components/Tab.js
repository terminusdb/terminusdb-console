"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _iterator2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/symbol/iterator"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactstrap = require("reactstrap");

var _NavItem = require("./NavItem");

var _TabContainer = require("./TabContainer");

var _tabLabels = require("../labels/tabLabels");

function _createForOfIteratorHelper(o) { if (typeof _symbol["default"] === "undefined" || o[_iterator2["default"]] == null) { if ((0, _isArray["default"])(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = (0, _getIterator2["default"])(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from["default"])(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Tab = function Tab(props) {
  var _useState = (0, _react.useState)(props.defaultState),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      activeTab = _useState2[0],
      setActiveTab = _useState2[1];

  var navItems = [],
      tabPane = [],
      dbHomePane = [];
  var tabs = props.tabs || [];

  var _iterator = _createForOfIteratorHelper(tabs.entries()),
      _step;

  try {
    var _loop = function _loop() {
      var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          index = _step$value[0],
          value = _step$value[1];

      var entry = tabs[index];
      (0, _keys["default"])(entry).forEach(function (key) {
        var tState = entry[key];
        navItems.push( /*#__PURE__*/_react["default"].createElement(_NavItem.NavItems, {
          activeClassName: activeTab == tState.state ? 'active' : '',
          onClick: function onClick() {
            return setActiveTab(tState.state);
          },
          label: tState.label
        }));
        if (props["for"] == _tabLabels.SCHEMA_TABS) tabPane.push( /*#__PURE__*/_react["default"].createElement(_reactstrap.TabPane, {
          tabId: tState.state
        }, /*#__PURE__*/_react["default"].createElement(_TabContainer.TabContainer, {
          tab: tState,
          activeTab: activeTab
        })));
      });
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-3"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.Nav, {
    tabs: true
  }, navItems), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-3"
  }), tabPane && /*#__PURE__*/_react["default"].createElement(_reactstrap.TabContent, {
    activeTab: activeTab
  }, tabPane));
};

var _default = Tab;
exports["default"] = _default;