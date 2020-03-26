"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = CheckoutForm;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _reactStripeJs = require("@stripe/react-stripe-js");

var _CardSection = _interopRequireDefault(require("./CardSection"));

function CheckoutForm() {
  var stripe = (0, _reactStripeJs.useStripe)();
  var elements = (0, _reactStripeJs.useElements)();

  var handleSubmit = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
      var result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // We don't want to let default form submission happen here,
              // which would refresh the page.
              event.preventDefault();

              if (!(!stripe || !elements)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              _context.next = 5;
              return stripe.createPaymentMethod({
                card: elements.getElement(_reactStripeJs.CardElement),
                billing_details: {
                  // Include any additional collected billing details.
                  name: 'Jenny Rosen'
                }
              });

            case 5:
              result = _context.sent;
              stripePaymentMethodHandler(result);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function handleSubmit(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  function stripePaymentMethodHandler(result) {
    if (result.error) {// Show error in payment form
    } else {
      // Otherwise send paymentMethod.id to your server (see Step 4)
      fetch('/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: (0, _stringify["default"])({
          payment_method_id: result.paymentMethod.id
        })
      }).then(function (result) {
        // Handle server response (see Step 4)
        result.json().then(function (json) {
          console.log('json response', json);
          handleServerResponse(json);
        });
      });
    }
  }

  function handleServerResponse(response) {
    if (response.error) {// Show error from server on payment form
    } else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      stripe.handleCardAction(response.payment_intent_client_secret).then(handleStripeJsResult);
    } else {// Show success message
    }
  }

  function handleStripeJsResult(result) {
    if (result.error) {// Show error in payment form
    } else {
      // The card action has been handled
      // The PaymentIntent can be confirmed again on the server
      fetch('/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: (0, _stringify["default"])({
          payment_intent_id: result.paymentIntent.id
        })
      }).then(function (confirmResult) {
        return confirmResult.json();
      }).then(handleServerResponse);
    }
  }

  return /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react["default"].createElement(_CardSection["default"], null), /*#__PURE__*/_react["default"].createElement("button", {
    type: "submit",
    disabled: !stripe
  }, "Submit Payment"));
}