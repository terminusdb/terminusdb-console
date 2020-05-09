import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

export const ResultPane = ({bindings, viewer, children}) => {
    if(!bindings) return null
    return (
        <Container>
            {children}
        </Container>                
    )
}
