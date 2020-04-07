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

var _dateFns = require("date-fns");

var _d3Scale = require("d3-scale");

var DateTimeSlider = function DateTimeSlider(props) {
  var sliderStyle = {
    position: "relative",
    width: "100%"
  };
  var today = (0, _dateFns.startOfToday)();
  var fourDaysAgo = (0, _dateFns.subDays)(today, 4);
  var oneWeekAgo = (0, _dateFns.subDays)(today, 7);

  var _useState = (0, _react.useState)(fourDaysAgo),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      selected = _useState2[0],
      setSelected = _useState2[1];

  var _useState3 = (0, _react.useState)(fourDaysAgo),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      updated = _useState4[0],
      setUpdated = _useState4[1];

  var _useState5 = (0, _react.useState)(oneWeekAgo),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      min = _useState6[0],
      setMin = _useState6[1];

  var _useState7 = (0, _react.useState)(today),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      max = _useState8[0],
      setMax = _useState8[1];

  function formatTick(ms) {
    return (0, _dateFns.format)(new Date(ms), "MM dd");
  }

  var halfHour = 1000 * 60 * 30;

  var onChange = function onChange(_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
        ms = _ref2[0];

    if (isNaN((0, _parseFloat2["default"])(ms))) return;
    setSelected(new Date(ms));
  };

  var onUpdate = function onUpdate(_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 1),
        ms = _ref4[0];

    if (isNaN((0, _parseFloat2["default"])(ms))) return;
    setUpdated(new Date(ms));
    setMin(oneWeekAgo);
    setMax(today);
  };

  var dateTicks = (0, _d3Scale.scaleTime)().domain([min, max]).ticks(8).map(function (d) {
    return +d;
  });

  var renderDateTime = function renderDateTime(date, header) {
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
    }, (0, _dateFns.format)(date, "yyyy MM dd h:mm a")));
  }; //{renderDateTime(selected, "Selected")}


  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, renderDateTime(updated, "Version")), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      margin: "20px 0px 0px 0px",
      height: 90,
      width: "90%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Slider, {
    mode: 1,
    step: halfHour,
    domain: [+min, +max],
    rootStyle: sliderStyle,
    onUpdate: onUpdate,
    onChange: onChange,
    values: [+selected]
  }, /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Rail, null, function (_ref5) {
    var getRailProps = _ref5.getRailProps;
    return /*#__PURE__*/_react["default"].createElement(_SliderComponents.SliderRail, {
      getRailProps: getRailProps
    });
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Handles, null, function (_ref6) {
    var handles = _ref6.handles,
        getHandleProps = _ref6.getHandleProps;
    return /*#__PURE__*/_react["default"].createElement("div", null, handles.map(function (handle) {
      return /*#__PURE__*/_react["default"].createElement(_SliderComponents.Handle, {
        key: handle.id,
        handle: handle,
        domain: [+min, +max],
        getHandleProps: getHandleProps
      });
    }));
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Tracks, {
    right: false
  }, function (_ref7) {
    var tracks = _ref7.tracks,
        getTrackProps = _ref7.getTrackProps;
    return /*#__PURE__*/_react["default"].createElement("div", null, tracks.map(function (_ref8) {
      var id = _ref8.id,
          source = _ref8.source,
          target = _ref8.target;
      return /*#__PURE__*/_react["default"].createElement(_SliderComponents.Track, {
        key: id,
        source: source,
        target: target,
        getTrackProps: getTrackProps
      });
    }));
  }), /*#__PURE__*/_react["default"].createElement(_reactCompoundSlider.Ticks, {
    values: dateTicks
  }, function (_ref9) {
    var ticks = _ref9.ticks;
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