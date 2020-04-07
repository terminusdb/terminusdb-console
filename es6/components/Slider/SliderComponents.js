"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.SliderRail = SliderRail;
exports.Handle = Handle;
exports.Track = Track;
exports.Tick = Tick;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/extends"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

// RAIL
var railOuterStyle = {
  position: "absolute",
  width: "100%",
  height: 40,
  transform: "translate(0%, -50%)",
  cursor: "pointer" // border: "1px solid grey"

};
var railInnerStyle = {
  position: "absolute",
  width: "100%",
  height: 8,
  transform: "translate(0%, -50%)",
  borderRadius: 4,
  pointerEvents: "none",
  backgroundColor: "#CCDDF1"
};

function SliderRail(_ref) {
  var getRailProps = _ref.getRailProps;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
    style: railOuterStyle
  }, getRailProps())), /*#__PURE__*/_react["default"].createElement("div", {
    style: railInnerStyle
  }));
}

SliderRail.propTypes = {
  getRailProps: _propTypes["default"].func.isRequired
}; // HANDLE COMPONENT

function Handle(_ref2) {
  var _ref2$domain = (0, _slicedToArray2["default"])(_ref2.domain, 2),
      min = _ref2$domain[0],
      max = _ref2$domain[1],
      _ref2$handle = _ref2.handle,
      id = _ref2$handle.id,
      value = _ref2$handle.value,
      percent = _ref2$handle.percent,
      disabled = _ref2.disabled,
      getHandleProps = _ref2.getHandleProps;

  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
    style: {
      left: "".concat(percent, "%"),
      position: "absolute",
      transform: "translate(-50%, -50%)",
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
      zIndex: 5,
      width: 24,
      height: 42,
      cursor: "pointer",
      backgroundColor: "none"
    }
  }, getHandleProps(id))), /*#__PURE__*/_react["default"].createElement("div", {
    role: "slider",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    style: {
      left: "".concat(percent, "%"),
      position: "absolute",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
      backgroundColor: "#0055bb" //backgroundColor: disabled ? "#666" : "#333"

    }
  }));
}

Handle.propTypes = {
  domain: _propTypes["default"].array.isRequired,
  handle: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    value: _propTypes["default"].number.isRequired,
    percent: _propTypes["default"].number.isRequired
  }).isRequired,
  getHandleProps: _propTypes["default"].func.isRequired,
  disabled: _propTypes["default"].bool
};
Handle.defaultProps = {
  disabled: false
}; // TRACK COMPONENT

function Track(_ref3) {
  var source = _ref3.source,
      target = _ref3.target,
      getTrackProps = _ref3.getTrackProps,
      disabled = _ref3.disabled;
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
    style: {
      position: "absolute",
      transform: "translate(0%, -50%)",
      height: 8,
      zIndex: 1,
      backgroundColor: "#0055bb",
      borderRadius: 4,
      cursor: "pointer",
      left: "".concat(source.percent, "%"),
      width: "".concat(target.percent - source.percent, "%")
    }
  }, getTrackProps()));
}

Track.propTypes = {
  source: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    value: _propTypes["default"].number.isRequired,
    percent: _propTypes["default"].number.isRequired
  }).isRequired,
  target: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    value: _propTypes["default"].number.isRequired,
    percent: _propTypes["default"].number.isRequired
  }).isRequired,
  getTrackProps: _propTypes["default"].func.isRequired,
  disabled: _propTypes["default"].bool
};
Track.defaultProps = {
  disabled: false
}; // TICK COMPONENT

function Tick(_ref4) {
  var tick = _ref4.tick,
      count = _ref4.count,
      format = _ref4.format;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: "absolute",
      marginTop: 14,
      width: 1,
      height: 5,
      backgroundColor: "rgb(200,200,200)",
      left: "".concat(tick.percent, "%")
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: "absolute",
      marginTop: 22,
      fontSize: 10,
      textAlign: "center",
      fontFamily: "Arial, san-serif",
      marginLeft: "".concat(-(100 / count) / 2, "%"),
      width: "".concat(100 / count, "%"),
      left: "".concat(tick.percent, "%")
    }
  }, format(tick.value)));
}

Tick.propTypes = {
  tick: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    value: _propTypes["default"].number.isRequired,
    percent: _propTypes["default"].number.isRequired
  }).isRequired,
  count: _propTypes["default"].number.isRequired,
  format: _propTypes["default"].func.isRequired
};
Tick.defaultProps = {
  format: function format(d) {
    return d;
  }
};