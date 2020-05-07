"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactAuth0Spa = require("../../react-auth0-spa");

var _reactHookForm = require("react-hook-form");

var _FormInputs = require("../../components/Form/FormInputs");

var _reactstrap = require("reactstrap");

var _databaseHomeLabels = require("../../variables/databaseHomeLabels");

var _helperFunctions = require("../../utils/helperFunctions");

var _formLabels = require("../../variables/formLabels");

var _dateFormats = require("../../utils/dateFormats");

var _woqlClientInstance = require("../../init/woql-client-instance");

var Details = function Details(props) {
  var _useForm = (0, _reactHookForm.useForm)(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      isAuthenticated = _useAuth.isAuthenticated,
      user = _useAuth.user; //commitInfo
  // junk data, placeholders for now apply logic later


  var dbStats = _databaseHomeLabels.PRIVATE.label;
  var clStats = _databaseHomeLabels.CLONE.label;
  var dbSize = '1092 triples';
  var dbCreated = props.created || false;
  var formattedCreateDate = (0, _dateFormats.printts)(dbCreated, _dateFormats.DATETIME_FULL);
  var dbModifiedBy = props.commitInfo.author || false;
  var dbModifiedDate = props.commitInfo.time || false;
  var formattedDbModifiedDate = (0, _dateFormats.printts)(dbModifiedDate, _dateFormats.DATETIME_FULL);
  var dbCommitMsg = props.commitInfo.message || false;

  var _WOQLClientObj = (0, _woqlClientInstance.WOQLClientObj)(),
      woqlClient = _WOQLClientObj.woqlClient;

  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Card, null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-50"
  }), /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmit()
  }, /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createDatabaseForm.id.label.className,
    htmlFor: "database-id"
  }, _formLabels.createDatabaseForm.id.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    placeholder: _formLabels.createDatabaseForm.id.input.placeholder,
    className: _formLabels.createDatabaseForm.id.input.className,
    name: "database-id",
    readOnly: true,
    value: woqlClient.db(),
    ref: register({
      validate: function validate(value) {
        return value.length > 0;
      }
    })
  }), errors.databaseID && /*#__PURE__*/_react["default"].createElement("p", {
    className: _formLabels.createDatabaseForm.id.error.className
  }, _formLabels.createDatabaseForm.id.error.text), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createDatabaseForm.databaseName.label.className,
    htmlFor: "database-name"
  }, _formLabels.createDatabaseForm.databaseName.label.text), /*#__PURE__*/_react["default"].createElement("input", {
    name: "database-name",
    value: (0, _helperFunctions.getCurrentDBName)(woqlClient),
    className: _formLabels.createDatabaseForm.databaseName.input.className,
    readOnly: true,
    placeholder: _formLabels.createDatabaseForm.databaseName.input.placeholder,
    ref: register({
      validate: function validate(value) {
        return value.length > 0;
      }
    })
  }), errors.databaseName && /*#__PURE__*/_react["default"].createElement("p", {
    className: _formLabels.createDatabaseForm.databaseName.error.className
  }, _formLabels.createDatabaseForm.databaseName.error.text), /*#__PURE__*/_react["default"].createElement("label", {
    className: _formLabels.createDatabaseForm.databaseDescr.label.className,
    htmlFor: "database-description"
  }, _formLabels.createDatabaseForm.databaseDescr.label.text), /*#__PURE__*/_react["default"].createElement("textarea", {
    name: "database-description",
    className: _formLabels.createDatabaseForm.databaseDescr.input.className,
    readOnly: true,
    placeholder: _formLabels.createDatabaseForm.databaseDescr.input.placeholder,
    ref: register
  }), isAuthenticated && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-25"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-25"
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "radio",
    readOnly: true,
    name: "database-radio-private",
    checked: dbStats === _databaseHomeLabels.PRIVATE.label
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-radio-private"
  }, _databaseHomeLabels.PRIVATE.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "radio",
    readOnly: true,
    checked: dbStats === _databaseHomeLabels.PUBLIC.label,
    name: "database-radio-public"
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 4,
    className: "mb-4"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-radio-public"
  }, _databaseHomeLabels.PUBLIC.label))), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-25"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-25"
  })), isAuthenticated && /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    readOnly: true,
    type: "radio",
    name: "database-master",
    checked: clStats === _databaseHomeLabels.MASTER.label
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-master"
  }, _databaseHomeLabels.MASTER.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    readOnly: true,
    placeholder: _formLabels.database.master.placeholder,
    name: "database-master-name",
    className: _formLabels.database.master.className,
    ref: register
  }))), isAuthenticated && /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    readOnly: true,
    type: "radio",
    checked: clStats === _databaseHomeLabels.CLONE.label,
    name: "database-clone"
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-clone"
  }, _databaseHomeLabels.CLONE.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    readOnly: true,
    placeholder: _formLabels.database.clone.placeholder,
    className: _formLabels.database.clone.className,
    name: "database-clone-name",
    ref: register
  }))), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-space-25"
  }), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-size"
  }, _formLabels.database.size.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    name: "database-size"
  }, dbSize))), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-created-by"
  }, _formLabels.database.createdBy.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 6,
    className: "mb-6"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    name: "database-created-by"
  }, formattedCreateDate))), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "database-modified-by"
  }, _formLabels.database.lastModifiedBy.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 6,
    className: "mb-6"
  }, dbModifiedBy + ', ' + formattedDbModifiedDate)), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 2,
    className: "mb-2"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 6,
    className: "mb-6"
  }, dbCommitMsg)))));
};

var _default = Details;
exports["default"] = _default;