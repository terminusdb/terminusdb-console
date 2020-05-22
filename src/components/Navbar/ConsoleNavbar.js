import React, { useState } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Navbar, Nav, Container, Row, Col, NavbarToggler, NavbarBrand, NavItem, Collapse, NavLink } from "reactstrap";

import { useAuth0 } from "../../react-auth0-spa";

import { DBNavbar } from "./DBNavbar"
import { ServerNavbar } from "./ServerNavbar"
import { HistoryNavigator } from "../HistoryNavigator/HistoryNavigator"
import { Login } from "./Login"
import { LoggedIn } from "./LoggedIn"

export const ConsoleNavbar = (props) => {
    const {isAuthenticated, user } = useAuth0();
    const {woqlClient} = WOQLClientObj();
    const containerClassName = isAuthenticated ? "justify-content-start container-fluid" : "justify-content-start container";
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const toggleHistoryNavigator = () => setCollapsed(!collapsed);

    function toggleTimeTravel(){
        toggleHistoryNavigator()
    }





const toggleNavBar = () => {
    setIsOpen(!isOpen)
}

  /*  return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={toggleNavBar} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {links.map(createNavItem)}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
  );   */

   return (
        <div className="nav-container" >
            <Navbar expand="md" dark fixed="top">
            <NavbarToggler onClick={toggleNavBar} />
            <Collapse isOpen={isOpen} navbar>
                <Container>
                    <div className={containerClassName}>
                        {!isOpen && <Row>
                             <Col md={2} className="mb-2">
                                {<ServerNavbar />}
                             </Col>
                             <Col md={8} className="mb-8">
                                { woqlClient.db() &&
                                    <DBNavbar isOpen = {isOpen} page={props.page} toggleTimeTravel={toggleTimeTravel}/>
                                }
                            </Col>
                            <Col md={2} className="mb-2">
                        {/*<Nav className = "d-none d-md-block ml-auto" navbar>*/}
                            {!isAuthenticated &&
                                <Login/>
                            }
                            {isAuthenticated && user &&
                                <LoggedIn/>
                            }
                            </Col>
                      {  /*</Nav>*/}
                        </Row>}

                        {isOpen && <>
                              {<ServerNavbar />}
                              <div className="nav-bar-collapse">
                              { woqlClient.db() &&
                                  <DBNavbar page={props.page} toggleTimeTravel={toggleTimeTravel}/>
                              }
                              {!isAuthenticated &&
                                  <Login/>
                              }
                              </div>
                              <div>
                                  {isAuthenticated && user &&
                                      <LoggedIn/>
                                  }
                              </div>
                         </>
                        }
                    {collapsed && <div className="history-navigator-Collapsible">
                        <Container>
                            <Row>
                                <Col>
                                    <HistoryNavigator onHeadChange={props.onHeadChange}/>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                   }
                    </div>
                </Container>
            </Collapse>
            </Navbar>
        </div>
    )
};
