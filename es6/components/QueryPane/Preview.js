"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Preview = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _QueryPane = require("./QueryPane");

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var _reactHookForm = require("react-hook-form");

var _helperFunctions = require("../../utils/helperFunctions");

var _queryFormats = require("../../labels/queryFormats");

var q = _interopRequireWildcard(require("../../labels/queryLabels"));

var view = _interopRequireWildcard(require("../../labels/viewLabels"));

/*********************   dont delete this ... this is for kittys testing  ***********************************/
var Preview = function Preview(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      qp = _useState2[0],
      setQp = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      woql = _useState4[0],
      setWOQL = _useState4[1];

  var WOQL = _terminusClient["default"].WOQL;
  var query = WOQL.lib().propertyMetadata();
  var dataProvider = {}; //const [dataProvider, loading] = hooks(woql);

  /*let result = {};
  if(isObject(dataProvider))  result = (dataProvider.results);*/

  var editor = {
    edit: true,
    submit: 'Run Query',

    /*library: [q.SHOW_ALL_SCHEMA_ELEMENTS,
              q.SHOW_ALL_CLASSES,
              q.SHOW_ALL_PROPERTIES],*/
    languages: [_queryFormats.WOQL_JS, _queryFormats.WOQL_JSON]
    /* ,
     library_autosubmit: false,
     submit: 'Run Query'*/

  };
  var resultPane = {
    viewEditor: {
      edit: true,
      submit: 'Update View',
      languages: [_queryFormats.WOQL_JS, _queryFormats.WOQL_JSON]
    },
    view: [view.TABLE_VIEW, view.GRAPH_VIEW]
  };

  var onSubmit = function onSubmit(data) {
    setQp(true);
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/_react["default"].createElement("button", {
    className: 'preview ',
    type: 'submit'
  }, 'Get Query Pane')), qp && /*#__PURE__*/_react["default"].createElement(_QueryPane.QueryPane, {
    editor: editor,
    resultPane: resultPane
  }));
};

exports.Preview = Preview;