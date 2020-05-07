"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.printts = exports.DATETIME_YEAR_MONTH = exports.DATETIME_YEAR = exports.DATETIME_SHORT = exports.DATETIME_REGULAR = exports.DATETIME_FULL = void 0;

var _dateFns = require("date-fns");

var DATETIME_FULL = "h:mm:ss a, MMM dd yyyy";
exports.DATETIME_FULL = DATETIME_FULL;
var DATETIME_REGULAR = "dd-MMM-yy h.mm";
exports.DATETIME_REGULAR = DATETIME_REGULAR;
var DATETIME_SHORT = 'h.mm d/MM';
exports.DATETIME_SHORT = DATETIME_SHORT;
var DATETIME_YEAR = 'yyyy';
exports.DATETIME_YEAR = DATETIME_YEAR;
var DATETIME_YEAR_MONTH = 'MMM-yy';
exports.DATETIME_YEAR_MONTH = DATETIME_YEAR_MONTH;

var printts = function printts(ts, f) {
  f = f || DATETIME_REGULAR;
  return (0, _dateFns.format)(new Date(ts * 1000), f);
};

exports.printts = printts;