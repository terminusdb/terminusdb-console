"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.PRO_PLAN = exports.FREE_PLAN = void 0;
var FREE_PLAN = {
  title: 'Free',
  subtitle: 'Single user',
  text: ['3 databases - 1 private, 2 public', '3 collaborators per private DB', 'size limits - idk']
};
exports.FREE_PLAN = FREE_PLAN;
var PRO_PLAN = {
  title: 'Pro',
  subtitle: 'Extra Collaborators',
  text: ['Extra size', 'extra private databases', ' extra (pricing per use + per-seat)']
};
exports.PRO_PLAN = PRO_PLAN;