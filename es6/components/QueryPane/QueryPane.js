"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.QueryPane = void 0;

var _now = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/date/now"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _helperFunctions = require("../../utils/helperFunctions");

var _format = require("../../utils/format");

var lang = _interopRequireWildcard(require("../../labels/queryFormats"));

var tag = _interopRequireWildcard(require("../../labels/tags"));

var viewLabels = _interopRequireWildcard(require("../../labels/viewLabels"));

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var _Editor = require("./Editor");

var _ActionButton = require("./ActionButton");

var _Library = require("./Library");

var _PrintLanguage = require("./PrintLanguage");

var _ResultPane = require("./ResultPane");

var _Viewers = require("./Viewers");

var _Report = require("./Report");

var _woqlClientInstance = require("../../init/woql-client-instance");

var QueryPane = function QueryPane(props) {
  // props
  var query = props.query || {};
  var editor = props.editor || {};
  var result = props.result || {};
  var resultReport = props.resultReport || {};
  var resultPane = props.resultPane || {};

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      commit_msg = _useState2[0],
      setCommitMsg = _useState2[1];

  var _WOQLClientObj = (0, _woqlClientInstance.WOQLClientObj)(),
      woqlClient = _WOQLClientObj.woqlClient; // editor


  var _useState3 = (0, _react.useState)(query),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      woql = _useState4[0],
      setWoql = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      formattedQuery = _useState6[0],
      setFormattedQuery = _useState6[1];

  var _useState7 = (0, _react.useState)(lang.WOQL_JS),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      qLang = _useState8[0],
      setqLang = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      inputQuery = _useState10[0],
      setInputQuery = _useState10[1]; // rule


  var view = _terminusClient["default"].View.table();

  var _useState11 = (0, _react.useState)(view),
      _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
      rule = _useState12[0],
      setRule = _useState12[1];

  var _useState13 = (0, _react.useState)(false),
      _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
      formattedRule = _useState14[0],
      setFormattedRule = _useState14[1];

  var _useState15 = (0, _react.useState)(lang.WOQL_JS),
      _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
      rLang = _useState16[0],
      setrLang = _useState16[1];

  var _useState17 = (0, _react.useState)(false),
      _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
      inputRule = _useState18[0],
      setInputRule = _useState18[1];

  var _useState19 = (0, _react.useState)(true),
      _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
      showRuleClosable = _useState20[0],
      setShowRuleClosable = _useState20[1];

  var _useState21 = (0, _react.useState)(result),
      _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
      results = _useState22[0],
      setResults = _useState22[1];

  var _useState23 = (0, _react.useState)(viewLabels.TABLE_VIEW),
      _useState24 = (0, _slicedToArray2["default"])(_useState23, 2),
      viewer = _useState24[0],
      setViewer = _useState24[1]; // result report


  var _useState25 = (0, _react.useState)(false),
      _useState26 = (0, _slicedToArray2["default"])(_useState25, 2),
      rep = _useState26[0],
      setReport = _useState26[1]; // editor


  (0, _react.useEffect)(function () {
    if ((0, _helperFunctions.isObject)(woql)) {
      var q = (0, _format.formatQuery)(woql, qLang, tag.QUERY);
      setFormattedQuery(q);
      var start = (0, _now["default"])();
      woql.execute(woqlClient, commit_msg).then(function (results) {
        var wr = new _terminusClient["default"].WOQLResult(results, woql);
        var delta = ((0, _now["default"])() - start) / 1000;
        var message = tag.BLANK;

        if (wr.hasBindings()) {
          message = "Query returned " + wr.count() + " results in " + delta + " seconds";
        }

        if (wr.hasUpdates()) {
          message = wr.inserts() + " triples inserted, " + wr.deletes() + " triples deleted in " + delta + " seconds";
        }

        setResults(wr);
        setReport({
          message: message,
          status: tag.SUCCESS
        });
        setCommitMsg(false);
      })["catch"](function (err) {
        setCommitMsg(false);
        setReport({
          error: err,
          status: tag.ERROR
        });
      });
    }
  }, [woql, qLang]); // rule

  (0, _react.useEffect)(function () {
    var r = (0, _format.formatQuery)(rule, rLang, tag.RULE);
    setFormattedRule(r);
  }, [rule, rLang]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "q-pane"
  }, (0, _helperFunctions.isObject)(editor) && /*#__PURE__*/_react["default"].createElement(_Editor.Editor, {
    text: formattedQuery,
    editor: editor,
    setInputQuery: setInputQuery,
    isQuery: true
  }), (0, _helperFunctions.isObject)(editor) && editor.submit && /*#__PURE__*/_react["default"].createElement(_ActionButton.ActionButton, {
    text: editor.submit,
    lang: qLang,
    setReport: setReport,
    inputQuery: inputQuery,
    setWoql: setWoql,
    setCommitMsg: setCommitMsg,
    isQuery: true
  }), (0, _helperFunctions.isArray)(editor.library) && /*#__PURE__*/_react["default"].createElement(_Library.Library, {
    libs: editor.library,
    setWoql: setWoql
  }), (0, _helperFunctions.isArray)(editor.languages) && /*#__PURE__*/_react["default"].createElement(_PrintLanguage.PrintLanguage, {
    languages: editor.languages,
    isQuery: true,
    setqLang: setqLang
  }), (0, _helperFunctions.isObject)(resultReport) && /*#__PURE__*/_react["default"].createElement(_Report.Report, {
    results: results,
    resultReport: resultReport,
    report: rep
  }), (0, _helperFunctions.isObject)(resultPane.viewEditor) && resultPane.viewEditor.edit && /*#__PURE__*/_react["default"].createElement(_Editor.Editor, {
    text: formattedRule,
    editor: resultPane.viewEditor,
    setInputRule: setInputRule,
    setShowRuleClosable: setShowRuleClosable,
    isQuery: false
  }), (0, _helperFunctions.isObject)(resultPane.viewEditor) && resultPane.submit != tag.BLANK && showRuleClosable && /*#__PURE__*/_react["default"].createElement(_ActionButton.ActionButton, {
    text: resultPane.viewEditor.submit,
    lang: rLang,
    inputRule: inputRule,
    setRule: setRule,
    isQuery: false
  }), (0, _helperFunctions.isObject)(resultPane.viewEditor) && (0, _helperFunctions.isArray)(resultPane.viewEditor.languages) && showRuleClosable && /*#__PURE__*/_react["default"].createElement(_PrintLanguage.PrintLanguage, {
    languages: resultPane.viewEditor.languages,
    isQuery: false,
    setrLang: setrLang
  }), (0, _helperFunctions.isObject)(resultPane.view) && /*#__PURE__*/_react["default"].createElement(_Viewers.Viewers, {
    views: resultPane.view,
    setRule: setRule,
    setViewer: setViewer
  }), (0, _helperFunctions.isObject)(results) && /*#__PURE__*/_react["default"].createElement(_ResultPane.ResultPane, {
    results: results,
    rule: rule,
    viewer: viewer
  }));
};

exports.QueryPane = QueryPane;