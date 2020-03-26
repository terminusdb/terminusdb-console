"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var Footer = function Footer() {
  return /*#__PURE__*/_react["default"].createElement("footer", {
    className: "footer fstack"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "wrapper wrapper--increased"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "footer__body"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://terminusdb.com",
    className: "footer__brand",
    role: "button"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: "img/logos/logo.svg",
    className: "footer__logo",
    alt: "Terminus DB logo"
  })), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "footer__list"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "footer__item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://terminusdb.com/docs/",
    target: "_blank",
    className: "footer__link",
    "aria-label": "Documentation"
  }, "Documentation")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "footer__item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://medium.com/terminusdb",
    target: "_blank",
    className: "footer__link",
    "aria-label": "Blog"
  }, "Blog")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "footer__item"
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "footer__copyright"
  }, "\xA92020 - TerminusDB | All right reserved"))))));
};

var _default = Footer;
exports["default"] = _default;