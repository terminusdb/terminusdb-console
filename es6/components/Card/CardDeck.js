"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.CardDecks = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _iterator3 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/symbol/iterator"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _reactstrap = require("reactstrap");

var _pricingPlan = require("../../variables/pricingPlan");

function _createForOfIteratorHelper(o) { if (typeof _symbol["default"] === "undefined" || o[_iterator3["default"]] == null) { if ((0, _isArray["default"])(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = (0, _getIterator2["default"])(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from["default"])(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CardDecks = function CardDecks() {
  var freePlanText = [],
      proPlanText = [];

  var _iterator = _createForOfIteratorHelper(_pricingPlan.FREE_PLAN.text.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          index = _step$value[0],
          value = _step$value[1];

      freePlanText.push( /*#__PURE__*/_react["default"].createElement(_reactstrap.CardText, {
        key: index
      }, _pricingPlan.FREE_PLAN.text[index]));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(_pricingPlan.PRO_PLAN.text.entries()),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2),
          _index = _step2$value[0],
          _value = _step2$value[1];

      proPlanText.push( /*#__PURE__*/_react["default"].createElement(_reactstrap.CardText, {
        key: _index
      }, _pricingPlan.PRO_PLAN.text[_index]));
    } //some mechanism to unserstand current plan and set classname

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var freePlanCurr = "curr-pr";
  var proPlanCurr = '';
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.CardDeck, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Card, {
    className: freePlanCurr
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.CardImg, {
    top: true,
    width: "100%",
    src: "https://terminusdb.com/img/cards/card-shape-1.svg",
    alt: "Card image cap"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.CardBody, {
    className: "free-p-div"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.CardTitle, null, _pricingPlan.FREE_PLAN.title), /*#__PURE__*/_react["default"].createElement(_reactstrap.CardSubtitle, null, _pricingPlan.FREE_PLAN.subtitle), freePlanText)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Card, {
    className: proPlanCurr
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.CardImg, {
    top: true,
    width: "100%",
    src: "https://terminusdb.com/img/cards/card-shape-3.svg",
    alt: "Card image cap"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.CardBody, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.CardTitle, null, _pricingPlan.PRO_PLAN.title), /*#__PURE__*/_react["default"].createElement(_reactstrap.CardSubtitle, null, _pricingPlan.PRO_PLAN.subtitle), proPlanText)));
};

exports.CardDecks = CardDecks;