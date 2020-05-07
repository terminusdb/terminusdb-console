"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Editor = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _helperFunctions = require("../../utils/helperFunctions");

var _reactCodemirror = require("react-codemirror2");

var tag = _interopRequireWildcard(require("../../labels/tags"));

require('codemirror/lib/codemirror.css');

require('codemirror/theme/mdn-like.css');

require('codemirror/mode/javascript/javascript.js');

// we use this component for both queries and rules
var Editor = function Editor(props) {
  var edit = props.editor.edit || false;
  var text = props.text || tag.BLANK;
  var isQuery = props.isQuery || false;
  var setShowRuleClosable = props.setShowRuleClosable;

  var _useState = (0, _react.useState)(tag.BLANK),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      content = _useState2[0],
      setContent = _useState2[1];

  var setInputQuery = props.setInputQuery;
  var setInputRule = props.setInputRule; // rule close and show button

  var closable = props.editor.closable || false;

  var _useState3 = (0, _react.useState)(closable),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      showClose = _useState4[0],
      setShowClose = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      showRule = _useState6[0],
      setShowRule = _useState6[1];

  var _useState7 = (0, _react.useState)(true),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      showCodeMirror = _useState8[0],
      setShowCodeMirror = _useState8[1];

  var rc = tag.EDITOR_READ_ONLY; // edit is false

  if (edit) rc = false;
  var options = {
    mode: tag.EDITOR_LANGUAGE,
    noHScroll: false,
    theme: tag.EDITOR_THEME,
    readOnly: rc,
    lineNumbers: true
  };
  (0, _react.useEffect)(function () {
    setContent(text);
  }, [text]);

  var handleClose = function handleClose() {
    setShowRule(true);
    setShowClose(false);
    setShowCodeMirror(false);
    setShowRuleClosable(false);
  };

  var handleShowRule = function handleShowRule() {
    setShowRule(false);
    setShowRuleClosable(true);
    setShowClose(true);
    setShowCodeMirror(true);
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "rule-editor"
  }, !isQuery && showClose && closable && /*#__PURE__*/_react["default"].createElement("button", {
    onClick: handleClose
  }, " ", tag.CLOSE_RULE, " "), !isQuery && showRule && closable && /*#__PURE__*/_react["default"].createElement("button", {
    onClick: handleShowRule
  }, " ", tag.SHOW_RULE, " "), showCodeMirror && /*#__PURE__*/_react["default"].createElement(_reactCodemirror.Controlled, {
    value: content,
    options: options,
    onBeforeChange: function onBeforeChange(editor, data, value) {
      setContent(value);
    },
    onChange: function onChange(editor, data, value) {
      setContent(value);
      if (isQuery) setInputQuery(value);else setInputRule(value);
    }
  }));
};

exports.Editor = Editor;