"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.STRIPE_TEST_PUBLISHABLE_KEY = exports.localSettings = void 0;

/*
export const localSettings = {server : process.env.TERMINUS_SERVER,
                              key : process.env.TERMINUS_KEY,
                              db : process.env.TERMINUS_DB};
                              */
//use .env variables "http://195.201.12.87:6365/"
//REACT_APP_TERMINUS_KEY="cargo derek considerable recycling"
var localSettings = {
  server: "http://localhost:6363/",
  //"http://localhost:6363",
  key: "root",
  db: "terminus"
};
exports.localSettings = localSettings;
var STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_gMeVkO8PvMWToY2uTezDA52D00Tpsnvy5S";
exports.STRIPE_TEST_PUBLISHABLE_KEY = STRIPE_TEST_PUBLISHABLE_KEY;