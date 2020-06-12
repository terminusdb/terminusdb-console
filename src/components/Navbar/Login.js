import {  Nav,NavItem, Button } from "reactstrap";
import React from "react";
import {LOGIN_LABEL, LOGIN_BUTTON_CSS} from './constants.navbar'
import { useAuth0 } from "../../react-auth0-spa";

export const Login = (props) => {
    const { loginWithRedirect, authError} = useAuth0();

    const disabled= authError===true ? {disabled:true} : {onClick : () => loginWithRedirect()} 
//onClick = {() => {loginWithRedirect({})}}>
    return (
        <Nav className = "mr-auto"  navbar>
            <NavItem>
                <Button id = "qsLoginBtn" 
                    color = "primary"
                    className = {LOGIN_BUTTON_CSS}
                    {...disabled}>                   
                    {LOGIN_LABEL}
                </Button>
            </NavItem>
        </Nav>
    )
}
