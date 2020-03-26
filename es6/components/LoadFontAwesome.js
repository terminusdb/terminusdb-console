"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.AddIcon = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _iconLabels = require("../labels/iconLabels");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var AddIcon = function AddIcon(props) {
  var icon = props.icon || '';
  var iconHolder;

  switch (icon) {
    case _iconLabels.HOME_ICON:
      iconHolder = _freeSolidSvgIcons.faHome;
      break;

    case _iconLabels.USER_ASTRONAUT:
      iconHolder = _freeSolidSvgIcons.faUserAstronaut;
      break;

    case _iconLabels.DICE_THREE:
      iconHolder = _freeSolidSvgIcons.faDiceThree;
      break;

    case _iconLabels.TRUCK_LOADING:
      iconHolder = _freeSolidSvgIcons.faTruckLoading;
      break;

    case _iconLabels.USER:
      iconHolder = _freeSolidSvgIcons.faUser;
      break;

    case _iconLabels.MARKER:
      iconHolder = _freeSolidSvgIcons.faMarker;
      break;

    case _iconLabels.DATABASE:
      iconHolder = _freeSolidSvgIcons.faDatabase;
      break;

    case _iconLabels.PAPERPLANE:
      iconHolder = _freeSolidSvgIcons.faPaperPlane;
      break;

    case _iconLabels.MOUNTAIN:
      iconHolder = _freeSolidSvgIcons.faMountain;
      break;

    case _iconLabels.USER_TAG:
      iconHolder = _freeSolidSvgIcons.faUserTag;
      break;

    case _iconLabels.TASKS:
      iconHolder = _freeSolidSvgIcons.faTasks;
      break;

    case _iconLabels.CIRCLE_NOTCH:
      iconHolder = _freeSolidSvgIcons.faCircleNotch;
      break;

    case _iconLabels.CALANDAR:
      iconHolder = _freeSolidSvgIcons.faCalendar;
      break;

    case _iconLabels.HISTORY:
      iconHolder = _freeSolidSvgIcons.faHistory;
      break;
  }

  return /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, (0, _defineProperty2["default"])({
    size: "2x",
    icon: iconHolder
  }, "size", props.size));
}; //<AddIcon status= {HOME_ICON}/>


exports.AddIcon = AddIcon;