import React from "react";
import { DialogueBox } from "./DialogueBox"
import { CONNECTION_FAILURE, CONNECTION_FAILURE_ADVICE } from "./constants"
import { Container} from "reactstrap";
import {WOQLClientObj} from "../../init/woql-client-instance";

const ConnectionErrorPage = () => {

	const { setKey } = WOQLClientObj();

	const setKeyUpdate =(evt) =>{
		evt.preventDefault();
		setKey(undefined);
	}

    return (
    	<DialogueBox message = { CONNECTION_FAILURE_ADVICE} header = {CONNECTION_FAILURE}>
    		<button className="btn btn-lg btn-block btn btn-primary" onClick={setKeyUpdate}>Enter your passwod</button>
    	</DialogueBox>
    )
}
// /<img width="70%" src="http://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png" class="card-img-top">
export default ConnectionErrorPage;
/*
<Container fluid className="h-100 connectErrorPage">
    		<div className="connectLayout">
    			<img src="http://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png" alt="" width="70%" height="auto"></img>
    			<h2 className="mb-4">{CONNECTION_FAILURE}</h2>
    			<p className="mb-4" >{ CONNECTION_FAILURE_ADVICE}</p>
    			<button className="btn btn-lg btn-block btn btn-primary" onClick={setKeyUpdate}>Enter your passwod</button>
    		</div>    		
    	</Container>*/
//
