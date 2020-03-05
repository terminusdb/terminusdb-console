import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import Select from "react-select";
import { useAuth0} from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { cloneLocalDB } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import NavBar from '../../components/NavBar'
import { APICallsHook } from "../../hooks/APICallsHook"
import { CREATE_DATABASE } from "../../labels/apiLabels"
import { CREATE_LOCAL_TAB, CREATE_CLONE_TAB, CREATE_HUB_TAB } from "../../labels/tabLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { LIST_OF_DATABASE_ID } from "../../labels/queryLabels";
import { isObject } from "../../utils/helperFunctions";
import { useGlobalState } from "../../init/initializeGlobalState";
import { QueryHook } from "../../hooks/QueryHook";
import { getDBIdsForSelectOptions } from "../../utils/dataFormatter";

const CloneLocalDB = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [dbInfo, updateDbInfo] = useState({});
  const [dbClient] = useGlobalState(TERMINUS_CLIENT);
  const [values, setReactSelect] = useState('');

  const [selectedDB, setSelectedDB] = useState('');
  const [isTerminusDBChosen, chooseTerminusDB] = useState(false);

  const [dataResponse, loading] = APICallsHook(CREATE_DATABASE,
                                              null,
                                              dbInfo);

  const [dbList] = QueryHook(LIST_OF_DATABASE_ID);

  const onSubmit = (data) => {
	  if (!user){
		  loginWithRedirect();  // authenticate
	  }
      let doc = {id: data.databaseID}
      updateDbInfo(doc)
  };


  const handleSelect = (ev) => {
      setSelectedDB(ev.value)
      setReactSelect(ev.value)
      chooseTerminusDB(false)
  }

  return (
  		<>
            <hr className = "my-space-50"/>
            <form onSubmit={handleSubmit(onSubmit) }>

                <span className="d-fl">
                    <Col md={3} className="mb-3">
                        <label className = { cloneLocalDB.cloneSelect.label.className }
                           htmlFor = { cloneLocalDB.cloneSelect.label.htmlFor }>
                           { cloneLocalDB.cloneSelect.label.text}
                        </label>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Select className= { cloneLocalDB.cloneSelect.select.className }
                                name= { cloneLocalDB.cloneSelect.select.name }
                                placeholder= { cloneLocalDB.cloneSelect.select.placeholder }
                                onChange={ handleSelect }
                                options={dbList.columnData}/>
                    </Col>

                 </span>

                 <hr className = "my-2"/>

				 {(selectedDB.length > 0)  && <>
                     <label className = { cloneLocalDB.id.label.className }
                            htmlFor = { cloneLocalDB.id.label.htmlFor }>
                            { cloneLocalDB.id.label.text }
                      </label>
                     <input placeholder={ cloneLocalDB.id.input.placeholder }
                            className = { cloneLocalDB.id.input.className }
                            name = { cloneLocalDB.id.input.name }
                            ref = { register({ validate: value => value.length > 0}) }/>

                            { errors.databaseID &&
                                <p className = { cloneLocalDB.id.error.className }>
                                { cloneLocalDB.id.error.text }</p>} </>
                 }


            	<button className = { cloneLocalDB.action.className }
            		    type =  { cloneLocalDB.action.type } >
            			{ cloneLocalDB.action.text }
            	</button>
            </form>
          </>)
}

export default CloneLocalDB;
