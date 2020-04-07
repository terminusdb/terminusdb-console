"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/extends"));

var _react = _interopRequireWildcard(require("react"));

var _reactSlick = _interopRequireDefault(require("react-slick"));

var _SlickContent = require("./SlickContent");

//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
var CardElements = function CardElements() {
  var cardEl = [];
  return _SlickContent.SlickContent.map(function (item, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: item.className,
      style: {
        backgroundImage: item.backgroundImage
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      "class": "card__body"
    }, /*#__PURE__*/_react["default"].createElement("h5", {
      "class": "h5 card__title"
    }, item.title), /*#__PURE__*/_react["default"].createElement("img", {
      src: "img/cards/card-icon-2.svg",
      alt: "card-icon",
      "class": "card__icon"
    }), /*#__PURE__*/_react["default"].createElement("p", {
      "class": "card__link"
    }, "Read more"), /*#__PURE__*/_react["default"].createElement("p", {
      "class": "card__text"
    }, item.text)));
  });
};

var SlickCard = function SlickCard(props) {
  var settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    centerPadding: 0,
    centerMode: true,
    arrows: false,
    rows: 1,
    useTransform: false,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    }, {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    }, {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  };
  var slider;

  var next = function next() {
    slider.slickNext();
  };

  var previous = function previous() {
    slider.slickPrev();
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "page-strip page-strip--extended-top-padding"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "wrapper wrapper--relative"
  }, /*#__PURE__*/_react["default"].createElement("h2", {
    className: "h2 page-strip__title"
  }, "The Principles That Drive Us"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "slider-cards__arrows"
  }, /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    "aria-label": "Previous slides",
    className: "arrow arrow--prev",
    onClick: previous
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon-arrow-left arrow__icon arrow__icon--light"
  })), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    onClick: next,
    "aria-label": "Next slides",
    className: "arrow arrow--next"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon-arrow-right arrow__icon"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    "class": "wrapper wrapper--full-width"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    "class": "slider-cards-container"
  }, /*#__PURE__*/_react["default"].createElement(_reactSlick["default"], (0, _extends2["default"])({}, settings, {
    className: "slider slider-cards",
    ref: function ref(c) {
      return slider = c;
    }
  }), CardElements()))));
};

var _default = SlickCard;
exports["default"] = _default;