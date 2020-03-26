"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _LoadFontAwesome = require("./LoadFontAwesome");

var CategoryHeading = function CategoryHeading(props) {
  return /*#__PURE__*/_react["default"].createElement("span", {
    "class": "subCategoryIcons display-flex"
  }, /*#__PURE__*/_react["default"].createElement(_LoadFontAwesome.AddIcon, {
    icon: props.category.icon
  }), /*#__PURE__*/_react["default"].createElement("h3", {
    className: "category"
  }, " ", props.category.label, " "));
};

var _default = CategoryHeading;
exports["default"] = _default;