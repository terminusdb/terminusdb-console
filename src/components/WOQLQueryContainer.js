import React from "react";
import {WOQLQueryContainerHook} from "./WOQLQueryContainerHook" 

export const WOQLQueryContainer = ({query=false,children}) => {
    const [setWoql,setCommitMsg,report,bindings,woql] = WOQLQueryContainerHook(query);
	const elements = React.Children.toArray(children) ;	
    
    const childrenEl = elements.map((child)=>{
    	return React.cloneElement(child, { setCommitMsg:setCommitMsg,
    							           setWoql:setWoql,

    									   report:report,
    									   woql:woql, 
    									   bindings:bindings})
    })
   
	return(
		  <React.Fragment>
    		{childrenEl}
 		  </React.Fragment>
	)
}