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

var _reactHookForm = require("react-hook-form");

var _formLabels = require("../variables/formLabels");

var _APICallsHook3 = require("../hooks/APICallsHook");

var _apiLabels = require("../labels/apiLabels");

var _reactCodemirror = require("react-codemirror2");

require('codemirror/lib/codemirror.css');

require('codemirror/theme/base16-light.css');

require('codemirror/mode/turtle/turtle.js');

var RenderSnippet = function RenderSnippet(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var data = props.dataProvider || {};
  var action = props.edit || false;

  var _useState = (0, _react.useState)(data.response),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      content = _useState2[0],
      setContent = _useState2[1];

  var _useState3 = (0, _react.useState)(''),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      updatedSchema = _useState4[0],
      setSchema = _useState4[1];

  var _useState5 = (0, _react.useState)(action),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      edit = _useState6[0],
      setEdit = _useState6[1];

  var _useState7 = (0, _react.useState)({
    mode: 'turtle',
    theme: 'base16-light',
    readOnly: 'nocursor',
    lineNumbers: true
  }),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      options = _useState8[0],
      setOptions = _useState8[1];

  var _APICallsHook = (0, _APICallsHook3.APICallsHook)(_apiLabels.UPDATE_SCHEMA, null, updatedSchema),
      _APICallsHook2 = (0, _slicedToArray2["default"])(_APICallsHook, 2),
      dataResponse = _APICallsHook2[0],
      loading = _APICallsHook2[1];

  var handleUpdate = function handleUpdate(ev) {
    setEdit(false);
    setSchema(content);
    setOptions({
      mode: 'turtle',
      theme: 'base16-light',
      readOnly: 'nocursor',
      lineNumbers: true
    });
  };

  var handleCancel = function handleCancel(ev) {
    setEdit(false);
    setContent(data.response);
    setOptions({
      mode: 'turtle',
      theme: 'base16-light',
      readOnly: 'nocursor',
      lineNumbers: true
    });
  };

  var handleEdit = function handleEdit(ev) {
    setEdit(true);
    setOptions({
      mode: 'turtle',
      theme: 'base16-light',
      readOnly: false,
      lineNumbers: true
    });
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, !edit && /*#__PURE__*/_react["default"].createElement("button", {
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
    onClick: handleUpdate
  }, _formLabels.editSchema.cancel.text, " "), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.Controlled, {
    value: content,
    options: options,
    onBeforeChange: function onBeforeChange(editor, data, value) {
      setContent(value);
    },
    onChange: function onChange(editor, data, value) {
      setContent(value);
    }
  }));
};

exports.RenderSnippet = RenderSnippet;