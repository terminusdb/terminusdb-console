import React  from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { SERVER_HOME_PAGE } from "../variables/pageLabels"
import {
    NavItem,
    NavLink
} from "reactstrap";

export const NavItems = (props) => {
    const toPage = props.to || SERVER_HOME_PAGE

    console.log('props.activeClassName', props.activeClassName)
    console.log('toPage',toPage)
    return(
        <NavItem>
            <NavLink tag = {RouterNavLink}
                     to = {toPage}
                     activeClassName = {props.activeClassName}
                     onClick = {props.onClick}
                     exact>
                     {props.label}
            </NavLink>
        </NavItem>
    )
}
