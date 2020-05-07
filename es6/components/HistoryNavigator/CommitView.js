"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = exports.CommitView = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _formLabels = require("../../variables/formLabels");

var _reactstrap = require("reactstrap");

var _dateFormats = require("../../utils/dateFormats");

var CommitView = function CommitView(props) {
  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      newBranch = _useState2[0],
      setNewBranch = _useState2[1];

  function handleNextCommit() {
    props.setRef(props.commit.child);
  }

  function handlePreviousCommit() {
    props.setRef(props.commit.parent);
  }

  function handleBranch() {
    var nuid = newBranch.value;
    props.onBranch(nuid);
  }
  /*if(!props.commit) return <Loading/> */


  if (!props.commit) return /*#__PURE__*/_react["default"].createElement("div", null);
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl mb-12"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 9,
    className: "mb-9"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Container, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Row, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 2
  }, _formLabels.CommitViewerText.time.text), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 3
  }, _formLabels.CommitViewerText.id.text), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 2
  }, _formLabels.CommitViewerText.author.text), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 4
  }, _formLabels.CommitViewerText.message.text)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Row, {
    style: {
      "fontSize": "0.8em",
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 2
  }, (0, _dateFormats.printts)(props.commit.time, _dateFormats.DATETIME_FULL)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 3
  }, props.commit.id), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 2
  }, props.commit.author), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    sm: 4
  }, props.commit.message)))), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, props.commit.child && /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.CommitViewerText.next.className,
    onClick: handleNextCommit
  }, _formLabels.CommitViewerText.next.text), props.commit.parent && /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.CommitViewerText.next.className,
    onClick: handlePreviousCommit
  }, _formLabels.CommitViewerText.previous.text), /*#__PURE__*/_react["default"].createElement("button", {
    className: _formLabels.CommitViewerText.branchButton.className,
    onClick: handleBranch
  }, _formLabels.CommitViewerText.branchButton.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.CommitViewerText.branchInput.text,
    className: _formLabels.CommitViewerText.branchInput.className,
    ref: function ref(bid) {
      return setNewBranch(bid);
    },
    name: "branch-input"
  })));
};

exports.CommitView = CommitView;
var _default = CommitView;
exports["default"] = _default;