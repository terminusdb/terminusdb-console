import React ,{useState} from "react"
import { Container,FormGroup,Form,Button,Label,Input,Row} from "reactstrap";
import {WOQLClientObj} from "../init/woql-client-instance";

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
    	<Container fluid className="h-100 containerSignIn">
    		<Form className="formSignin">
    			<img className="mb-4" src="https://terminusdb.com/img/logos/logo.svg" alt="" width="70%" height="auto"></img>
	    		<h3 className="mb-4 mt-4" style={{color:"white"}}>Please enter your password</h3>
	    		<FormGroup>	        		
	        		<Input onBlur={onBlur} required type="password" name="password" id="password" placeholder="terminusDB password" />
	      		</FormGroup>
	      		<button className="btn btn-lg btn-block btn btn-primary" onClick={setKeyUpdate}>Connect</button>
	      	</Form>
    	</Container>
        
    )
}