import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, CardTitle, CardText,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { pull, push } from "../../variables/formLabels"
import DeleteDatabase from "../../components/Modals/DeleteDatabase"

const ManageDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [userInfo, setCreateUserInfo] =  useState({})
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

	const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const onSubmit = (data) => {
		if (!user){
  		  loginWithRedirect();  // authenticate
  	  }
    };


    return (
             <>
			 <Form>
			    <Label><b>Delete this database</b></Label>
				<hr className = "my-space-25"/>
				<p> Once you delete this database there is no going back. </p>
				<hr className = "my-space-25"/>
				<div className = "b-del">
					<Button color="danger" onClick={toggle}>Delete</Button>
			    </div>
				{modal && <DeleteDatabase modal={modal}/>}
		     </Form>
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
