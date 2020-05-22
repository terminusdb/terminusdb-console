import React, { useState, useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import * as links from '../../variables/pageLabels'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0 } from "../../react-auth0-spa";
import * as icons from "../../labels/iconLabels"

export const LoggedIn = (props) => {
    const { user, logout } = useAuth0();

    const logoutWithRedirect = () =>
    logout({
        returnTo: window.location.origin + window.location.pathname
    });

    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret id="profileDropDown">
                <img src={user.picture}
                    alt={links.PROFILE_PAGE.label}
                    className="nav-user-profile rounded-circle"
                    width="50"/>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>{user.name}</DropdownItem>
                <DropdownItem tag = {RouterNavLink}
                    to= {links.PROFILE_PAGE.page}
                    className="dropdown-profile"
                    activeClassName="router-link-exact-active">
                    <FontAwesomeIcon icon={icons.USER} className="mr-3" /> {links.PROFILE_PAGE.label}
                </DropdownItem>
                <DropdownItem id="qsLogoutBtn" onClick={() => logoutWithRedirect()}>
                    <FontAwesomeIcon icon={icons.POWER_OFF} className="mr-3" /> {links.LOGOUT.label}
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}
