import React from "react";
import { Card, CardTitle, CardText, CardImg,Container } from "reactstrap";
import {MASCOT_COLOR, DIALOGUE_BACKGROUND } from "../../constants/images"

export const DialogueBox = (props) => {
    const msg = props.message || "";
    const header = props.header || false;
    const children= props.children || '';
    return (
        <Container fluid className="h-100 connectErrorPage">
            <div className="connectLayout">
                {header && <>
                    <img src={MASCOT_COLOR} alt="" width="70%" height="auto"></img>
                    <h2 className="mb-4">{header}</h2>
                </>}
                <p className="mb-4" >{msg}</p>
                {children}
            </div>          
        </Container>
    )
}
