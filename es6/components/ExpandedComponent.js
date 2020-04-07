"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _react = _interopRequireDefault(require("react"));

// get description
var ExpandedComponent = function ExpandedComponent(props) {
  var description;

  for (var _i = 0, _Object$keys = (0, _keys["default"])(props.data); _i < _Object$keys.length; _i++) {
    var itemId = _Object$keys[_i];
    // props.data gets row info
    var key = props.data[itemId];
    if (itemId == 'rdfs:comment') description = key;
  }

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("p", {
    className: "dscr"
  }, description));
};

var _default = ExpandedComponent;
exports["default"] = _default;