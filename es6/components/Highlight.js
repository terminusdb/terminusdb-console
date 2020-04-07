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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _highlight = _interopRequireDefault(require("highlight.js/lib/highlight"));

require("highlight.js/styles/monokai-sublime.css");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = (0, _construct["default"])(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct["default"]) return false; if (_construct["default"].sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct["default"])(Date, [], function () {})); return true; } catch (e) { return false; } }

var registeredLanguages = {};

var Highlight = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Highlight, _Component);

  var _super = _createSuper(Highlight);

  function Highlight(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Highlight);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "highlight", function () {
      _this.codeNode && _this.codeNode.current && _highlight["default"].highlightBlock(_this.codeNode.current);
    });
    _this.state = {
      loaded: false
    };
    _this.codeNode = _react["default"].createRef();
    return _this;
  }

  (0, _createClass2["default"])(Highlight, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var language = this.props.language;

      if (language && !registeredLanguages[language]) {
        try {
          var newLanguage = require("highlight.js/lib/languages/".concat(language));

          _highlight["default"].registerLanguage(language, newLanguage);

          registeredLanguages[language] = true;
          this.setState({
            loaded: true
          }, this.highlight);
        } catch (e) {
          console.error(e);
          throw Error("Cannot register the language ".concat(language));
        }
      } else {
        this.setState({
          loaded: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.highlight();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          language = _this$props.language,
          children = _this$props.children;
      var loaded = this.state.loaded;

      if (!loaded) {
        return null;
      }

      return /*#__PURE__*/_react["default"].createElement("pre", {
        className: "rounded"
      }, /*#__PURE__*/_react["default"].createElement("code", {
        ref: this.codeNode,
        className: language
      }, children));
    }
  }]);
  return Highlight;
}(_react.Component);

Highlight.propTypes = {
  children: _propTypes["default"].node.isRequired,
  language: _propTypes["default"].string
};
Highlight.defaultProps = {
  language: "json"
};
var _default = Highlight;
exports["default"] = _default;