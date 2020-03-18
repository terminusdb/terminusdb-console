import React, { useState, useEffect, useCallback } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navs } from "./Nav"
import { SERVER_HOME_PAGE, PROFILE_PAGE, NEW_DB_PAGE,
         NEW_TEAM_PAGE, DOWNLOAD_PAGE,
         DB_HOME_PAGE, SCHEMA_PAGE, DOCUMENT_PAGE, QUERY_PAGE } from '../variables/pageLabels'
import { getCurrentDBID, getCurrentDBName, resetDB } from "../utils/helperFunctions"
import { useGlobalState } from "../init/initializeGlobalState";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels";

import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import { useAuth0 } from "../react-auth0-spa";

const NavBar = (props) => {


    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const toggle = () => setIsOpen(!isOpen);
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    const isDBSet = {dbId: getCurrentDBID(dbClient),
                     dbName: getCurrentDBName(dbClient)}

    if(props.resetDB) resetDB(dbClient);

    const usermy= user || {};
    const userMETADATA= user && user.user_metadata ? user.user_metadata : {};

    const logoutWithRedirect = () =>
        logout({
            returnTo: window.location.origin
    });

    const containerClassName = isAuthenticated ? "justify-content-start container-fluid" : "justify-content-start container";

    return (
        <div className="nav-container">
            <Navbar expand="md" dark fixed="top">
                <div className={containerClassName}>
                   {/*<NavbarBrand href="https://terminusdb.com" className="logo"/>*/}
                   <NavbarToggler onClick={toggle} />
                   <Collapse isOpen={isOpen} navbar >
                        <span className="m-opts d-flex"><div className="d-flex main-nav">
                            <Navs className = "mr-auto"/>
                            <span className = "nav-al display-flex">
                                <Navs className = "mr-auto"
                                      page = {SERVER_HOME_PAGE.page}
                                      activeClassName = "router-link-exact-active"
                                      label = {SERVER_HOME_PAGE.label}/>
                                <Navs className = "mr-auto"
                                      page = {NEW_DB_PAGE.page}
                                      activeClassName = "router-link-exact-active"
                                      label = {NEW_DB_PAGE.label}/>
                            </span>
                        </div>
                        {isDBSet.dbId && !(props.resetDB) && <div className="d-flex db-al db-nav s-nav">
                            <Navs className = "mr-auto"
                                  page = {DB_HOME_PAGE.page}
                                  activeClassName = "router-link-exact-active"
                                  label = {isDBSet.dbName}/>
                            <Navs className = "mr-auto"
                                  page = {DOCUMENT_PAGE.page}
                                  activeClassName = "router-link-exact-active"
                                  label = {DOCUMENT_PAGE.label}/>
                            <Navs className = "mr-auto"
                                  page = {QUERY_PAGE.page}
                                  activeClassName = "router-link-exact-active"
                                  label = {QUERY_PAGE.label}/>
                            <Navs className = "mr-auto"
                                  page = {SCHEMA_PAGE.page}
                                  activeClassName = "router-link-exact-active"
                                  label = {SCHEMA_PAGE.label}/>
                         </div>} </span>
                        <Nav className = "d-none d-md-block ml-auto" navbar>
                            {!isAuthenticated && (
                                <NavItem>
                                    <Button id = "qsLoginBtn"
                                            color = "primary"
                                            className = "btn-margin"
                                            onClick = {() => loginWithRedirect({})}>
                                            Log in
                                    </Button>
                                </NavItem>)}
                                {isAuthenticated && (
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret id="profileDropDown">
                                            <img src={user.picture}
                                                 alt="Profile"
                                                 className="nav-user-profile rounded-circle"
                                                 width="50"/>
                                         </DropdownToggle>
                                         <DropdownMenu>
                                         <DropdownItem header>{user.name}</DropdownItem>
                                             <DropdownItem tag={RouterNavLink}
                                                           to= {PROFILE_PAGE.page}
                                                           className="dropdown-profile"
                                                           activeClassName="router-link-exact-active">
                                             <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                                         </DropdownItem>
                                         <DropdownItem id="qsLogoutBtn"
                                                       onClick={() => logoutWithRedirect()}>
                                             <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
                                         </DropdownItem>
                                     </DropdownMenu>
                                </UncontrolledDropdown>)}
                                </Nav>
                                    {!isAuthenticated && (
                                          <Nav className="d-md-none" navbar>
                                                <NavItem>
                                                      <Button id="qsLoginBtn"
                                                              color="primary"
                                                              block
                                                              onClick={() => loginWithRedirect({})}>
                                                              Log in
                                                        </Button>
                                                </NavItem>
                                          </Nav>)}
                                        {isAuthenticated && (
                                              <Nav className="d-md-none justify-content-between"
                                                   navbar
                                                   style={{ minHeight: 170 }}>
                                                   <NavItem>
                                                      <span className="user-info">
                                                          <img src={user.picture}
                                                               alt="Profile"
                                                               className="nav-user-profile d-inline-block rounded-circle mr-3"
                                                               width="50"/>
                                                          <h6 className="d-inline-block">{user.name}</h6>
                                                      </span>
                                                   </NavItem>
                                                  <NavItem>
                                                      <FontAwesomeIcon icon="user" className="mr-3" />
                                                      <RouterNavLink to= {PROFILE_PAGE.page}
                                                                     activeClassName="router-link-exact-active">
                                                                     {PROFILE_PAGE.label}
                                                      </RouterNavLink>
                                                  </NavItem>
                                                  <NavItem>
                                                      <FontAwesomeIcon icon="power-off" className="mr-3" />
                                                      <RouterNavLink to="#"
                                                                     id="qsLogoutBtn"
                                                                     onClick={() => logoutWithRedirect()}>
                                                                     Log out
                                                      </RouterNavLink>
                                                  </NavItem>
                                              </Nav>)}
                                         </Collapse>
                                    </div>
                              </Navbar>
            </div>
    );
};

export default NavBar;
