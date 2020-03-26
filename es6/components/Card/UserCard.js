"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.UserCard = void 0;

var _react = _interopRequireDefault(require("react"));

var UserCard = function UserCard(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "card card-user"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "user-card-bg"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: props.bgImage,
    alt: "..."
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "content"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "user-pic"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#pablo"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    className: "rounded-circle img-fluid profile-picture mb-3 mb-md-0",
    src: props.avatar,
    alt: "..."
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space"
  }), /*#__PURE__*/_react["default"].createElement("h4", {
    className: "title"
  }, props.name, /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("small", null, props.email)), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space"
  }))), /*#__PURE__*/_react["default"].createElement("p", {
    className: "description text-center"
  }, props.description)), /*#__PURE__*/_react["default"].createElement("hr", null));
};

exports.UserCard = UserCard;