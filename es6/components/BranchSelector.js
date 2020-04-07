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

var _reactSelect = _interopRequireDefault(require("react-select"));

var BranchSelector = function BranchSelector(props) {
  var _useState = (0, _react.useState)({
    selectedOption: []
  }),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      values = _useState2[0],
      setReactSelect = _useState2[1];

  var currBranch = 'Master';
  var opts = [// do whatever call to get branch list of db
  {
    value: currBranch,
    label: currBranch
  }, {
    value: 'dev',
    label: 'dev'
  }, {
    value: 'QA',
    label: 'QA'
  }, {
    value: 'pre live',
    label: 'pre live'
  }, {
    value: 'test',
    label: 'test'
  }, {
    value: 'br01',
    label: 'br01'
  }];
  return /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], {
    placeholder: "Branch: " + currBranch,
    className: "brSeltr",
    value: values.selectedOption,
    options: opts
  });
};

var _default = BranchSelector;
exports["default"] = _default;