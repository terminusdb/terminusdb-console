"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getCapabilityID = exports.getAccessPermissions = void 0;

var _userAccessLabel = require("../labels/userAccessLabel");

var _databaseHomeLabels = require("../variables/databaseHomeLabels");

var getAccessPermissions = function getAccessPermissions(read, write, manage) {
  var permissions = [];
  if (read) permissions.push(_userAccessLabel.READ_ACCESS);
  if (write) permissions.push(_userAccessLabel.WRITE_ACCESS);
  if (manage) permissions.push(_userAccessLabel.MANAGE_ACCESS);
  return permissions;
};

exports.getAccessPermissions = getAccessPermissions;

var getCapabilityID = function getCapabilityID(read, write, manage, dbId) {
  var capabilityID = dbId;
  if (read) capabilityID = capabilityID + '_' + _databaseHomeLabels.READ.label; // read is default

  if (write) capabilityID = capabilityID + '_' + _databaseHomeLabels.WRITE.label;
  if (manage) capabilityID = capabilityID + '_' + _databaseHomeLabels.MANAGE.label;
  return capabilityID + '_Capability';
};

exports.getCapabilityID = getCapabilityID;