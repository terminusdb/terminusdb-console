import {  Nav,NavItem, NavLink, NavbarBrand } from "reactstrap";
import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { NavLink as RouterNavLink } from "react-router-dom";
import * as links from '../../variables/pageLabels'

export const ServerNavbar = (props) => {

    const {woqlClient} = WOQLClientObj();
    const handleClick = () => {
        woqlClient.db(null);
    }

    return (

                <Nav className = "mr-auto"  navbar>
                    <NavItem>
                        {<NavLink tag = {RouterNavLink}
                                to = {links.SERVER_HOME_PAGE.page}
                                activeClassName = "router-link-exact-active"
                                onClick = {handleClick}
                                exact>
                                <span className="d-fl">
                                    <div className="logo"/>{links.SERVER_HOME_PAGE.label}
                                </span>
                        </NavLink>}
                    </NavItem>
            </Nav>
      )
}

/*
{ /* <span className="m-opts d-flex">
      <div className="d-flex main-nav">*/
          /*<NavbarBrand href={links.SERVER_HOME_PAGE.page} className="logo"/>*/
          /* </div>
         </span>*/
