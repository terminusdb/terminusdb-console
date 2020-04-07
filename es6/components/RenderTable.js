"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _history = _interopRequireDefault(require("../utils/history"));

var _extractStrings = require("../utils/extractStrings");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactstrap = require("reactstrap");

var _reactDataTableComponent = _interopRequireDefault(require("react-data-table-component"));

var _pageLabels = require("../variables/pageLabels");

var _initializeGlobalState = require("../init/initializeGlobalState");

var _globalStateLabels = require("../labels/globalStateLabels");

var _ExpandedComponent = _interopRequireDefault(require("./ExpandedComponent"));

function ownKeys(object, enumerableOnly) { var keys = (0, _keys["default"])(object); if (_getOwnPropertySymbols["default"]) { var symbols = (0, _getOwnPropertySymbols["default"])(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return (0, _getOwnPropertyDescriptor["default"])(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors["default"]) { (0, _defineProperties["default"])(target, (0, _getOwnPropertyDescriptors["default"])(source)); } else { ownKeys(Object(source)).forEach(function (key) { (0, _defineProperty2["default"])(target, key, (0, _getOwnPropertyDescriptor["default"])(source, key)); }); } } return target; }

var RenderTable = function RenderTable(props) {
  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      onRowClicked = _useState2[0],
      setSelectedRows = _useState2[1];

  var _useGlobalState = (0, _initializeGlobalState.useGlobalState)(_globalStateLabels.TERMINUS_CLIENT),
      _useGlobalState2 = (0, _slicedToArray2["default"])(_useGlobalState, 1),
      dbClient = _useGlobalState2[0];

  var explandableRows = false;
  if (props.fromPage == _pageLabels.SERVER_HOME_PAGE.page) explandableRows = true;
  var dBuf = props.dataProvider.columnData || []; // get datatable data and column

  var data = [];

  if (explandableRows) {
    // disable row expansion when db has no description
    data = dBuf.map(function (item) {
      var disabled = false;

      if (item['rdfs:comment'] == undefined) {
        disabled = true;
      }

      return _objectSpread({}, item, {
        disabled: disabled
      });
    });
  } else data = props.dataProvider.columnData || [];

  var columns = props.dataProvider.columnConf || [];
  var handleChange = (0, _react.useCallback)(function (state) {
    switch (props.fromPage) {
      case _pageLabels.SERVER_HOME_PAGE.page:
        var dbId = (0, _extractStrings.stripDocFromUrl)(state['@id']);

        _history["default"].replace('db/' + dbId);

        dbClient.connectionConfig.setDB(dbId);
        break;

      default:
        console.log('RenderTable.js - Invalid page label');
    }

    setSelectedRows(state);
  }, [dbClient]);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, explandableRows && /*#__PURE__*/_react["default"].createElement(_reactDataTableComponent["default"], {
    columns: columns,
    data: data,
    onRowClicked: handleChange,
    pagination: true,
    striped: true,
    pointerOnHover: true,
    highlightOnHover: true,
    expandableRows: true,
    expandableRowDisabled: function expandableRowDisabled(row) {
      return row.disabled;
    },
    responsive: true,
    expandableRowsComponent: /*#__PURE__*/_react["default"].createElement(_ExpandedComponent["default"], {
      fromPage: props.fromPage,
      dataProvider: props.dataProvider
    })
  }), !explandableRows && /*#__PURE__*/_react["default"].createElement(_reactDataTableComponent["default"], {
    columns: columns,
    data: data,
    onRowClicked: handleChange,
    pagination: true,
    striped: true,
    pointerOnHover: true,
    highlightOnHover: true,
    responsive: true
  }));
};

var _default = RenderTable;
exports["default"] = _default;