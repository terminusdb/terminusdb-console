"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.AddIcon = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var icons = _interopRequireWildcard(require("../labels/iconLabels"));

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var AddIcon = function AddIcon(props) {
  var _React$createElement;

  var icon = props.icon || '';
  var iconHolder;

  switch (icon) {
    case icons.HOME_ICON:
      iconHolder = _freeSolidSvgIcons.faHome;
      break;

    case icons.USER_ASTRONAUT:
      iconHolder = _freeSolidSvgIcons.faUserAstronaut;
      break;

    case icons.DICE_THREE:
      iconHolder = _freeSolidSvgIcons.faDiceThree;
      break;

    case icons.TRUCK_LOADING:
      iconHolder = _freeSolidSvgIcons.faTruckLoading;
      break;

    case icons.USER:
      iconHolder = _freeSolidSvgIcons.faUser;
      break;

    case icons.MARKER:
      iconHolder = _freeSolidSvgIcons.faMarker;
      break;

    case icons.DATABASE:
      iconHolder = _freeSolidSvgIcons.faDatabase;
      break;

    case icons.PAPERPLANE:
      iconHolder = _freeSolidSvgIcons.faPaperPlane;
      break;

    case icons.MOUNTAIN:
      iconHolder = _freeSolidSvgIcons.faMountain;
      break;

    case icons.USER_TAG:
      iconHolder = _freeSolidSvgIcons.faUserTag;
      break;

    case icons.TASKS:
      iconHolder = _freeSolidSvgIcons.faTasks;
      break;

    case icons.CIRCLE_NOTCH:
      iconHolder = _freeSolidSvgIcons.faCircleNotch;
      break;

    case icons.CALANDAR:
      iconHolder = _freeSolidSvgIcons.faCalendar;
      break;

    case icons.HISTORY:
      iconHolder = _freeSolidSvgIcons.faHistory;
      break;

    case icons.EDIT:
      iconHolder = _freeSolidSvgIcons.faEdit;
      break;

    case icons.USER_PLUS:
      iconHolder = _freeSolidSvgIcons.faUserPlus;
      break;

    case icons.CARET_RIGHT:
      iconHolder = _freeSolidSvgIcons.faCaretRight;
      break;

    case icons.CARET_LEFT:
      iconHolder = _freeSolidSvgIcons.faCaretLeft;
      break;

    case icons.TABLE:
      iconHolder = _freeSolidSvgIcons.faTable;
      break;

    case icons.PROJECT_DIAGRAM:
      iconHolder = _freeSolidSvgIcons.faProjectDiagram;
      break;
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: props.className
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, (_React$createElement = {
    size: "2x",
    icon: iconHolder
  }, (0, _defineProperty2["default"])(_React$createElement, "size", props.size), (0, _defineProperty2["default"])(_React$createElement, "className", props.className), _React$createElement)));
}; //<AddIcon status= {HOME_ICON}/>


exports.AddIcon = AddIcon;