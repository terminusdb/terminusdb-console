"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getQuery = void 0;

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var query = _interopRequireWildcard(require("../labels/queryLabels"));

var getQuery = function getQuery(queryName, dbClient) {
  var WOQL = _terminusClient["default"].WOQL;
  var commit_graph = dbClient ? "".concat(dbClient.account(), "/").concat(dbClient.db(), "/").concat(dbClient.repo(), "/_commits") : false;

  switch (queryName) {
    case query.SHOW_ALL_SCHEMA_ELEMENTS:
      return WOQL.lib().elementMetadata();

    case query.SHOW_ALL_CLASSES:
      return WOQL.lib().classList();

    case query.SHOW_DOCUMENT_CLASSES:
      return WOQL.lib().concreteDocumentClasses();

    case query.SHOW_ALL_PROPERTIES:
      return WOQL.lib().propertyMetadata();

    case query.GET_COMMITS:
      // change account later and repo
      //const bid = params.bid || false; //bid is branch id or commit id
      //const isBranch = params.isBranch || false; // is branch determines if branch or commit id
      return WOQL.using(commit_graph).and(WOQL.triple("v:Branch", "ref:branch_name", dbClient.checkout()), WOQL.triple("v:Branch", "ref:ref_commit", "v:Head"), WOQL.path("v:Head", "ref:commit_parent+", "v:Tail", "v:Path"), WOQL.not().triple("v:Tail", "ref:commit_parent", "v:Any"), WOQL.triple("v:Tail", "ref:commit_id", "v:TailID"), WOQL.triple("v:Tail", "ref:commit_timestamp", "v:TailID"));

    default:
      return {};
      break;
  }
};

exports.getQuery = getQuery;