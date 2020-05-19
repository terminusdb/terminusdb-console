import React from "react";
import { Container} from "reactstrap";
import {WOQLClientObj} from "../../init/woql-client-instance";

export const TerminusHomeWarning = ({heading, body}) => {

	const { setKey } = WOQLClientObj();

	const setKeyUpdate =(evt) =>{
		evt.preventDefault();
		setKey(undefined);
	}

    return (
    	<Container fluid className="h-100 connectErrorPage">
    		<div className="connectLayout">
    			<img src="http://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png" alt="" width="70%" height="auto"></img>
    			<h2 className="mb-4">{heading}</h2>
    			<p className="mb-4" >{ body}</p>
    		</div>
    		
    	</Container>

        
    )
}

