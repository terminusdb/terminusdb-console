import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { CLONE, ORIGIN, PRIVATE, PUBLIC, ACTIONS } from "../../variables/databaseHomeLabels"
import { DATABASE_IS, DATABASE_ACTIONS, DATABASE_ACCESS } from "../../variables/databaseCategories"
import CategoryHeading from "../../components/CategoryHeadings"
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { useGlobalState } from "../../init/initializeGlobalState";
import { createDatabaseForm } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { AddIcon } from "../../components/LoadFontAwesome"
import { EDIT } from '../../labels/iconLabels'

const Details = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();

	const fields = (opts) => {
        return (
            <FormGroup check className="mb-3 mt-3">
              <Label check>
                <Input type="radio" name={opts.name} />{' '}
                    {opts.label}
                <FormText color="muted">
                    {opts.description}
                </FormText>
              </Label>
            </FormGroup>
        )
    }
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);

	// junk data
	const dbStats = PRIVATE.label;
	const clStats = CLONE.label;

    return (
        <Card>
            <div>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<AddIcon icon={EDIT} className="d-f-ctrl"/>
				<form onSubmit={handleSubmit()}>
	            	<label className = { createDatabaseForm.id.label.className }
	                    htmlFor = { createDatabaseForm.id.label.htmlFor }>
	            		{ createDatabaseForm.id.label.text }
	                </label>
	            	<input placeholder={ createDatabaseForm.id.input.placeholder }
	                    className = { createDatabaseForm.id.input.className }
	            		name = { createDatabaseForm.id.input.name }
						value = {getCurrentDBID(dbClient)}
	            		ref = { register({ validate: value => value.length > 0}) }/>

	            		   { errors.databaseID &&
	            			   <p className = { createDatabaseForm.id.error.className }>
	            			   { createDatabaseForm.id.error.text }</p>}

	            	<label className = { createDatabaseForm.databaseName.label.className }
	            	   htmlFor = { createDatabaseForm.databaseName.label.htmlFor }>
	            	   { createDatabaseForm.databaseName.label.text }
	                </label>
	            	<input name= { createDatabaseForm.databaseName.input.name }
	            	   className = { createDatabaseForm.databaseName.input.className }
	            	   placeholder = { createDatabaseForm.databaseName.input.placeholder }
					   value = {getCurrentDBName(dbClient)}
	            	   ref = { register({ validate: value => value.length > 0}) }/>

	            		   { errors.databaseName &&
	            			   <p className = { createDatabaseForm.databaseName.error.className }>
	            			   { createDatabaseForm.databaseName.error.text }</p>}

	            	<label className = { createDatabaseForm.databaseDescr.label.className }
	            	   htmlFor = { createDatabaseForm.databaseDescr.label.htmlFor }>
	            	   { createDatabaseForm.databaseDescr.label.text }
	            	</label>

	                <textarea name= { createDatabaseForm.databaseDescr.input.name }
	            	   className = { createDatabaseForm.databaseDescr.input.className }
	            	   placeholder = { createDatabaseForm.databaseDescr.input.placeholder }
	                   ref={register} />

					<hr className = "my-space-25"/>
					<hr className = "my-2"/>
					<hr className = "my-space-25"/>

					{isAuthenticated &&
						<span className="d-fl">
		   				     <Col md={1} className="mb-1">
		   		                 <input type="radio"
		   		                    name={ PRIVATE.name }
		   		                    checked={dbStats === PRIVATE.label}/>
		   					</Col>
		   					<Col md={3} className="mb-3">
		   						<label htmlFor = { PRIVATE.name }/>
		   	   						{ PRIVATE.label }
		   					</Col>
		   					<Col md={1} className="mb-1">
		   						<input type="radio"
		   						   checked={dbStats === PUBLIC.label}
		   						   name={ PUBLIC.name }/>
		   					</Col>
		   				   <Col md={4} className="mb-4">
		   					   <label htmlFor = { PUBLIC.name }/>
		   	  						{ PUBLIC.label }
		   				   </Col>
	                   </span>

					}

					<hr className = "my-space-25"/>
					<hr className = "my-2"/>
					<hr className = "my-space-25"/>

					{isAuthenticated &&
						<span className="d-fl">
		   				     <Col md={1} className="mb-1">
		   		                 <input type="radio"
		   		                    name={ ORIGIN.name }
		   		                    checked={clStats === ORIGIN.label}/>
		   					</Col>
		   					<Col md={3} className="mb-3">
		   						<label htmlFor = { ORIGIN.name }/>
		   	   						{ ORIGIN.label }
		   					</Col>
		   					<Col md={1} className="mb-1">
		   						<input type="radio"
		   						   checked={clStats === CLONE.label}
		   						   name={ CLONE.name }/>
		   					</Col>
		   				   <Col md={4} className="mb-4">
		   					   <label htmlFor = { CLONE.name }/>
		   	  						{ CLONE.label }
		   				   </Col>
	                   </span>

					}

					<hr className = "my-space-15"/>

	            	<button className = { createDatabaseForm.action.className }
	        		    type =  { createDatabaseForm.action.type } >
	        			{ createDatabaseForm.action.text }
	            	</button>
	            </form>

			    <CategoryHeading category = {DATABASE_IS}/>
                <Col md={12}>
    	        	<FormGroup tag="fieldset">
    			        {fields(CLONE)}
                        {fields(ORIGIN)}
    		        </FormGroup>
                    <hr/>
    			</Col>
				<CategoryHeading category = {DATABASE_ACCESS}/>
                <Col md={12}>
    	        	<FormGroup tag="fieldset">
    			        {fields(PRIVATE)}
                        {fields(PUBLIC)}
    		        </FormGroup>
                    <hr/>
    			</Col>
				<CategoryHeading category = {DATABASE_ACTIONS}/>
                <Col md={12}>
                    <hr class='my-space'/>
                    <FormText color="muted">
                        {ACTIONS.description}
                    </FormText>
                    <hr class='my-space'/>
                    <Row>
                        <Col md={2}>
                            <Button color="primary" onClick={console.log('do something on push')}
                                    style={{ marginBottom: '1rem' }}>Push</Button>
                        </Col>
                        <Col md={2}>
                            <Button color="primary" onClick={console.log('do something on pull')}
                                    style={{ marginBottom: '1rem' }}>Pull</Button>
                        </Col>
                    </Row>
                </Col>
            </div>
        </Card>
    )
}

export default Details;
