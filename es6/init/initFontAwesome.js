"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _fontawesomeSvgCore = require("@fortawesome/fontawesome-svg-core");

var _freeBrandsSvgIcons = require("@fortawesome/free-brands-svg-icons");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

function initFontAwesome() {
  _fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faLink);

  _fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faUser);

  _fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faPowerOff);

  _fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faHome);

  return _fontawesomeSvgCore.library;
}

var _default = initFontAwesome;
exports["default"] = _default;