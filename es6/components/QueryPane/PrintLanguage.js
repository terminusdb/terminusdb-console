"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.PrintLanguage = void 0;

var _react = _interopRequireWildcard(require("react"));

var lang = _interopRequireWildcard(require("../../labels/queryFormats"));

var _reactstrap = require("reactstrap");

var PrintLanguage = function PrintLanguage(props) {
  var languages = props.languages || [];
  var isQuery = props.isQuery || false;
  var setqLang = props.setqLang;
  var setrLang = props.setrLang;
  var btns = [];
  languages.map(function (lang) {
    btns.push( /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
      key: lang,
      onClick: function onClick(ev) {
        if (isQuery) setqLang(lang);else setrLang(lang);
      }
    }, lang));
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "lib-pane"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.ButtonGroup, null, " ", btns, " "));
};

exports.PrintLanguage = PrintLanguage;