import React, { useState } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Navbar, Nav, Container, Row, Col, NavbarToggler, NavbarBrand, NavItem, Collapse, NavLink } from "reactstrap";

import { useAuth0 } from "../../react-auth0-spa";

import { DBNavbar } from "./DBNavbar"
import { ServerNavbar } from "./ServerNavbar"
import { HistoryNavigator } from "../History/HistoryNavigator"
import { Login } from "./Login"
import { LoggedIn } from "./LoggedIn"
import { NAV_CSS } from "./constants.navbar";

export const ConsoleNavbar = (props) => {
    const {isAuthenticated, user, loading } = useAuth0();
    const {woqlClient} = WOQLClientObj();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapseOpen, setCollapseIsOpen] = useState(false);

    const toggleNavBar = () => setIsOpen(!isOpen);
    const collapseIsOpen= () => setCollapseIsOpen(!isCollapseOpen)

    return (
        <div className={NAV_CSS.container} >
            <Navbar expand="md" dark fixed="top" navbar>
                <Row className={NAV_CSS.toprow}> 
                    <Col md={2} sm={6} className={NAV_CSS.homeCol}>
                        {<ServerNavbar />}
                    </Col>
                    <NavbarToggler onClick={collapseIsOpen} />                      
                    <Col md={8} className={NAV_CSS.dbCol}>
                        <Collapse isOpen={isCollapseOpen} navbar >
                            { woqlClient.db() &&
                                <DBNavbar isOpen = {isOpen} page={props.page} toggleTimeTravel={toggleNavBar}/>
                            }
                        </Collapse>
                    </Col>                    
                    <Col md={2} sm={6} className={NAV_CSS.loginCol}> 
                        {!(isAuthenticated || loading) &&
                            <Login/>
                        }
                        {!loading && isAuthenticated && user &&
                            <LoggedIn/>
                        }
                    </Col>             
                </Row>
            </Navbar>
            {isOpen && 
                <div className={NAV_CSS.historyContainer}>
                    <Row className={NAV_CSS.historyRow}>
                        <HistoryNavigator />
                    </Row>
                </div>                                        
            }
        </div>
    )
}