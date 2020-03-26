"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _stripeJs = require("@stripe/stripe-js");

var _CheckoutForm = _interopRequireDefault(require("./CheckoutForm"));

var _reactStripeJs = require("@stripe/react-stripe-js");

//process.env.STRIPE_TEST_PUBLISHABLE_KEY
var stripePromise = (0, _stripeJs.loadStripe)('pk_test_gMeVkO8PvMWToY2uTezDA52D00Tpsnvy5S');

var MyStoreCheckout = function MyStoreCheckout(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactStripeJs.Elements, {
    stripe: stripePromise
  }, /*#__PURE__*/_react["default"].createElement(_CheckoutForm["default"], null));
};

var _default = MyStoreCheckout;
exports["default"] = _default;