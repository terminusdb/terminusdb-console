"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _reactstrap = require("reactstrap");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _content = require("../variables/content");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = (0, _construct["default"])(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct["default"]) return false; if (_construct["default"].sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct["default"])(Date, [], function () {})); return true; } catch (e) { return false; } }

var Content = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Content, _Component);

  var _super = _createSuper(Content);

  function Content() {
    (0, _classCallCheck2["default"])(this, Content);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Content, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "next-steps my-5"
      }, /*#__PURE__*/_react["default"].createElement("h2", {
        className: "my-5 text-center"
      }, "What can I do next?"), /*#__PURE__*/_react["default"].createElement(_reactstrap.Row, {
        className: "d-flex justify-content-between"
      }, _content.contentData.map(function (col, i) {
        return /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
          key: i,
          md: 5,
          className: "mb-4"
        }, /*#__PURE__*/_react["default"].createElement("h6", {
          className: "mb-3"
        }, /*#__PURE__*/_react["default"].createElement("a", {
          href: col.link,
          className: "titleLink"
        }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: "link",
          className: "mr-2"
        }), col.title)), /*#__PURE__*/_react["default"].createElement("p", null, col.description));
      })));
    }
  }]);
  return Content;
}(_react.Component);

var _default = Content;
exports["default"] = _default;