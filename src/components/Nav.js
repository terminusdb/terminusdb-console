import React  from "react";
import { NavItems } from "./NavItem";
import {
    Nav
} from "reactstrap";


export const Navs = (props) =>{
    return (
        <Nav className = {props.className}  navbar>
             <NavItems to = {props.page}
                       activeClassName = {props.activeClassName}
                       label = {props.label}/>
        </Nav>
    )
}
