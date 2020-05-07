"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _formLabels = require("../../variables/formLabels");

var _reactstrap = require("reactstrap");

var _databaseHomeLabels = require("../../variables/databaseHomeLabels");

var _reactSelect = _interopRequireDefault(require("react-select"));

var _renderTypeLabels = require("../../labels/renderTypeLabels");

var _AddUserPermission = _interopRequireDefault(require("./AddUserPermission"));

var AddUsers = function AddUsers(props) {
  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      userInfo = _useState2[0],
      setCreateUserInfo = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      isSelected = _useState4[0],
      setSelected = _useState4[1];

  var _useState5 = (0, _react.useState)({
    selectedOption: [{}]
  }),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      values = _useState6[0],
      setReactSelect = _useState6[1];

  var _useState7 = (0, _react.useState)([]),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      chosen = _useState8[0],
      setChosenList = _useState8[1];

  var handleSelect = function handleSelect(ev) {
    setChosenList(ev);
    setSelected(true);
  };

  var dataResponse = {}; //const opts = dataResponse[0].result;

  var opts = [];
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: _formLabels.addUser.label.htmlFor
  }, _formLabels.addUser.label.text), /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], {
    placeholder: "User Name",
    isMulti: true,
    value: values.selectedOption.value,
    onChange: handleSelect,
    options: opts
  }), (0, _isArray["default"])(chosen) && chosen.length > 0 && /*#__PURE__*/_react["default"].createElement(_AddUserPermission["default"], {
    selected: chosen
  }));
};

var _default = AddUsers;
exports["default"] = _default;