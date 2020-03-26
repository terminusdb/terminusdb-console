"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

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

var RenderTable = function RenderTable(props) {
  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      onRowClicked = _useState2[0],
      setSelectedRows = _useState2[1];

  var _useGlobalState = (0, _initializeGlobalState.useGlobalState)(_globalStateLabels.TERMINUS_CLIENT),
      _useGlobalState2 = (0, _slicedToArray2["default"])(_useGlobalState, 1),
      dbClient = _useGlobalState2[0];

  var explandableRows = false;
  var data = props.dataProvider.columnData || [];
  var columns = props.dataProvider.columnConf || [];
  if (props.fromPage == _pageLabels.SERVER_HOME_PAGE.page) explandableRows = true;
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Card, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.CardBody, null, explandableRows && /*#__PURE__*/_react["default"].createElement(_reactDataTableComponent["default"], {
    columns: columns,
    data: data,
    onRowClicked: handleChange,
    pagination: true,
    striped: true,
    pointerOnHover: true,
    highlightOnHover: true,
    expandableRows: true,
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
  }))));
};

var _default = RenderTable;
exports["default"] = _default;