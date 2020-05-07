"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.fakeUserData = void 0;

var _react = _interopRequireDefault(require("react"));

/** fake user data - temp - delete later once permissions are avail**/
var columnConf = [{
  name: 'ID',
  selector: 'Id',
  sortable: true
}, {
  name: 'Name',
  selector: 'Name',
  sortable: true
}, {
  name: 'Occupation',
  selector: 'Occupation',
  sortable: true
}, {
  name: 'Organisation',
  selector: 'Organisation',
  sortable: true
}, {
  name: 'Read',
  selector: 'Read',
  cell: function cell(row) {
    return /*#__PURE__*/_react["default"].createElement("input", {
      type: "checkbox",
      name: "read",
      value: "read"
    });
  }
}, {
  name: 'Write',
  selector: 'Write',
  cell: function cell(row) {
    return /*#__PURE__*/_react["default"].createElement("input", {
      type: "checkbox",
      name: "write",
      value: "write"
    });
  }
}, {
  name: 'Manage',
  selector: 'Manage',
  cell: function cell(row) {
    return /*#__PURE__*/_react["default"].createElement("input", {
      type: "checkbox",
      name: "manage",
      value: "manage"
    });
  }
}];
var columnData = [{
  Id: '001',
  Name: 'Jim Carrey',
  Occupation: 'Actor',
  Organisation: 'Self',
  Read: 'Y',
  Write: 'Y',
  Manage: 'N'
}, {
  Id: 'Name89',
  Name: 'Glass Mate',
  Occupation: 'student',
  Organisation: 'NCI',
  Read: 'Y',
  Write: 'N',
  Manage: 'N'
}, {
  Id: 'BAC',
  Name: 'WHOEVER',
  Occupation: 'WHOEVER',
  Organisation: 'WHOEVER',
  Read: 'Y',
  Write: 'Y',
  Manage: 'Y'
}, {
  Id: 'VT676',
  Name: 'John Mate',
  Occupation: 'student',
  Organisation: 'NCI',
  Read: 'Y',
  Write: 'N',
  Manage: 'N'
}, {
  Id: '00X',
  Name: 'Check Mate',
  Occupation: 'student',
  Organisation: 'NCI',
  Read: 'Y',
  Write: 'N',
  Manage: 'N'
}];
var fakeUserData = {
  columnData: columnData,
  columnConf: columnConf
};
exports.fakeUserData = fakeUserData;