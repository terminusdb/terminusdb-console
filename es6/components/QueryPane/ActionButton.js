"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ActionButton = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactHookForm = require("react-hook-form");

var tag = _interopRequireWildcard(require("../../labels/tags"));

var lang = _interopRequireWildcard(require("../../labels/queryFormats"));

var _format = require("../../utils/format");

var _formLabels = require("../../variables/formLabels");

var ActionButton = function ActionButton(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var text = props.text || tag.SUBMIT;
  var isQuery = props.isQuery || false;
  var lang = props.lang || lang.WOQL_JS;
  var inputQuery = props.inputQuery || false;
  var setWoql = props.setWoql;
  var inputRule = props.inputRule || false;
  var setRule = props.setRule;
  var setReport = props.setReport;
  var setCommitMsg = props.setCommitMsg;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      showCommitBox = _useState2[0],
      setShowCommitBox = _useState2[1];

  var handleQuery = function handleQuery() {
    if (isQuery) {
      var q = (0, _format.parseText)(inputQuery, lang, tag.QUERY);

      if (!q) {
        var message = "Query could not be extracted from input box - " + "remember that the last element in the query must be a WOQL object";
        setReport({
          status: tag.ERROR,
          error: message
        });
      } else {
        //show the commit message box
        if (q.containsUpdate()) setShowCommitBox(true);else setWoql(q);
      }
    } else {
      var r = (0, _format.parseText)(inputRule, lang, tag.RULE);
      setRule(r);
    }
  };

  var handleCancel = function handleCancel() {
    setShowCommitBox(false);
  };

  var onCommit = function onCommit(data) {
    var q = (0, _format.parseText)(inputQuery, lang, tag.QUERY);

    if (!q) {
      var message = "Query could not be extracted from input box - " + "remember that the last element in the query must be a WOQL object";
      setReport({
        status: tag.ERROR,
        error: message
      });
    } else {
      setCommitMsg(data.commitMessage);
      setWoql(q);
    }
  };

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, showCommitBox && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit(onCommit)
  }, /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.commitBox.label.className
  }, _formLabels.commitBox.label.text), /*#__PURE__*/_react["default"].createElement("textarea", {
    name: _formLabels.commitBox.input.name,
    placeholder: _formLabels.commitBox.input.placeholder,
    ref: register
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "dl-fl"
  }, /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.commitBox.confirm.className,
    type: _formLabels.commitBox.confirm.type
  }, _formLabels.commitBox.confirm.text), /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.commitBox.cancel.className,
    type: _formLabels.commitBox.cancel.type,
    onClick: handleCancel
  }, _formLabels.commitBox.cancel.text))), !showCommitBox && /*#__PURE__*/_react["default"].createElement("button", {
    onClick: handleQuery
  }, " ", text, " "));
};

exports.ActionButton = ActionButton;