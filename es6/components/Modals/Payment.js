"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.PaymentModal = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactstrap = require("reactstrap");

var _reactStripeElements = require("react-stripe-elements");

var _MyStoreCheckout = _interopRequireDefault(require("../Payment/MyStoreCheckout"));

var _localSettings = require("../../config/localSettings");

var PaymentModal = function PaymentModal(props) {
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Modal, {
    isOpen: props.isOpen,
    toggle: props.toggle
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalHeader, {
    toggle: props.toggle
  }, "Upgrade to Pro"), /*#__PURE__*/_react["default"].createElement(_reactstrap.ModalBody, null, /*#__PURE__*/_react["default"].createElement(_reactStripeElements.StripeProvider, {
    apiKey: _localSettings.STRIPE_TEST_PUBLISHABLE_KEY
  }, /*#__PURE__*/_react["default"].createElement(_MyStoreCheckout["default"], null))));
};

exports.PaymentModal = PaymentModal;