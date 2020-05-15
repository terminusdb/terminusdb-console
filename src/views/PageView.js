/**
 * Defines universal structure of Terminus Console page: 
 * Full Page Container 
 *      Navbar (top of page)
 *      PageContent (some passed jsonx thingummy)
 */

import React, { useState } from "react";
import {ConsoleNavbar} from "../components/Navbar/ConsoleNavbar";
import { Col, Container } from "reactstrap";

export const PageView = (props) => {
    return (
        <Container className="terminus-console-page">
            <Container fluid className="console-top-navbar"> 
                <Col className="console-top-navbar">
                    <ConsoleNavbar page={props.page} onHeadChange={props.onHeadChange} />
                </Col>
            </Container>
            <Container fluid className="flex-grow-1  console-page-content">
                <Col className="console-page-content">
    				<div className="sch-disp">
                        {props.children}
                    </div>
                </Col>
            </Container>
        </Container>
    )
}