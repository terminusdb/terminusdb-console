"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.parseText = exports.formatQuery = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _queryFormats = require("../labels/queryFormats");

var _tags = require("../labels/tags");

var _helperFunctions = require("../utils/helperFunctions");

var TerminusClient = require('@terminusdb/terminus-client');

var formatQuery = function formatQuery(q, format, mode) {
  if (!(0, _helperFunctions.isObject)(q)) return;
  var serial = serialise(q, format, mode);
  return serial;
};

exports.formatQuery = formatQuery;

var serialise = function serialise(q, format, mode) {
  var View = TerminusClient.View;

  switch (format) {
    case _queryFormats.WOQL_JS:
      return q.prettyPrint(4);

    case _queryFormats.WOQL_JSON:
      if (mode == _tags.RULE) {
        var j = eval(q);
        return (0, _stringify["default"])(j.json(), undefined, 2);
      } else return (0, _stringify["default"])(q.json(), undefined, 2);

    case _queryFormats.WOQL_PY:
      return 'something in python';
    //not sure what module
  }
};

var parseText = function parseText(text, format, mode) {
  var View = TerminusClient.View;
  var view;
  var WOQL = TerminusClient.WOQL;

  switch (format) {
    case _queryFormats.WOQL_JSON:
      var pText = JSON.parse(text);
      if (mode == _tags.QUERY) return WOQL.json(pText);else return View.loadConfig(pText);

    case _queryFormats.WOQL_JS:
      return eval(text);
  }
};

exports.parseText = parseText;