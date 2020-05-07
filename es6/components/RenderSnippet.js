"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.RenderSnippet = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _formLabels = require("../variables/formLabels");

var _reactCodemirror = require("react-codemirror2");

require('codemirror/lib/codemirror.css');

require('codemirror/theme/base16-light.css');

require('codemirror/mode/turtle/turtle.js');

var RenderSnippet = function RenderSnippet(props) {
  var action = props.edit || false;

  var _useState = (0, _react.useState)(props.dataProvider),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      content = _useState2[0],
      setContent = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      commitMsg = _useState4[0],
      setCommitMsg = _useState4[1];

  var _useState5 = (0, _react.useState)(action),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      edit = _useState6[0],
      setEdit = _useState6[1];

  var readMode = {
    mode: 'turtle',
    theme: 'base16-light',
    readOnly: 'nocursor',
    lineNumbers: true
  };
  var writeMode = {
    mode: 'turtle',
    theme: 'base16-light',
    readOnly: false,
    lineNumbers: true
  };

  var _useState7 = (0, _react.useState)(readMode),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      options = _useState8[0],
      setOptions = _useState8[1];

  (0, _react.useEffect)(function () {
    if (props.dataProvider) setContent(props.dataProvider);
    setEdit(props.edit);
  }, [props]);

  var handleCancel = function handleCancel(ev) {
    setEdit(false);
    setContent(props.dataProvider || {});
    setOptions(readMode);
  };

  var handleUpdate = function handleUpdate(ev) {
    if (!commitMsg.value) {
      alert("error here no commit");
    } else {
      props.onChange(content, commitMsg.value);
    }
  };

  var handleEdit = function handleEdit(ev) {
    setEdit(true);
    setOptions(writeMode);
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.Controlled, {
    value: content,
    options: options,
    onBeforeChange: function onBeforeChange(editor, data, value) {
      setContent(value);
    },
    onChange: function onChange(editor, data, value) {
      setContent(value);
    }
  }), edit && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-100"
  }), /*#__PURE__*/_react["default"].createElement("textarea", {
    placeholder: _formLabels.commit.act.input.placeholder,
    className: _formLabels.commit.act.input.className,
    ref: function ref(cmsg) {
      return setCommitMsg(cmsg);
    }
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-15"
  })), !edit && /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.editSchema.edit.className,
    type: _formLabels.editSchema.edit.type,
    onClick: handleEdit
  }, _formLabels.editSchema.edit.text), edit && /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.editSchema.update.className,
    type: _formLabels.editSchema.update.type,
    onClick: handleUpdate
  }, _formLabels.editSchema.update.text, " "), edit && /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.editSchema.cancel.className,
    type: _formLabels.editSchema.cancel.type,
    onClick: handleCancel
  }, _formLabels.editSchema.cancel.text, " "));
};

exports.RenderSnippet = RenderSnippet;