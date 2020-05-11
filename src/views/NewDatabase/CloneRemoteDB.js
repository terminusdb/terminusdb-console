import React, {useState} from "react";
import { Col } from "reactstrap";
import Loading from "../../components/Loading";
import { cloneRemoteDB } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';

const CloneRemoteDB = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [dbInfo, updateDbInfo] = useState({});

  const [isTerminusDBChosen, setTerminusDB] = useState(false);

  const onSubmit = (data) => {
	  if (!user){
		  loginWithRedirect();  // authenticate
	  }
      let doc = { id: data.databaseID }
      updateDbInfo(doc)
  };

  const handleTerminusDBInput = (ev) => {
	  var url = ev.target.value;
	  if(url.includes('http://terminusdb.com'))
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
			   { errors.cloneRemote &&
					<p className = { cloneRemoteDB.cloneRemote.error.className }>
						{ cloneRemoteDB.cloneRemote.error.text }</p>}
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
					   ref = { register({ validate: value => value.length > 0}) }/> </>}
				{!(isTerminusDBChosen) && <>
					<input name= { cloneRemoteDB.APIKey.input.name }
					   className = { cloneRemoteDB.APIKey.input.className }
					   placeholder = { cloneRemoteDB.APIKey.input.placeholder }
					   ref = { register({ validate: value => value.length > 0}) }/>
					   { errors.APIKey &&
						   <p className = { cloneRemoteDB.APIKey.error.className }>
						   { cloneRemoteDB.APIKey.error.text }</p>} </>}
                 <label className = { cloneRemoteDB.id.label.className }
	                   htmlFor = { cloneRemoteDB.id.label.htmlFor }>
	                   { cloneRemoteDB.id.label.text }
                  </label>
                 <input placeholder={ cloneRemoteDB.id.input.placeholder }
                    className = { cloneRemoteDB.id.input.className }
                    name = { cloneRemoteDB.id.input.name }
                    ref = { register }/>
                <hr className = "my-space-15"/>
            	<button className = { cloneRemoteDB.action.className }
        		    type =  { cloneRemoteDB.action.type } >
        			{ cloneRemoteDB.action.text }
            	</button>
            </form> </>)
}

export default CloneRemoteDB;
