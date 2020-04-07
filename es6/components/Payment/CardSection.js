"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactStripeJs = require("@stripe/react-stripe-js");

/**
* Use the CSS tab above to style your Element's container.
*/
//import './CardSectionStyles.css'
var CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

function CardSection() {
  return /*#__PURE__*/_react["default"].createElement("label", null, "Card details", /*#__PURE__*/_react["default"].createElement(_reactStripeJs.CardElement, {
    options: CARD_ELEMENT_OPTIONS
  }));
}

;
var _default = CardSection;
exports["default"] = _default;