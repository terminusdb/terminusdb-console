import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { CLONE, MASTER, PRIVATE, PUBLIC, ACTIONS } from "../variables/databaseHomeLabels"
import { getCurrentDBID, getCurrentDBName } from "../utils/helperFunctions"
import { commit } from "../variables/formLabels"

const Commit = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [userInfo, setCreateUserInfo] =  useState({})
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const onSubmit = (data) => {
		if (!user){
  		  loginWithRedirect();  // authenticate
  	  }
        console.log('commit something')
    };


    return (
             <>{/*(!loading) && <Alert color="success">
                Sucessfully commited
              </Alert>*/}
             <form onSubmit={ handleSubmit(onSubmit) }>
                 <label htmlFor = { commit.act.label.htmlFor }>
            		{ commit.act.label.text }
                </label>
            	<textarea placeholder={ commit.act.input.placeholder }
                    className = { commit.act.input.className }
            		name = { commit.act.input.name }
            		ref = { register({ validate: value => value.length > 0}) }/>

            		   { errors.commit &&
            			   <p className = { commit.act.error.className }>
            			   { commit.act.error.text }</p>}


      </form> </>
    )
}

export default Commit;
