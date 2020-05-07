"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Report = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/typeof"));

var _react = _interopRequireWildcard(require("react"));

var _reactstrap = require("reactstrap");

var _helperFunctions = require("../../utils/helperFunctions");

var tag = _interopRequireWildcard(require("../../labels/tags"));

var Report = function Report(props) {
  var results = props.results || {};
  var report = props.report || {};
  var message = props.report.message || tag.BLANK,
      alert = tag.SUCCESS_COLOR;
  var vioMessage = {},
      printVios = [];
  /********Terminus Violation functions **********/

  function getPropertyAsDOM(prop, val) {
    var mval = val["@value"] || val;
    if (mval && (0, _typeof2["default"])(mval) != "object") vioMessage.details.push({
      prop: prop,
      mval: mval
    });
  }

  function TerminusViolation(vio) {
    if (vio['@type']) {
      var msg = vio['vio:message'] || {
        "@value": ""
      };
      getPropertyAsDOM(vio["@type"], msg);
    }

    for (var prop in vio) {
      if (prop != "vio:message" && prop != "@type") getPropertyAsDOM(prop, vio[prop]);
    }
  }

  function TerminusViolations(vios) {
    var nvios = [],
        vioBuff = [];
    vioMessage.details = [];

    for (var i = 0; i < vios.length; i++) {
      nvios.push(vios[i]);
    }

    for (var i = 0; i < nvios.length; i++) {
      vioBuff.push(TerminusViolation(nvios[i]));
    }

    var message = vioBuff.length + (vioBuff.length > 1 ? " Violations Detected" : " Violation Detected");
    vioMessage.details.map(function (item) {
      printVios.push( /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        key: item,
        className: "terminus-violation"
      }, /*#__PURE__*/_react["default"].createElement("b", null, item.prop), " ", item.mval)));
    });
  }

  if ((0, _helperFunctions.isObject)(report)) {
    switch (report.status) {
      case tag.SUCCESS:
        if ((0, _helperFunctions.isObject)(results)) {
          alert = tag.SUCCESS_COLOR;
        }

        break;

      case tag.ERROR:
        if (report.error.data && report.error.data['terminus:witnesses']) {
          TerminusViolations(report.error.data['terminus:witnesses']);
          alert = tag.VIO_COLOR;
        } else if (report.error.data && (0, _isArray["default"])(report.error.data)) {
          TerminusViolations(report.error.data);
          alert = tag.VIO_COLOR;
        } else {
          message = String(report.error);
          alert = tag.ERROR_COLOR;
        }

        break;
    }
  }

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, (0, _helperFunctions.isObject)(report) && alert !== tag.VIO_COLOR && /*#__PURE__*/_react["default"].createElement("span", {
    className: "result-reports"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Alert, {
    color: alert
  }, /*#__PURE__*/_react["default"].createElement("b", null, message))), (0, _helperFunctions.isObject)(report) && alert == tag.VIO_COLOR && /*#__PURE__*/_react["default"].createElement("span", {
    className: "result-reports"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Alert, {
    color: alert
  }, /*#__PURE__*/_react["default"].createElement("b", null, vioMessage.numberOfViolations), printVios)));
};

exports.Report = Report;