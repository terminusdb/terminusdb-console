import React, { useState } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Navbar, Nav, Container, Row, Col} from "reactstrap";

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

    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);
  
    function toggleTimeTravel(){
        toggleNavbar()
    }

    return (
        <div className="nav-container">
            <Navbar expand="md" dark fixed="top">
            <Container>
                <div className={containerClassName}>
                    <Row>
                    <ServerNavbar />
                    { woqlClient.db() && 
                        <DBNavbar page={props.page} toggleTimeTravel={toggleTimeTravel}/>
                    }                    
                    <Nav className = "d-none d-md-block ml-auto" navbar>
                        {!isAuthenticated && 
                            <Login />   
                        }
                        {isAuthenticated && user &&
                            <LoggedIn />
                        }
                    </Nav>                    
                    </Row>
                {!collapsed && 
                   <Container>
                       <Row><Col>
                            <HistoryNavigator />
                            </Col>
                       </Row>
                   </Container>
                }                               
                </div>
            </Container> 
            </Navbar>
        </div>
    )
};
