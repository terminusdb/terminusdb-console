"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.DateTimeSlider = void 0;

var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-float"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactCompoundSlider = require("react-compound-slider");

var _SliderComponents = require("./SliderComponents");

var _d3Scale = require("d3-scale");

var _dateFormats = require("../../utils/dateFormats");

var DateTimeSlider = function DateTimeSlider(props) {
  var _useState = (0, _react.useState)(props.current),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      selectedTime = _useState2[0],
      setSelected = _useState2[1];

  var _useState3 = (0, _react.useState)(props.updated),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      updatedTime = _useState4[0],
      setUpdated = _useState4[1];

  var _useState5 = (0, _react.useState)(props.start),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      min = _useState6[0],
      setMin = _useState6[1];

  var _useState7 = (0, _react.useState)(props.end),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      max = _useState8[0],
      setMax = _useState8[1];

  var sliderStyle = {
    position: "relative",
    width: "100%"
  };

  function formatTick(ms) {
    return (0, _dateFormats.printts)(ms / 1000, _dateFormats.DATETIME_SHORT);
  }

  (0, _react.useEffect)(function () {
    if (props.current && props.current != selectedTime) setSelected(props.current);
    if (props.updated && props.updated != updatedTime) setUpdated(props.updated);
    if (props.start && props.start != min) setMin(props.start);
    if (props.end && props.end != max) setMax(props.end);
  }, [props]);
  var halfHour = 1000 * 60 * 30;

  function tsToDate(ts) {
    if (isNaN((0, _parseFloat2["default"])(ts))) return "NaN";
    return new Date((0, _parseFloat2["default"])(ts * 1000));
  }

  var onChange = function onChange(_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
        ms = _ref2[0];

    if (isNaN((0, _parseFloat2["default"])(ms))) return;

    if (Math.floor((0, _parseFloat2["default"])(selectedTime)) != Math.floor(ms / 1000)) {
      props.onChange(Math.floor(ms / 1000));
    }
  };

  var dateTicks = (0, _d3Scale.scaleTime)().domain([tsToDate(min), tsToDate(max)]).ticks().map(function (d) {
    return +d;
  });

  var renderDateTime = function renderDateTime(ts, header) {
    if (ts) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          display: "flex",
          margin: '5px 40px 0px 0px'
        }
      }, /*#__PURE__*/_react["default"].createElement("b", null, header, ":"), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          fontSize: 12,
          margin: '3px 0px 0px 10px'
        }
      }, (0, _dateFormats.printts)(ts)));
    }

    return /*#__PURE__*/_react["default"].createElement("span", null);
  };

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, renderDateTime(selectedTime, "Viewing"), renderDateTime(updatedTime, "Updated")), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      margin: "20px 0px 0px 0px",
      height: 90,
      width: "90%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Slider, {
    mode: 1,
    domain: [+tsToDate(min), +tsToDate(max)],
    rootStyle: sliderStyle,
    onChange: onChange,
    values: [+tsToDate(selectedTime)]
  }, /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Rail, null, function (_ref3) {
    var getRailProps = _ref3.getRailProps;
    return /*#__PURE__*/_react["default"].createElement(_SliderComponents.SliderRail, {
      getRailProps: getRailProps
    });
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Handles, null, function (_ref4) {
    var handles = _ref4.handles,
        getHandleProps = _ref4.getHandleProps;
    return /*#__PURE__*/_react["default"].createElement("div", null, handles.map(function (handle) {
      return /*#__PURE__*/_react["default"].createElement(_SliderComponents.Handle, {
        key: handle.id,
        handle: handle,
        domain: [+tsToDate(min), +tsToDate(max)],
        getHandleProps: getHandleProps
      });
    }));
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Tracks, {
    right: false
  }, function (_ref5) {
    var tracks = _ref5.tracks,
        getTrackProps = _ref5.getTrackProps;
    return /*#__PURE__*/_react["default"].createElement("div", null, tracks.map(function (_ref6) {
      var id = _ref6.id,
          source = _ref6.source,
          target = _ref6.target;
      return /*#__PURE__*/_react["default"].createElement(_SliderComponents.Track, {
        key: id,
        source: source,
        target: target,
        getTrackProps: getTrackProps
      });
    }));
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Ticks, {
    values: dateTicks
  }, function (_ref7) {
    var ticks = _ref7.ticks;
    return /*#__PURE__*/_react["default"].createElement("div", null, ticks.map(function (tick) {
      return /*#__PURE__*/_react["default"].createElement(_SliderComponents.Tick, {
        key: tick.id,
        tick: tick,
        count: ticks.length,
        format: formatTick
      });
    }));
  }))));
};

exports.DateTimeSlider = DateTimeSlider;