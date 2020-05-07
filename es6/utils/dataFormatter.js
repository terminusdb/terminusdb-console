"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getBindingUserData = exports.getColumnsForUserTable = exports.getUserSelectOpts = exports.getDBIdsForSelectOptions = exports.getDBListData = exports.getDBListColumns = exports.getBindingData = exports.getColumnsForTable = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/typeof"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _react = _interopRequireDefault(require("react"));

var _extractStrings = require("./extractStrings");

var _databaseHomeLabels = require("../variables/databaseHomeLabels");

var _userAccessLabel = require("../labels/userAccessLabel");

function parseObject(item) {
  var row = {};

  for (var _i = 0, _Object$keys = (0, _keys["default"])(item); _i < _Object$keys.length; _i++) {
    var itemId = _Object$keys[_i];

    if ((0, _typeof2["default"])(item[itemId]) === 'object') {
      row[itemId] = item[itemId]['@value'];

      if (itemId === "v:Date") {
        row['timestamp'] = row[itemId];
      }
    } else {
      if (item[itemId] == "unknown") row[itemId] = "";else row[itemId] = (0, _extractStrings.stripDocFromUrl)(item[itemId]); //else row[itemId] = getNameFromUrl(item[itemId])
    }
  }

  return row;
}

var getColumnsForTable = function getColumnsForTable(result) {
  var columns = [];

  if (result && result.length > 0) {
    var firstItem = result[0];

    for (var _i2 = 0, _Object$keys3 = (0, _keys["default"])(firstItem); _i2 < _Object$keys3.length; _i2++) {
      var itemId = _Object$keys3[_i2];
      columns.push({
        name: (0, _extractStrings.getNameFromVariable)(itemId),
        selector: itemId,
        sortable: true
      });
    }
  }

  return columns;
};

exports.getColumnsForTable = getColumnsForTable;

var getBindingData = function getBindingData(result) {
  var bindingData = [];
  result.forEach(function (item) {
    var row = parseObject(item);
    bindingData.push(row);
  });
  return bindingData;
};

exports.getBindingData = getBindingData;

var getDBListColumns = function getDBListColumns(list) {
  var columns = [];

  for (var _i3 = 0, _Object$keys4 = (0, _keys["default"])(list); _i3 < _Object$keys4.length; _i3++) {
    var it = _Object$keys4[_i3];

    for (var key in list[it]) {
      // if(["@id", "rdfs:label"].indexOf(key) != -1){
      columns.push({
        name: (0, _extractStrings.formatColumnNames)(key),
        selector: key,
        sortable: true,
        minWidth: '200px'
      }); // }
    } // hardcoding Source col as of now coz not sure from where to get this info


    columns.push({
      name: 'Source',
      selector: 'Source',
      sortable: true,
      minWidth: '200px'
    });
    columns.push({
      name: 'View',
      selector: 'View',
      sortable: true,
      minWidth: '200px'
    });
    return columns;
  }
};

exports.getDBListColumns = getDBListColumns;

var getDBListData = function getDBListData(list) {
  var data = [];

  for (var _i4 = 0, _Object$keys5 = (0, _keys["default"])(list); _i4 < _Object$keys5.length; _i4++) {
    var it = _Object$keys5[_i4];
    var row = parseObject(list[it]);
    data.push(row);
  }

  return data;
};

exports.getDBListData = getDBListData;

var getDBIdsForSelectOptions = function getDBIdsForSelectOptions(list) {
  var opts = [];

  for (var _i5 = 0, _Object$keys6 = (0, _keys["default"])(list); _i5 < _Object$keys6.length; _i5++) {
    var it = _Object$keys6[_i5];

    for (var key in list[it]) {
      if (["terminus:id"].indexOf(key) != -1) {
        var vl = list[it];
        opts.push({
          value: list[it][key]['@value'],
          label: list[it][key]['@value']
        });
      }
    }
  }

  return opts;
};

exports.getDBIdsForSelectOptions = getDBIdsForSelectOptions;

var getUserSelectOpts = function getUserSelectOpts(data) {
  var opts = [];

  for (var _i6 = 0, _Object$keys7 = (0, _keys["default"])(data); _i6 < _Object$keys7.length; _i6++) {
    var it = _Object$keys7[_i6];
    var obj = {};

    for (var key in data[it]) {
      var vl = data[it];
      if (key == 'v:UserID') obj.value = vl['v:UserID'];
      if (key == 'v:Label') obj.label = vl['v:Label']['@value'];
    }

    opts.push(obj);
  }

  return opts;
};

exports.getUserSelectOpts = getUserSelectOpts;

var getColumnsForUserTable = function getColumnsForUserTable(result) {
  var columns = [];

  if (result && result.length > 0) {
    var firstItem = result[0];

    for (var _i7 = 0, _Object$keys8 = (0, _keys["default"])(firstItem); _i7 < _Object$keys8.length; _i7++) {
      var itemId = _Object$keys8[_i7];

      if (['v:UserID', 'v:Label', 'v:CapabilityID'].indexOf(itemId) != -1) {
        columns.push({
          name: (0, _extractStrings.getNameFromVariable)(itemId),
          selector: itemId,
          sortable: true
        });
      }
    }
  } // push in options for read/ write and manage


  columns.push({
    name: _databaseHomeLabels.READ.label,
    selector: _databaseHomeLabels.READ.label
  });
  columns.push({
    name: _databaseHomeLabels.WRITE.label,
    selector: _databaseHomeLabels.WRITE.label
  });
  columns.push({
    name: _databaseHomeLabels.MANAGE.label,
    selector: _databaseHomeLabels.MANAGE.label
  }); //console.log('columns', columns);

  return columns;
};

exports.getColumnsForUserTable = getColumnsForUserTable;

var parseUserDataObject = function parseUserDataObject(item) {
  //console.log('d', item);
  var row = {};

  for (var _i8 = 0, _Object$keys9 = (0, _keys["default"])(item); _i8 < _Object$keys9.length; _i8++) {
    var itemId = _Object$keys9[_i8];

    if (['v:UserID', 'v:Label', 'v:Action', 'v:CapabilityID'].indexOf(itemId) != -1) {
      if ((0, _typeof2["default"])(item[itemId]) === 'object') {
        row[itemId] = item[itemId]['@value'];
      } else {
        if (itemId == 'v:Action') {
          switch (item[itemId]) {
            case _userAccessLabel.READ_ACCESS:
              row[_databaseHomeLabels.READ.label] = true;
              break;

            case _userAccessLabel.WRITE_ACCESS:
              row[_databaseHomeLabels.WRITE.label] = true;
              break;

            case _userAccessLabel.MANAGE_ACCESS:
              row[_databaseHomeLabels.MANAGE.label] = true;
              break;
          }
        } else {
          if (item[itemId] == "unknown") row[itemId] = "";else row[itemId] = (0, _extractStrings.stripDocFromUrl)(item[itemId]); // row[itemId] = getNameFromUrl(item[itemId])
        }
      }
    }
  }

  return row;
};

var getBindingUserData = function getBindingUserData(result) {
  var bindingData = [];
  result.forEach(function (item) {
    var row = parseUserDataObject(item);
    bindingData.push(row);
  }); // console.log('bindingData', bindingData);

  return bindingData;
};

exports.getBindingUserData = getBindingUserData;