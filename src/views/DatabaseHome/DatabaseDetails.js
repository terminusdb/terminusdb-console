import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { CLONE, MASTER, PRIVATE, PUBLIC, ACTIONS } from "../../variables/databaseHomeLabels"
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { createDatabaseForm, database, size } from "../../variables/formLabels"
import {printts, DATETIME_FULL} from "../../utils/dateFormats"
import { WOQLClientObj } from "../../init/woql-client-instance";

const Details = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();

    const commitInfo = props.commitInfo || {}
     //commitInfo
	// junk data, placeholders for now apply logic later
	const dbStats = PRIVATE.label;
	const clStats = CLONE.label;
	const dbSize = '1092 triples';
	const dbCreated = props.created || false;
	const formattedCreateDate = printts(dbCreated, DATETIME_FULL)
	const dbModifiedBy = commitInfo.author || false;
	const dbModifiedDate = commitInfo.time || false;
	const formattedDbModifiedDate = printts(dbModifiedDate, DATETIME_FULL)
	const dbCommitMsg = commitInfo.message || false;
    const {woqlClient} = WOQLClientObj();

    return (
        <Card>
            <div>
			    <hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<form onSubmit={handleSubmit()}>
	                <label className = { createDatabaseForm.id.label.className } htmlFor = "database-id">
	            		{ createDatabaseForm.id.label.text }
	                </label>
	            	<input placeholder={ createDatabaseForm.id.input.placeholder }
	                    className = { createDatabaseForm.id.input.className }
                        name = "database-id"
                        readOnly
						value = {woqlClient.db()}
	            		ref = { register({ validate: value => value.length > 0}) }/>
                    {errors.databaseID &&
                        <p className = { createDatabaseForm.id.error.className }>
                            { createDatabaseForm.id.error.text }
                        </p>
                    }
	            	<label className = { createDatabaseForm.databaseName.label.className } htmlFor = "database-name">
	            	    { createDatabaseForm.databaseName.label.text }
	                </label>
	            	<input name= "database-name" value = {getCurrentDBName(woqlClient)}
                       className = { createDatabaseForm.databaseName.input.className }
                       readOnly
	            	   placeholder = { createDatabaseForm.databaseName.input.placeholder }
	            	   ref = { register({ validate: value => value.length > 0}) }/>
                    { errors.databaseName &&
                        <p className = { createDatabaseForm.databaseName.error.className }>
                            { createDatabaseForm.databaseName.error.text }
                        </p>
                    }
	            	<label className = { createDatabaseForm.databaseDescr.label.className } htmlFor = "database-description">
	            	   { createDatabaseForm.databaseDescr.label.text }
	            	</label>

					<textarea name = "database-description"
                        className = { createDatabaseForm.databaseDescr.input.className }
                        readOnly
	            	    placeholder = { createDatabaseForm.databaseDescr.input.placeholder }
	                    ref={register} />

				{isAuthenticated && <>
						<hr className = "my-space-25"/>
						<hr className = "my-2"/>
						<hr className = "my-space-25"/>
						<span className="d-fl">
		   				     <Col md={1} className="mb-1">
                                <input type="radio"
                                    readOnly
		   		                    name="database-radio-private"
		   		                    checked={dbStats === PRIVATE.label}/>
		   					</Col>
		   					<Col md={3} className="mb-3">
		   						<label htmlFor = "database-radio-private">
		   	   						{ PRIVATE.label }
								</label>
		   					</Col>
		   					<Col md={1} className="mb-1">
		   						<input type="radio" readOnly checked={dbStats === PUBLIC.label} name="database-radio-public"/>
		   					</Col>
		   				    <Col md={4} className="mb-4">
		   					    <label htmlFor= "database-radio-public">
		   	  				        { PUBLIC.label }
							   </label>
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
                                <input readOnly type="radio" name="database-master" checked={clStats === MASTER.label}/>
                            </Col>
                            <Col md={3} className="mb-3">
                                <label htmlFor = "database-master">
                                    { MASTER.label }
                                </label>
                            </Col>
                            <Col md={3} className="mb-3">
                                <input readOnly placeholder={ database.master.placeholder }
                                    name = "database-master-name"
                                    className = { database.master.className }
                                    ref = { register }/>
                            </Col>
                        </span>
					}

					{isAuthenticated &&
						<span className="d-fl">
		   					<Col md={1} className="mb-1">
		   						<input readOnly type="radio" checked={clStats === CLONE.label} name = "database-clone"/>
		   					</Col>
		   				   <Col md={3} className="mb-3">
		   					   <label htmlFor = "database-clone">
		   	  						{ CLONE.label }
							   </label>
		   				   </Col>
						   <Col md={3} className="mb-3">
							   <input readOnly placeholder={ database.clone.placeholder }
								   className = { database.clone.className }
                                   name = "database-clone-name"
                                   ref = { register }/>
						   </Col>
	                   </span>

					}

					<hr className = "my-space-25"/>
					<hr className = "my-2"/>
                    <span className="d-fl">
					    <Col md={2} className="mb-2">
							<label htmlFor = "database-size">
								{ database.size.label }
							</label>
						</Col>
					    <Col md={3} className="mb-3">
							<span name="database-size">
								{ dbSize }
							</span>
					    </Col>
				    </span>

				    <hr className = "my-2"/>

                    <span className="d-fl">
					    <Col md={2} className="mb-2">
						    <label htmlFor = "database-created-by">
							   { database.createdBy.label }
							</label>
					    </Col>
					    <Col md={6} className="mb-6">
						    <span name="database-created-by">
							   { formattedCreateDate }
					        </span>
					    </Col>
				    </span>

                    <hr className = "my-2"/>

                    <span className="d-fl">
					    <Col md={2} className="mb-2">
						    <label htmlFor = "database-modified-by">
							    { database.lastModifiedBy.label }
                            </label>
                        </Col>
					    <Col md={6} className="mb-6">
                            { dbModifiedBy + ', ' + formattedDbModifiedDate}
    					</Col>
				    </span>

				    <span className="d-fl">
					    <Col md={2} className="mb-2"/>
					    <Col md={6} className="mb-6">
                            { dbCommitMsg }
					    </Col>
				    </span>
	            </form>
           </div>
       </Card>
    )
}

export default Details;
