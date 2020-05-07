import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { Report } from "../../components/Reports/Report"
import { createDatabaseForm } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { isObject } from "../../utils/helperFunctions";
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";

const CreateDB = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [dbLocation, setDBLoction] = useState(CREATE_DB_LOCAL);
  const [rep, setReport] = useState({});
  const [dbInfo, updateDbInfo] = useState({});
  const [dbId, updateDbId] = useState(tag.BLANK)

  const [loading, setLoading] = useState(false);

  const {woqlClient} = WOQLClientObj();

  useEffect(() => {
	  if(isObject(dbInfo)){
		  let acc = woqlClient.account() || woqlClient.uid();
		  woqlClient.createDatabase(dbId , dbInfo, acc)
		  .then((cresults) => {
			  let message = "Successfully created database " + dbId;
			  setReport({message: message, status: reportAlert.SUCCESS});
              setLoading(false);
		  })
		  .catch((err) => {
			 setReport({error: err, status: reportAlert.ERROR});
		  })
	  }
  }, [dbInfo]);

  const onSubmit = (data) => {
	if((dbLocation === CREATE_TERMINUS_DB) &&(!user)) {
		loginWithRedirect();  // authenticate
	}
	let doc = {label: data.databaseName,
	   comment: data.databaseDescr,
	   base_uri: "http://local.terminusdb.com/" + data.id + "/data"}
	updateDbId(data.databaseID) ;
    updateDbInfo(doc)
    setLoading(true);
  };

  const setLocalDB = (ev) => {
	  setDBLoction(CREATE_DB_LOCAL);
  }

  const setTerminusDB = (ev) => {
	  setDBLoction(CREATE_TERMINUS_DB);
  }

  return (
  		<>
            <hr className = "my-space-15"/>
			{isObject(rep) && <Report report = { rep }/>}
            { loading && <Loading /> }
            <form onSubmit={handleSubmit(onSubmit) }>
            	<label className = { createDatabaseForm.id.label.className }
                    htmlFor = { createDatabaseForm.id.label.htmlFor }>
            		{ createDatabaseForm.id.label.text + ' *' }
                </label>
            	<input placeholder={ createDatabaseForm.id.input.placeholder }
                    className = { createDatabaseForm.id.input.className }
            		name = { createDatabaseForm.id.input.name }
            		ref = { register({ validate: value => value.length > 0}) }/>

            		   { errors.databaseID &&
            			   <p className = { createDatabaseForm.id.error.className }>
            			   { createDatabaseForm.id.error.text }</p>}

            	<label className = { createDatabaseForm.databaseName.label.className }
            	   htmlFor = { createDatabaseForm.databaseName.label.htmlFor }>
            	   { createDatabaseForm.databaseName.label.text + ' *' }
                </label>
            	<input name= { createDatabaseForm.databaseName.input.name }
            	   className = { createDatabaseForm.databaseName.input.className }
            	   placeholder = { createDatabaseForm.databaseName.input.placeholder }
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

				 <hr className = "my-space-15"/>

				 <span className="d-fl">
				     <Col md={1} className="mb-1">
		                 <input type="radio"
		                    name={ createDatabaseForm.createLocally.label.name }
		                    checked={dbLocation === CREATE_DB_LOCAL}
		                    onChange={ setLocalDB } />
					</Col>
					<Col md={3} className="mb-3">
						<label className = { createDatabaseForm.createLocally.label.className }
	   						htmlFor = { createDatabaseForm.createLocally.label.htmlFor }/>
	   						{ createDatabaseForm.createLocally.label.text }
					</Col>
					<Col md={1} className="mb-1">
						<input type="radio"
						   checked={dbLocation === CREATE_TERMINUS_DB}
						   name={ createDatabaseForm.createTerminusDb.label.name }
						   onChange={ setTerminusDB } />
					</Col>
				   <Col md={4} className="mb-4">
					   <label className = { createDatabaseForm.createTerminusDb.label.className }
	  						htmlFor = { createDatabaseForm.createTerminusDb.label.htmlFor }/>
	  						{ createDatabaseForm.createTerminusDb.label.text }
				   </Col>
                </span>
                <hr className = "my-space-15"/>

            	<button className = { createDatabaseForm.action.className }
        		    type =  { createDatabaseForm.action.type } >
        			{ createDatabaseForm.action.text }
            	</button>
            </form>
          </>)
}

export default CreateDB;
