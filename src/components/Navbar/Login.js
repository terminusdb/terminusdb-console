import {  Nav,NavItem, Button } from "reactstrap";
import React, { useState, useEffect } from "react";
import * as links from '../../variables/pageLabels'
import { useAuth0 } from "../../react-auth0-spa";

export const Login = (props) => {
    const { loginWithRedirect } = useAuth0();
    return ( 
        <Nav className = "mr-auto"  navbar>
            <NavItem>
                <Button id = "qsLoginBtn"
                    color = "primary"
                    className = "btn-margin"
                    onClick = {() => loginWithRedirect({})}>
                    {links.LOGIN.label}
                </Button>
            </NavItem>
        </Nav>
    )
}



