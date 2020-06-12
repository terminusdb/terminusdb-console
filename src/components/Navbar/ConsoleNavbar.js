import React, { useState } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
//import { Navbar, Nav, Container, Row, Col, NavbarToggler, NavbarBrand, NavItem, Collapse, NavLink } from "reactstrap";

import { useAuth0 } from "../../react-auth0-spa";

import { DBNavbar } from "./DBNavbar"
import { ServerNavbar } from "./ServerNavbar"
import { HistoryNavigator } from "../History/HistoryNavigator"
import { Login } from "./Login"
import { LoggedIn } from "./LoggedIn"
//import { NAV_CSS } from "./constants.navbar";

export const ConsoleNavbar = (props) => {
    const {isAuthenticated, user, loading } = useAuth0();
    const {woqlClient} = WOQLClientObj();
   // const [isOpen, setIsOpen] = useState(false);
    //const [isCollapseOpen, setCollapseIsOpen] = useState(false);

    //const toggleNavBar = () => setIsOpen(!isOpen);
    //const collapseIsOpen= () => setCollapseIsOpen(!isCollapseOpen)

    const [isOpen,setDropdownOpen] =useState(false);
  const [istopOpen,setTopDropdownOpen] =useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const toggleTop = () => setTopDropdownOpen(prevState => !prevState);

  const dropdownContent = isOpen===true ? "dropdown__content  dropdown__content--show" : "dropdown__content dropdown__content--hide"
  
  const topmenu = istopOpen===true ? "nav__main__center  nav__main__center--show" : "nav__main__center nav__main__center--hide"
  


    return (
        <header className="console__page__header">
           <nav className="nav__main">
                <div className="nav__main__menu">
                    <button className="nav__main__burger" onClick={toggleTop} role="button" aria-label="Navigation burger button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div className="nav__main__left">               
                    <a href="#/" class="nav__main__logo" role="button">
                        <img src="https://terminusdb.com/img/logos/logo.svg" alt="Terminus DB logo"/>
                    </a>
                </div>
                <ul className={topmenu}>
                    <li className="nav__main__item nav__main__item--selected">
                        <a href="#" className="nav__main__link ">nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn</a></li>
                    
                    <li className="nav__main__item"><a href="#" className="nav__main__link">Documents</a></li>
                    <li className="nav__main__item"><a href="#" className="nav__main__link">Query</a></li>
                    <li className="nav__main__item"><a href="#" className="nav__main__link">Schema</a></li>

                    <li className="nav__main__item nav__main__item--box">   
                      <div className="dropdown" >
                        <button className="dropdown__button dropdown__button--top nav__main__link" onClick={toggle}>
                            Dropdown <i className="fa fa-caret-down"></i>
                        </button>
                        <div className={dropdownContent}>
                          <button className="dropdown__button">Link 1</button>
                          <button className="dropdown__button">Link 2</button>
                        </div>
                       </div>
                       <label class="switch" title="time travel tools">
                          <input type="checkbox" className="switch__input"/>
                          <span class="switch__slider"></span>
                        </label>
                    </li>                   
                </ul>
                <div className="nav__main__right">
                    <div className="dropdown" >
                        <a onClick={toggle}  href="#"  aria-expanded="false">
                            <img className="nav__main__profile" src="https://lh3.google.com/u/0/ogw/ADGmqu_FJGokL0CDTqLUEmedJORXPhL0_XZc9Z3ujhfI=s32-c-mo" srcset="https://lh3.google.com/u/0/ogw/ADGmqu_FJGokL0CDTqLUEmedJORXPhL0_XZc9Z3ujhfI=s32-c-mo 1x, https://lh3.google.com/u/0/ogw/ADGmqu_FJGokL0CDTqLUEmedJORXPhL0_XZc9Z3ujhfI=s64-c-mo 2x " alt="" aria-hidden="true"/>
                        </a>
                 
                
                        <div className={dropdownContent}>
                          <button className="dropdown__button">Link 1</button>
                          <button className="dropdown__button">Link 2</button>
                        </div>
                       </div>
                       <button className="button__base button__base--green">
                      Login
                    </button>
                </div>
          </nav>
          </header>
          
       
    )
}

/*
 <div className={NAV_CSS.container} >
            <Navbar expand="md" dark fixed="top" navbar>
                <Row className={NAV_CSS.toprow}> 
                    <Col md={2} sm={6} className={NAV_CSS.homeCol}>
                        {<ServerNavbar />}
                    </Col>
                    <NavbarToggler onClick={collapseIsOpen} />
                    <Collapse isOpen={isCollapseOpen} navbar md={10}>                      
                        <Col md={8} className={NAV_CSS.dbCol} >
                            
                                { (woqlClient.db() )&&
                                    <DBNavbar isOpen = {isOpen} page={props.page} toggleTimeTravel={toggleNavBar}/>
                                }
                           
                        </Col>                    
                        <Col md={4} className={NAV_CSS.loginCol} >
                            {!(isAuthenticated || loading) &&
                                <Login/>
                            }
                            {!loading && isAuthenticated && user &&
                                <LoggedIn/>
                            }
                        </Col> 
                    </Collapse>            
                </Row>
            </Navbar>
            {(isOpen && woqlClient.db() )&& 
                <div className={NAV_CSS.historyContainer}>
                    <Row className={NAV_CSS.historyRow}>
                        <HistoryNavigator />
                    </Row>
                </div>                                        
            }
        </div>
*/