import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

export const ResultPane = ({bindings, viewer, children}) => {
    
    const elements = React.Children.toArray(children) ;	
    const childrenEl = elements.map((child)=>{
        return React.cloneElement(child, { 
            updateView:updateView,
            bindings:bindings
        })
    })
    return (
        <Container>
            {childrenEl}
        </Container>                
    )
}
