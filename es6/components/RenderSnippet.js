"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _react = _interopRequireWildcard(require("react"));

var _reactSyntaxHighlighter = _interopRequireDefault(require("react-syntax-highlighter"));

var _hljs = require("react-syntax-highlighter/dist/esm/styles/hljs");

var RenderSnippet = function RenderSnippet(props) {
  var data = props.dataProvider; //let data = '{"canApprove": true, "hasDisplayed": false}'

  return /*#__PURE__*/_react["default"].createElement(_reactSyntaxHighlighter["default"], {
    language: "javascript",
    style: _hljs.docco,
    showLineNumbers: true,
    wrapLines: true
  }, (0, _stringify["default"])(data));
};

var _default = RenderSnippet;
exports["default"] = _default;