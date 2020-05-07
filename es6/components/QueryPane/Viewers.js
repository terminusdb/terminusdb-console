"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Viewers = void 0;

var _react = _interopRequireWildcard(require("react"));

var viewLabels = _interopRequireWildcard(require("../../labels/viewLabels"));

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var Viewers = function Viewers(props) {
  var views = props.views || [];
  var setViewer = props.setViewer;
  var setRule = props.setRule;
  var view = _terminusClient["default"].View;
  var viewerPanel = [];
  views.map(function (items) {
    viewerPanel.push( /*#__PURE__*/_react["default"].createElement("button", {
      key: items,
      onClick: function onClick() {
        setViewer(items);

        switch (items) {
          case viewLabels.TABLE_VIEW:
            setRule(view.table());
            break;

          case viewLabels.GRAPH_VIEW:
            setRule(view.graph());
            break;
        }
      }
    }, items));
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "viewers"
  }, viewerPanel);
};

exports.Viewers = Viewers;