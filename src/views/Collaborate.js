import React, { useState } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,
		Collapse, FormFeedback } from "reactstrap";
import { useForm } from 'react-hook-form';
import { useAuth0 } from "../react-auth0-spa";
import Loading from "../components/Loading";
import { collaborateLabels } from '../variables/content'
import NavBar from '../components/NavBar'
import { cloneForm } from "../variables/formLabels"

const Collaborate = (props) => {
    const { user, isAuthenticated, loginWithRedirect, logout, loading} = useAuth0();
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	const { register, handleSubmit, errors } = useForm();
	const onSubmit = data => {
	   console.log('cloning ...');
	};

	if (loading || !user) {
	return <Loading />;
	}

	return (
		<Container fluid className="h-100 pl-0 pr-0">
			<NavBar resetDB = {true} />
			<Container className="flex-grow-1">
			    <Col className="new-box">
				  	<h4>{collaborateLabels.title}</h4>
				  	<p>{collaborateLabels.mainDescription}</p>
				  	<hr className="my-5" />
						{isAuthenticated && <form onSubmit={handleSubmit(onSubmit) }>
						      <label className = { cloneForm.url.label.className }
							  		 htmlFor = { cloneForm.url.label.htmlFor }>
									 { cloneForm.url.label.text }</label>
						      <input placeholder={ cloneForm.url.input.placeholder }
							         className = { cloneForm.url.input.className }
							         name = { cloneForm.url.input.name }
							         ref = { register({
							          validate: value => value.length > 0}) }/>
						      { errors.databaseUrl && <p className = { cloneForm.url.error.className }>
							  		{ cloneForm.url.error.text }</p>}
						      <label className = { cloneForm.databaseName.label.className }
							  		 htmlFor = { cloneForm.databaseName.label.htmlFor }>
									 { cloneForm.databaseName.label.text }</label>
						      <input name= { cloneForm.databaseName.input.name }
							         className = { cloneForm.databaseName.input.className }
						        	 placeholder = { cloneForm.databaseName.input.placeholder }/>
							  <button className = { cloneForm.action.className }
							  		  type =  { cloneForm.action.type } >
							  { cloneForm.action.text } </button>
	       				</form>}
		    </Col>
		</Container>
	</Container>
	)
}


export default Collaborate;
