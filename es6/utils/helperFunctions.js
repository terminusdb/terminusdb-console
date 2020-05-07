"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.timeConverter = exports.resetDB = exports.getCurrentSchema = exports.getCurrentDBName = exports.getCurrentDBID = exports.isArray = exports.isObject = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var isObject = function isObject(obj) {
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return true;
  }

  return false;
};

exports.isObject = isObject;

var isArray = function isArray(arr) {
  if ((0, _isArray["default"])(arr) && arr.length) return true;
  return false;
};

exports.isArray = isArray;

var getCurrentDBID = function getCurrentDBID(client) {
  if (isObject(client)) {
    return client.db();
  } else return false;
};

exports.getCurrentDBID = getCurrentDBID;

var getCurrentDBName = function getCurrentDBName(client) {
  if (isObject(client)) {
    var dbRec = client.connection.getDBMetadata(client.db(), client.account());
    if (isObject(dbRec)) return dbRec.title;else return false;
  } else return false;
};

exports.getCurrentDBName = getCurrentDBName;

var getCurrentSchema = function getCurrentSchema(client) {
  if (isObject(client)) {
    return client.server() + '/' + client.db() + '/schema';
  } else return false;
};

exports.getCurrentSchema = getCurrentSchema;

var resetDB = function resetDB(client) {
  if (isObject(client)) {
    return client.connectionConfig.clearCursor();
  }
};

exports.resetDB = resetDB;

var timeConverter = function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
};

exports.timeConverter = timeConverter;