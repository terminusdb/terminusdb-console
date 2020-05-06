import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { pull, push } from "../../variables/formLabels"

const ManageDatabase = (props) => {
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
             <>
             <form onSubmit={ handleSubmit(onSubmit) }>
		          <button className = { push.action.className }
		              type =  { push.action.type } >
		              { push.action.text }
		          </button>

				  <button className = { pull.action.className }
		              type =  { pull.action.type } >
		              { pull.action.text }
		          </button>
      		</form> </>
    )
}

export default ManageDatabase;
