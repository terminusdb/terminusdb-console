"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.QUERY_PAGE = exports.DOCUMENT_PAGE = exports.SCHEMA_PAGE = exports.DB_HOME_PAGE = exports.DOWNLOAD_PAGE = exports.NEW_TEAM_PAGE = exports.NEW_DB_PAGE = exports.PROFILE_PAGE = exports.SERVER_HOME_PAGE = void 0;
var SERVER_HOME_PAGE = {
  page: '/home',
  label: 'Home'
};
exports.SERVER_HOME_PAGE = SERVER_HOME_PAGE;
var PROFILE_PAGE = {
  page: '/profile',
  label: 'Profile'
};
exports.PROFILE_PAGE = PROFILE_PAGE;
var NEW_DB_PAGE = {
  page: '/newDB',
  label: 'New Database'
};
exports.NEW_DB_PAGE = NEW_DB_PAGE;
var NEW_TEAM_PAGE = {
  page: '/newTeam',
  label: 'New Team'
};
exports.NEW_TEAM_PAGE = NEW_TEAM_PAGE;
var DOWNLOAD_PAGE = {
  page: '/download',
  label: 'DOWNLOAD TERMINUSDB'
};
exports.DOWNLOAD_PAGE = DOWNLOAD_PAGE;
var DB_HOME_PAGE = {
  page: '/db/*',
  label: "DB Home"
};
exports.DB_HOME_PAGE = DB_HOME_PAGE;
var SCHEMA_PAGE = {
  page: '/schema',
  label: 'Schema'
};
exports.SCHEMA_PAGE = SCHEMA_PAGE;
var DOCUMENT_PAGE = {
  page: '/document',
  label: 'Document'
};
exports.DOCUMENT_PAGE = DOCUMENT_PAGE;
var QUERY_PAGE = {
  page: '/query',
  label: 'Query'
};
exports.QUERY_PAGE = QUERY_PAGE;