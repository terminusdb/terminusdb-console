import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { CLONE, MASTER, PRIVATE, PUBLIC, ACTIONS } from "../../variables/databaseHomeLabels"
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { useGlobalState } from "../../init/initializeGlobalState";
import { createDatabaseForm, database, size } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { format } from "date-fns";

const Details = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();

	const [dbClient] = useGlobalState(TERMINUS_CLIENT);
     //commitInfo
	// junk data, placeholders for now apply logic later
	const dbStats = PRIVATE.label;
	const clStats = CLONE.label;
	const dbSize = '1092 triples';
	const dbCreated = props.created || false;
	const formattedCreateDate = format(new Date(dbCreated*1000), "yyyy-MMM-dd hh:mm:ss a")
	const dbModifiedBy = props.commitInfo.author || false;
	const dbModifiedDate = props.commitInfo.time || false;
	const formattedDbModifiedDate = format(new Date(dbModifiedDate*1000), "yyyy-MMM-dd hh:mm:ss a")
	const dbCommitMsg = props.commitInfo.message || false;

    return (
        <Card>
            <div>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
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

					{isAuthenticated && <>
						<hr className = "my-space-25"/>
						<hr className = "my-2"/>
						<hr className = "my-space-25"/>
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
					   <hr className = "my-space-25"/>
   					   <hr className = "my-2"/>
   					   <hr className = "my-space-25"/>
					   </>
					}

					{isAuthenticated &&
						<span className="d-fl">
		   				     <Col md={1} className="mb-1">
		   		                 <input type="radio"
		   		                    name={ MASTER.name }
		   		                    checked={clStats === MASTER.label}/>
		   					</Col>
		   					<Col md={3} className="mb-3">
		   						<label htmlFor = { MASTER.name }/>
		   	   						{ MASTER.label }
		   					</Col>
							<Col md={3} className="mb-3">
								<input placeholder={ database.master.placeholder }
									className = { database.master.className }
									name = { database.master.name }
									ref = { register }/>
		   					</Col>
	                   </span>

					}

					{isAuthenticated &&
						<span className="d-fl">
		   					<Col md={1} className="mb-1">
		   						<input type="radio"
		   						   checked={clStats === CLONE.label}
		   						   name={ CLONE.name }/>
		   					</Col>
		   				   <Col md={3} className="mb-3">
		   					   <label htmlFor = { CLONE.name }/>
		   	  						{ CLONE.label }
		   				   </Col>
						   <Col md={3} className="mb-3">
							   <input placeholder={ database.clone.placeholder }
								   className = { database.clone.className }
								   name = { database.clone.name }
								   ref = { register }/>
						   </Col>
	                   </span>

					}

					<hr className = "my-space-25"/>
					<hr className = "my-2"/>

					<span className="d-fl">
						<Col md={2} className="mb-2">
							<label htmlFor = { database.size.name }/>
								{ database.size.label }
						</Col>
					   <Col md={3} className="mb-3">
						   <label htmlFor/>
								{ dbSize }
					   </Col>
				   </span>

				   <hr className = "my-2"/>

				   <span className="d-fl">
					   <Col md={2} className="mb-2">
						   <label htmlFor = { database.createdBy.name }/>
							   { database.createdBy.label }
					   </Col>
					  <Col md={6} className="mb-6">
						  <label htmlFor/>
							   { formattedCreateDate }
					  </Col>
				  </span>

				  <hr className = "my-2"/>

				  <span className="d-fl">
					  <Col md={2} className="mb-2">
						  <label htmlFor = { database.lastModifiedBy.name }/>
							  { database.lastModifiedBy.label }
					  </Col>
					 <Col md={6} className="mb-6">
						 <label htmlFor/>
							  { dbModifiedBy + ', ' + formattedDbModifiedDate}
					 </Col>
				 </span>

				 <span className="d-fl">
					 <Col md={2} className="mb-2"/>
					<Col md={6} className="mb-6">
						<label htmlFor/>
							 { dbCommitMsg }
					</Col>
				</span>
	          </form>

           </div>
       </Card>
    )
}

export default Details;
