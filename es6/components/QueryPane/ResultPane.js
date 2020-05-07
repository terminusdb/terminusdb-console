"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ResultPane = void 0;

var _now = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/date/now"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var _terminusReactGraph = require("@terminusdb/terminus-react-graph");

var _terminusReactTable = require("@terminusdb/terminus-react-table");

var _helperFunctions = require("../../utils/helperFunctions");

var viewLabels = _interopRequireWildcard(require("../../labels/viewLabels"));

var ResultPane = function ResultPane(props) {
  var results = props.results || {};
  var rule = props.rule || [];
  var viewer = props.viewer || viewLabels.GRAPH_VIEW;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      graphResults = _useState2[0],
      setGraphResults = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      tableResults = _useState4[0],
      setTableResults = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      listOfColumns = _useState6[0],
      setListOfColumns = _useState6[1];

  var view = _terminusClient["default"].View;
  (0, _react.useEffect)(function () {
    switch (viewer) {
      case viewLabels.GRAPH_VIEW:
        var gv = view.graph();
        gv.height(700).width(1200);
        var g = gv.create(null);
        if ((0, _helperFunctions.isObject)(rule)) g.config = rule;
        g.setResult(results);
        setGraphResults(g);
        break;

      case viewLabels.TABLE_VIEW:
        //temp
        var columns = [{
          Header: 'Table View',
          columns: listOfColumns
        }];
        var d = results.getBindings();
        setListOfColumns((0, _terminusReactTable.FormatColumns)(results.getVariableList()));
        setTableResults(d);
        break;
    }
  }, [viewer, results, rule]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "result-pane"
  }, graphResults && viewer === viewLabels.GRAPH_VIEW && /*#__PURE__*/_react["default"].createElement(_terminusReactGraph.WoqlGraph, {
    config: graphResults.config,
    dataProvider: graphResults,
    date: (0, _now["default"])()
  }), tableResults && viewer === viewLabels.TABLE_VIEW && /*#__PURE__*/_react["default"].createElement(_terminusReactTable.WoqlTable, {
    columns: listOfColumns,
    data: tableResults
  }));
};

exports.ResultPane = ResultPane;