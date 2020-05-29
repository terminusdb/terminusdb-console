import React, {useState} from "react"
import { Container, FormGroup, Form, Input } from "reactstrap";
import {WOQLClientObj} from "../../init/woql-client-instance";
import { LOGIN_LOGO, LOGIN_CONTAINER_CSS, LOGIN_FORM_CSS, LOGIN_LOGO_CSS, LOGIN_PROMPT_CSS,
     LOGIN_PLACEHOLDER, CONNECT_PROMPT, LOGIN_PROMPT, LOGIN_BUTTON_CSS } from "./constants.pages"

export const LoginPage = () => {
	const [password,setPassword] = useState("")

	const { setKey } = WOQLClientObj();

	const setKeyUpdate =(evt) =>{
		evt.preventDefault();
		if(password){
			setKey(password);
		}
	}

	const onBlur =(evt)=>{
		const value = evt.target.value;
		setPassword(value)
    }
    
    return (
    	<Container fluid className={LOGIN_CONTAINER_CSS}>
    		<Form className={LOGIN_FORM_CSS}>
    			<img className={LOGIN_LOGO_CSS} src={LOGIN_LOGO} alt="" width="70%" height="auto"></img>
	    		<h3 className={LOGIN_PROMPT_CSS} style={{color:"white"}}>{LOGIN_PROMPT}</h3>
	    		<FormGroup>	        		
	        		<Input autoFocus onBlur={onBlur} required type="password" name="password" id="password" placeholder={LOGIN_PLACEHOLDER} />
	      		</FormGroup>
	      		<button className={LOGIN_BUTTON_CSS} onClick={setKeyUpdate}>{CONNECT_PROMPT}</button>
	      	</Form>
    	</Container>
        
    )
}
