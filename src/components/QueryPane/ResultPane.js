import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap" //replaced;

//allows multiple resultviews to exist together
/*I don't need result panel
* REPORT AND 
*/
export const ResultPane = ({bindings, query, report, children, updateQuery}) => {
    
    //const [currentViews, setViews] = useState(views)

    const elements = React.Children.toArray(children) ;	
    const childrenEl = elements.map((child)=>{
        return React.cloneElement(child, { 
            updateQuery:updateQuery,
            report:report,
            query:query, 
            bindings:bindings
        })
    })
    return (
        <Container>
            {childrenEl}
        </Container>                
    )
}
