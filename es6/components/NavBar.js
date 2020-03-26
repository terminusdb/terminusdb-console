"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _Nav = require("./Nav");

var _pageLabels = require("../variables/pageLabels");

var _helperFunctions = require("../utils/helperFunctions");

var _initializeGlobalState = require("../init/initializeGlobalState");

var _globalStateLabels = require("../labels/globalStateLabels");

var _reactstrap = require("reactstrap");

var _reactAuth0Spa = require("../react-auth0-spa");

var NavBar = function NavBar(props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var _useAuth = (0, _reactAuth0Spa.useAuth0)(),
      user = _useAuth.user,
      isAuthenticated = _useAuth.isAuthenticated,
      loginWithRedirect = _useAuth.loginWithRedirect,
      logout = _useAuth.logout;

  var toggle = function toggle() {
    return setIsOpen(!isOpen);
  };

  var _useGlobalState = (0, _initializeGlobalState.useGlobalState)(_globalStateLabels.TERMINUS_CLIENT),
      _useGlobalState2 = (0, _slicedToArray2["default"])(_useGlobalState, 1),
      dbClient = _useGlobalState2[0];

  var isDBSet = {
    dbId: (0, _helperFunctions.getCurrentDBID)(dbClient),
    dbName: (0, _helperFunctions.getCurrentDBName)(dbClient)
  };
  if (props.resetDB) (0, _helperFunctions.resetDB)(dbClient);
  var usermy = user || {};
  var userMETADATA = user && user.user_metadata ? user.user_metadata : {};

  var logoutWithRedirect = function logoutWithRedirect() {
    return logout({
      returnTo: window.location.origin
    });
  };

  var containerClassName = isAuthenticated ? "justify-content-start container-fluid" : "justify-content-start container";
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "nav-container"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Navbar, {
    expand: "md",
    dark: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: containerClassName
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.NavbarBrand, {
    href: "https://terminusdb.com",
    className: "logo"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.NavbarToggler, {
    onClick: toggle
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.Collapse, {
    isOpen: isOpen,
    navbar: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "nav-al display-flex"
  }, /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.SERVER_HOME_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: _pageLabels.SERVER_HOME_PAGE.label
  }), /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.NEW_DB_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: _pageLabels.NEW_DB_PAGE.label
  }))), isDBSet.dbId && !props.resetDB && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex db-al db-nav"
  }, /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.DB_HOME_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: isDBSet.dbName
  }), /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.DOCUMENT_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: _pageLabels.DOCUMENT_PAGE.label
  }), /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.QUERY_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: _pageLabels.QUERY_PAGE.label
  }), /*#__PURE__*/_react["default"].createElement(_Nav.Navs, {
    className: "mr-auto",
    page: _pageLabels.SCHEMA_PAGE.page,
    activeClassName: "router-link-exact-active",
    label: _pageLabels.SCHEMA_PAGE.label
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Nav, {
    className: "d-none d-md-block ml-auto",
    navbar: true
  }, !isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    id: "qsLoginBtn",
    color: "primary",
    className: "btn-margin",
    onClick: function onClick() {
      return loginWithRedirect({});
    }
  }, "Log in")), isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactstrap.UncontrolledDropdown, {
    nav: true,
    inNavbar: true
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.DropdownToggle, {
    nav: true,
    caret: true,
    id: "profileDropDown"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: user.picture,
    alt: "Profile",
    className: "nav-user-profile rounded-circle",
    width: "50"
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.DropdownMenu, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.DropdownItem, {
    header: true
  }, user.name), /*#__PURE__*/_react["default"].createElement(_reactstrap.DropdownItem, {
    tag: _reactRouterDom.NavLink,
    to: _pageLabels.PROFILE_PAGE.page,
    className: "dropdown-profile",
    activeClassName: "router-link-exact-active"
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "user",
    className: "mr-3"
  }), " Profile"), /*#__PURE__*/_react["default"].createElement(_reactstrap.DropdownItem, {
    id: "qsLogoutBtn",
    onClick: function onClick() {
      return logoutWithRedirect();
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "power-off",
    className: "mr-3"
  }), " Log out")))), !isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactstrap.Nav, {
    className: "d-md-none",
    navbar: true
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement(_reactstrap.Button, {
    id: "qsLoginBtn",
    color: "primary",
    block: true,
    onClick: function onClick() {
      return loginWithRedirect({});
    }
  }, "Log in"))), isAuthenticated && /*#__PURE__*/_react["default"].createElement(_reactstrap.Nav, {
    className: "d-md-none justify-content-between",
    navbar: true,
    style: {
      minHeight: 170
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "user-info"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: user.picture,
    alt: "Profile",
    className: "nav-user-profile d-inline-block rounded-circle mr-3",
    width: "50"
  }), /*#__PURE__*/_react["default"].createElement("h6", {
    className: "d-inline-block"
  }, user.name))), /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "user",
    className: "mr-3"
  }), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
    to: _pageLabels.PROFILE_PAGE.page,
    activeClassName: "router-link-exact-active"
  }, _pageLabels.PROFILE_PAGE.label)), /*#__PURE__*/_react["default"].createElement(_reactstrap.NavItem, null, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "power-off",
    className: "mr-3"
  }), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
    to: "#",
    id: "qsLogoutBtn",
    onClick: function onClick() {
      return logoutWithRedirect();
    }
  }, "Log out")))))));
};

var _default = NavBar;
exports["default"] = _default;