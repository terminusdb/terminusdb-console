import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import Select from "react-select";
import { useAuth0} from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { cloneRemoteDB } from "../../variables/formLabels"
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

const CloneRemoteDB = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [isDbHub, setCloneFromHub] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const [dbInfo, updateDbInfo] = useState({});
  const [dbClient] = useGlobalState(TERMINUS_CLIENT);
  const [values, setReactSelect] = useState('');

  const [selectedDB, setSelectedDB] = useState('');
  const [isTerminusDBChosen, setTerminusDB] = useState(false);

  const [dataResponse, loading] = APICallsHook(CREATE_DATABASE,
                                              null,
                                              dbInfo);

  const [dbList] = QueryHook(LIST_OF_DATABASE_ID);

  const onSubmit = (data) => {
      let doc = {id: data.databaseID,
                 title: data.databaseName,
                 description:data.databaseDescr}
      updateDbInfo(doc)
  };


  const handleTerminusDBInput = (ev) => {
	  var url = ev.target.value;
	  if(url.includes('https://terminusdb/'))
      	  setTerminusDB(true)
	  else setTerminusDB(false)
  }

  return (
  		<>
            <hr className = "my-space-15"/>
            <form onSubmit={handleSubmit(onSubmit) }>

                <label className = { cloneRemoteDB.cloneRemote.label.className }
                       htmlFor = { cloneRemoteDB.cloneRemote.label.htmlFor }>
                       { cloneRemoteDB.cloneRemote.label.text }
                </label>

                <input placeholder={ cloneRemoteDB.cloneRemote.input.placeholder }
                       className = { cloneRemoteDB.cloneRemote.input.className }
                       name = { cloneRemoteDB.cloneRemote.input.name }
                       onChange = { handleTerminusDBInput }
                       ref = { register({ validate: value => value.length > 0}) }/>

                <hr className = "my-space-50"/>

				<label className = { cloneRemoteDB.APIKey.label.className }
					   htmlFor = { cloneRemoteDB.APIKey.label.htmlFor }>
					   { cloneRemoteDB.APIKey.label.text }
				</label>

				{isTerminusDBChosen && <>
					<input name= { cloneRemoteDB.APIKey.input.name }
						   className = { cloneRemoteDB.APIKey.input.className }
						   placeholder = { cloneRemoteDB.APIKey.input.placeholder }
						   disabled
						   ref = { register({ validate: value => value.length > 0}) }/> </>
				}
				{!(isTerminusDBChosen) && <>
					<input name= { cloneRemoteDB.APIKey.input.name }
						   className = { cloneRemoteDB.APIKey.input.className }
						   placeholder = { cloneRemoteDB.APIKey.input.placeholder }
						   ref = { register({ validate: value => value.length > 0}) }/>

						   { errors.APIKey &&
							   <p className = { cloneRemoteDB.APIKey.error.className }>
							   { cloneRemoteDB.APIKey.error.text }</p>} </>
				}

                 <label className = { cloneRemoteDB.id.label.className }
                            htmlFor = { cloneRemoteDB.id.label.htmlFor }>
                            { cloneRemoteDB.id.label.text }
                      </label>
                     <input placeholder={ cloneRemoteDB.id.input.placeholder }
                            className = { cloneRemoteDB.id.input.className }
                            name = { cloneRemoteDB.id.input.name }
                            ref = { register({ validate: value => value.length > 0}) }/>

                    { errors.databaseID &&
                        <p className = { cloneRemoteDB.id.error.className }>
                        { cloneRemoteDB.id.error.text }</p>} 

                <hr className = "my-space-15"/>

            	<button className = { cloneRemoteDB.action.className }
            		    type =  { cloneRemoteDB.action.type } >
            			{ cloneRemoteDB.action.text }
            	</button>
            </form>
          </>)
}

export default CloneRemoteDB;
