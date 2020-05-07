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

var _dateFormats = require("../../utils/dateFormats");

var BranchSelector = function BranchSelector(_ref) {
  var branch = _ref.branch,
      branches = _ref.branches,
      onChange = _ref.onChange;

  var _useState = (0, _react.useState)(branch),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      branchInfo = _useState2[0],
      setBranchInfo = _useState2[1];

  var _useState3 = (0, _react.useState)(sbranches),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      sbranches = _useState4[0],
      setBranches = _useState4[1]; //update state whenever props change


  (0, _react.useEffect)(function () {
    setBranches(branches);
    setBranchInfo(branch);
  }, [branch, branches]);

  function changeBranch(SelValue) {
    var nub = SelValue.value;

    if (nub != branchInfo.id) {
      onChange(nub);
    }
  }

  if (sbranches && sbranches.length > 0) {
    return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], {
      placeholder: "Branch: " + branchInfo.id,
      className: "brSeltr",
      value: branchInfo.id,
      onChange: changeBranch,
      options: sbranches
    }), branch.first && /*#__PURE__*/_react["default"].createElement("span", null, "Created: ", (0, _dateFormats.printts)(branchInfo.first), ", ", branchInfo.count, " Updates "));
  }

  return null;
};

var _default = BranchSelector;
exports["default"] = _default;