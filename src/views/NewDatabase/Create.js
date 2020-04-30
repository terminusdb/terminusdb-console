import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import Select from "react-select";
import { useAuth0} from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { createDatabaseForm } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import NavBar from '../../components/NavBar'
import { APICallsHook } from "../../hooks/APICallsHook"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { LIST_OF_DATABASE_ID } from "../../labels/queryLabels";
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { isObject } from "../../utils/helperFunctions";
import { QueryHook } from "../../hooks/QueryHook";
//import { getDBIdsForSelectOptions } from "../../utils/dataFormatter";
import { WOQLClientObj } from "../../init/woql-client-instance";


const CreateDB = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [dbLocation, setDBLoction] = useState(CREATE_DB_LOCAL);

  const [dbInfo, updateDbInfo] = useState({});

  //const {woqlClient} = WOQLClientObj();
  
  const [values, setReactSelect] = useState({
    selectedOption: []
  });

  const [dataResponse, loading] = APICallsHook(CREATE_DATABASE,
                                              null,
                                              dbInfo);

  const [dbList] = QueryHook(LIST_OF_DATABASE_ID);

  const onSubmit = (data) => {
    
	  if((dbLocation === CREATE_TERMINUS_DB) &&(!user)) {
		  loginWithRedirect();  // authenticate
	  }

      let doc = {id: data.databaseID,
                 title: data.databaseName,
                 description:data.databaseDescr}
      updateDbInfo(doc)
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
