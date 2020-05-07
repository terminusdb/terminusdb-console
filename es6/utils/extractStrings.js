"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.formatColumnNames = exports.getNameFromVariable = exports.getNameFromUrl = exports.stripDocFromUrl = void 0;

var stripDocFromUrl = function stripDocFromUrl(url) {
  if (url.includes('doc:')) return url.substring(4);
  return url;
};

exports.stripDocFromUrl = stripDocFromUrl;

var getNameFromUrl = function getNameFromUrl(url) {
  return url.substring(url.lastIndexOf('/') + 1);
};

exports.getNameFromUrl = getNameFromUrl;

var getNameFromVariable = function getNameFromVariable(url) {
  var name = url.substring(url.lastIndexOf('/') + 1);
  if (name.includes('v:')) return name.substring(2);
  return name;
};

exports.getNameFromVariable = getNameFromVariable;

var formatColumnNames = function formatColumnNames(v) {
  var formattedStr;
  if (v.includes(':')) formattedStr = v.substring(v.lastIndexOf(':') + 1);else if (v.includes('@')) formattedStr = v.substring(v.lastIndexOf('@') + 1);else formattedStr = v;
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

exports.formatColumnNames = formatColumnNames;