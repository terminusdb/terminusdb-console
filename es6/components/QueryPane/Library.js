"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Library = void 0;

var _react = _interopRequireWildcard(require("react"));

var tag = _interopRequireWildcard(require("../../labels/tags"));

var _reactstrap = require("reactstrap");

var _queryList = require("../../utils/queryList");

var Library = function Library(props) {
  var libs = props.libs || [];
  var setWoql = props.setWoql;
  var libButtons = [];
  libs.map(function (items) {
    libButtons.push( /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
      key: items,
      onClick: function onClick() {
        var q = (0, _queryList.getQuery)(items);
        setWoql(q);
      }
    }, items, " "));
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "lib-pane"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.ButtonGroup, null, " ", libButtons, " "));
};

exports.Library = Library;