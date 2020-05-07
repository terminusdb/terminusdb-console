"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.LAST_COMMIT = exports.MODIFIED_BY = exports.COMMIT_MESSAGE = exports.TRIPLE = exports.CREATED = exports.AUTHOR = exports.MANAGE_ACTION = exports.MANAGE = exports.WRITE = exports.READ = exports.ACTIONS = exports.PUBLIC = exports.PRIVATE = exports.MASTER = exports.CLONE = void 0;
var CLONE = {
  label: 'Clone',
  name: 'Clone',
  description: 'This database has been cloned from another db (not sure if we store this info)'
};
exports.CLONE = CLONE;
var MASTER = {
  label: 'Master',
  name: 'Master',
  description: 'This is a master database ... change descr'
};
exports.MASTER = MASTER;
var PRIVATE = {
  label: 'Private',
  name: 'Private',
  description: 'This database is accessable only by you'
};
exports.PRIVATE = PRIVATE;
var PUBLIC = {
  label: 'Public',
  name: 'Public',
  description: 'Multiple users have access to the database'
};
exports.PUBLIC = PUBLIC;
var ACTIONS = {
  description: 'Allows you to push changes to database or pull new commits'
};
exports.ACTIONS = ACTIONS;
var READ = {
  label: 'Read',
  name: 'Read',
  description: 'Read-Only access, you do not have write permissions'
};
exports.READ = READ;
var WRITE = {
  label: 'Write',
  name: 'Write',
  description: 'You have permissions to view, change or update the database'
};
exports.WRITE = WRITE;
var MANAGE = {
  label: 'Manage',
  name: 'Manage',
  description: 'Read, Write and Admin permissions available'
};
exports.MANAGE = MANAGE;
var MANAGE_ACTION = {
  description: 'Manage users, invite users to view database, Add roles.. fill in whatver descr'
};
exports.MANAGE_ACTION = MANAGE_ACTION;
var AUTHOR = 'Author';
exports.AUTHOR = AUTHOR;
var CREATED = 'Created';
exports.CREATED = CREATED;
var TRIPLE = 'Triples';
exports.TRIPLE = TRIPLE;
var COMMIT_MESSAGE = 'Commit Message';
exports.COMMIT_MESSAGE = COMMIT_MESSAGE;
var MODIFIED_BY = 'Changed by';
exports.MODIFIED_BY = MODIFIED_BY;
var LAST_COMMIT = 'Last Commit';
exports.LAST_COMMIT = LAST_COMMIT;