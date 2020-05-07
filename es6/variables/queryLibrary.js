"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.libs = exports.documentLib = exports.dataLib = exports.schemaLib = void 0;

var query = _interopRequireWildcard(require("../labels/queryLabels"));

var schemaLib = [{
  text: 'Show All Schema Elements',
  queryName: query.SHOW_ALL_SCHEMA_ELEMENTS,
  action: 'elementMetadata'
}, {
  text: 'Show All Classes',
  queryName: query.SHOW_ALL_CLASSES,
  action: 'classMetadata'
}, {
  text: 'Show Document Classes',
  queryName: query.SHOW_DOCUMENT_CLASSES,
  action: 'concreteDocumentClasses'
}, {
  text: 'Show All Properties',
  queryName: query.SHOW_ALL_PROPERTIES,
  action: 'propertyMetadata'
}];
exports.schemaLib = schemaLib;
var dataLib = [{
  text: 'Show data of Type'
}, {
  text: 'Show data of Property'
}, {
  text: 'Show All Data'
}];
exports.dataLib = dataLib;
var documentLib = [{
  text: 'Show All Documents'
}];
exports.documentLib = documentLib;
var libs = [{
  text: 'Schema library',
  control: schemaLib
}, {
  text: 'Data Library',
  control: dataLib
}, {
  text: 'Document Library',
  control: documentLib
}];
exports.libs = libs;