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

var _reactstrap = require("reactstrap");

var _reactAuth0Spa = require("../react-auth0-spa");

var HomeNavBar = function HomeNavBar() {
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

  var logoutWithRedirect = function logoutWithRedirect() {
    return logout({
      returnTo: window.location.origin
    });
  };

  var containerClassName = isAuthenticated ? "justify-content-start container-fluid" : "justify-content-start container menu";
  var activeStyle = isOpen ? 'active' : '';
  return /*#__PURE__*/_react["default"].createElement("header", {
    className: "header ".concat(activeStyle)
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "wrapper"
  }, /*#__PURE__*/_react["default"].createElement("nav", {
    className: "menu"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://terminusdb.com",
    className: "menu__brand",
    role: "button"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: "img/logos/logo.svg",
    className: "menu__logo",
    alt: "Terminus DB logo"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "menu__body ".concat(activeStyle)
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "menu__list"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://terminusdb.com/docs/",
    target: "_blank",
    className: "menu__link",
    "aria-label": "Documentation"
  }, "Documentation")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://medium.com/terminusdb",
    target: "_blank",
    className: "menu__link",
    "aria-label": "Blog"
  }, "Blog")), isAuthenticated && /*#__PURE__*/_react["default"].createElement("li", {
    className: "d-sm-none d-md-block"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.UncontrolledDropdown, {
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
    to: "/profile",
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
  }), " Log out")))), isAuthenticated && /*#__PURE__*/_react["default"].createElement("div", {
    className: "user_info_box d-md-none"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "user-info"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: user.picture,
    alt: "Profile",
    className: "nav-user-profile d-inline-block rounded-circle mr-3",
    width: "50"
  }), /*#__PURE__*/_react["default"].createElement("h6", {
    className: "d-inline-block",
    style: {
      color: "white"
    }
  }, user.name))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item"
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "user",
    className: "mr-3",
    style: {
      color: "white"
    }
  }), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
    to: "/profile",
    activeClassName: "router-link-exact-active",
    className: "menu__link"
  }, "Profile")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item"
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: "power-off",
    className: "mr-3",
    style: {
      color: "white"
    }
  }), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
    to: "#",
    id: "qsLogoutBtn",
    onClick: function onClick() {
      return logoutWithRedirect();
    },
    className: "menu__link"
  }, "Log out"))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item menu__item--full-mobile"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "menu__social-list"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__social-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://twitter.com/TerminusDB",
    className: "menu__social-link",
    target: "_blank"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon-twitter menu__icon"
  }))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__social-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://github.com/terminusdb/terminus-server",
    className: "menu__social-link",
    target: "_blank"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon-github-logo menu__icon"
  }))))), !isAuthenticated && /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__item menu__item--full-mobile"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    id: "qsLoginBtn",
    onClick: function onClick() {
      return loginWithRedirect({});
    },
    className: "menu__button",
    "aria-label": "Download now"
  }, "Download now"))), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "menu__footer"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__secondary-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://terminusdb.com",
    role: "button"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: "img/logos/logo.svg",
    className: "menu__secondary-logo",
    alt: "Terminus DB logo"
  }))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "menu__secondary-item"
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "menu__copyright"
  }, "&copy;2020 - TerminusDB | All right reserved")))), /*#__PURE__*/_react["default"].createElement("button", {
    id: "burger",
    className: "menu__burger ".concat(activeStyle),
    onClick: toggle,
    role: "button",
    "aria-label": "Navigation burger button"
  }, /*#__PURE__*/_react["default"].createElement("span", null), /*#__PURE__*/_react["default"].createElement("span", null), /*#__PURE__*/_react["default"].createElement("span", null)))));
};
/*

<header className="header">
  <div className="wrapper">
    <nav className="menu">
      <a href="https://terminusdb.com" className="menu__brand" role="button">
        <img src="img/logos/logo.svg" className="menu__logo" alt="Terminus DB logo"></img>
      </a>
      <div className="menu__body">
        <ul className="menu__list">
          <li className="menu__item">
            <a href="https://terminusdb.com/docs/" target="_blank" className="menu__link" aria-label="Documentation">
              Documentation
            </a>
          </li>
          <li className="menu__item">
            <a href="https://medium.com/terminusdb" target="_blank" className="menu__link" aria-label="Blog">
              Blog
            </a>
          </li>
          <li className="menu__item menu__item--full-mobile">
            <ul className="menu__social-list">
              <li className="menu__social-item">
                <a href="https://twitter.com/TerminusDB" className="menu__social-link" target="_blank">
                  <i className="icon-twitter menu__icon"></i>
                </a>
              </li>
              <li className="menu__social-item">
                <a href="https://github.com/terminusdb/terminus-server" className="menu__social-link" target="_blank">
                  <i className="icon-github-logo menu__icon"></i>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu__item menu__item--full-mobile">
            <a href="https://github.com/terminusdb/terminus-server" target="_blank" className="menu__button" aria-label="Download now">
              Download now
            </a>
          </li>
        </ul>
        <ul className="menu__footer">
          <li className="menu__secondary-item">
            <a href="https://terminusdb.com" role="button">
              <img src="img/logos/logo.svg" className="menu__secondary-logo" alt="Terminus DB logo"></img>
            </a>
          </li>
          <li className="menu__secondary-item">
            <p className="menu__copyright">
              {"&copy;2020 - TerminusDB | All right reserved"}
            </p>
          </li>
        </ul>
      </div>
      <button id="burger" className="menu__burger" role="button" aria-label="Navigation burger button">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  </div>
</header>



    <div className="nav-container">      
        <Navbar expand="md" dark>
          <div className={containerClassName}>     
            <NavbarBrand href="https://terminusdb.com" className="logo"/>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar > 
              <div className="d-flex">           
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Why TerminusHub?
                  </NavLink>
                </NavItem>
              </Nav>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Solutions
                  </NavLink>
                </NavItem>
              </Nav>
               {isAuthenticated && (<Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/newDB"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    NEW DB
                  </NavLink>
                </NavItem>)
              </Nav>
              )}
             </div>
            <Nav className="d-none d-md-block ml-auto" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </Nav>
            )}
          </Collapse> 
        </div>
      </Navbar>     
    </div>


    <header className={`header ${activeStyle}`}>
    <div className="wrapper">
      <nav className="menu">
        <a href="https://terminusdb.com" className="menu__brand" role="button">
          <img src="img/logos/logo.svg" className="menu__logo" alt="Terminus DB logo"></img>
        </a>
        <div className={`menu__body ${activeStyle}`}>
          <ul className="menu__list">
            <li className="menu__item">
              <a href="https://terminusdb.com/docs/" target="_blank" className="menu__link" aria-label="Documentation">
                Documentation
              </a>
            </li>
            <li className="menu__item">
              <a href="https://medium.com/terminusdb" target="_blank" className="menu__link" aria-label="Blog">
                Blog
              </a>
            </li>
            <li className="menu__item menu__item--full-mobile">
              <ul className="menu__social-list">
                <li className="menu__social-item">
                  <a href="https://twitter.com/TerminusDB" className="menu__social-link" target="_blank">
                    <i className="icon-twitter menu__icon"></i>
                  </a>
                </li>
                <li className="menu__social-item">
                  <a href="https://github.com/terminusdb/terminus-server" className="menu__social-link" target="_blank">
                    <i className="icon-github-logo menu__icon"></i>
                  </a>
                </li>
              </ul>
            </li>
            {!isAuthenticated && (               
             <li className="menu__item menu__item--full-mobile">
              <a href="#" id="qsLoginBtn" onClick={() => loginWithRedirect({})} className="menu__button" aria-label="Download now">
                Download now
              </a>
             </li>
            )}
            {isAuthenticated && !activeStyle &&(
              <li className="menu__item menu__item--full-mobile">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </li>
              )}
              {isAuthenticated && activeStyle &&
                (<Fragment >
                  <li className="menu__item">
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </li>
                <li className="menu__item">
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </li>
                <li className="menu__item">
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </li>
                </Fragment>)}

          </ul>
          <ul className="menu__footer">
            <li className="menu__secondary-item">
              <a href="https://terminusdb.com" role="button">
                <img src="img/logos/logo.svg" className="menu__secondary-logo" alt="Terminus DB logo"></img>
              </a>
            </li>
            <li className="menu__secondary-item">
              <p className="menu__copyright">
                {"&copy;2020 - TerminusDB | All right reserved"}
              </p>
            </li>
          </ul>
        </div>
        <button id="burger" className={`menu__burger ${activeStyle}`} onClick={toggle} role="button" aria-label="Navigation burger button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  </header>





   <header className="header">
        <div className="wrapper">      
          <Navbar expand="md" className="menu">   
            <a href="https://terminusdb.com" className="menu__brand" role="button">
              <img src="img/logos/logo.svg" className="menu__logo" alt="Terminus DB logo"></img>
            </a>
            <NavbarToggler onClick={toggle} className="menu__burger" id="burger">
                <span></span>
                <span></span>
                <span></span>
            </NavbarToggler>
            <Collapse isOpen={isOpen} navbar className="menu__body">        
              <Nav className="menu__list ml-auto">
                <NavItem className="menu__item">
                  <NavLink
                    href="https://terminusdb.com/docs/" 
                    target="_blank" 
                    className="menu__link" ariaLabel="Documentation"
                  >
                    Documentation
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://terminusdb.com/docs/" 
                    target="_blank" 
                    className="menu__link" ariaLabel="Blog"
                  >
                    Blog
                  </NavLink>
                </NavItem>                          
          
               {!isAuthenticated && (
                <NavItem>
                   <NavLink href="#" id="qsLoginBtn" 
                      onClick={() => loginWithRedirect({})} 
                      className="menu__button">
                        Log in
                    </NavLink>
                </NavItem>
                )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            {isAuthenticated && (
              <div
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </div>
            )}
            </Nav>
          </Collapse> 
      </Navbar>     
    </div>
    </header>
*/


var _default = HomeNavBar;
exports["default"] = _default;