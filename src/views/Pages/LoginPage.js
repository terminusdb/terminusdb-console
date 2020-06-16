import React, {useState} from "react"
import {WOQLClientObj} from "../../init/woql-client-instance";
import { LOGIN_LOGO, LOGIN_PLACEHOLDER, CONNECT_PROMPT, LOGIN_PROMPT} from "./constants.pages"

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
    	<div className="tdb__login">
    		<form className="tdb__login__form">
    			<img src={LOGIN_LOGO} alt="" width="70%" height="auto"></img>
	    		<h3 className="tdb__login__text" style={{color:"white"}}>{LOGIN_PROMPT}</h3>	    		        		
	        	<input id="tdbPassword" className="tdb__login__input" autoFocus onBlur={onBlur} required type="password"  placeholder={LOGIN_PLACEHOLDER} />	      		
	      		<button id="tdbSubmit" className="tdb__button__base tdb__login__buttom--login" onClick={setKeyUpdate}>{CONNECT_PROMPT}</button>
	      	</form>
    	</div>       
    )
}
