import React from "react"
import { Nav, NavItem, NavLink } from "reactstrap"
import { WOQLClientObj } from "../../init/woql-client-instance"
import { NavLink as RouterNavLink } from "react-router-dom"
import { SERVER_ROUTE} from "../../constants/routes"
import { SERVER_HOME_LABEL } from "./constants.navbar"

export const ServerNavbar = (props) => {

    const {woqlClient} = WOQLClientObj();
    const handleClick = () => {
        //clear the database context 
        woqlClient.connectionConfig.clearCursor()
    }

    return (
        <Nav className = "mr-auto"  navbar>
            <NavItem>
                {<NavLink tag = {RouterNavLink}
                        to = {SERVER_ROUTE}
                        activeClassName = "router-link-exact-active"
                        onClick = {handleClick}
                        exact>
                        <span className="d-fl">
                            <div className="logo"/>{SERVER_HOME_LABEL}
                        </span>
                </NavLink>}
            </NavItem>
        </Nav>
      )
}

