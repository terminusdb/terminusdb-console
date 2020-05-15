import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import Select from "react-select";
import Loading from "../../components/Loading";
import { cloneLocalDB } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import { isObject } from "../../utils/helperFunctions";
import { WOQLClientObj } from "../../init/woql-client-instance";
import * as view from "../../labels/createView"

const CloneLocalDB = (props) => {
	const {woqlClient} = WOQLClientObj();

	const { register, handleSubmit, errors } = useForm();
	const [dbInfo, updateDbInfo] = useState({});
	const [values, setReactSelect] = useState('');

	const [selectedDB, setSelectedDB] = useState('');
	const [isTerminusDBChosen, chooseTerminusDB] = useState(false);

	const [dataProvider, setDataProvider] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	  if(isObject(woqlClient)){
		  const recs = woqlClient.connection.getServerDBMetadata();
		  let opts = [];
		  recs.map((items) => {
			  opts.push({value: items.db, label: items.title})
		  })
		  setDataProvider({data:opts});
		  setLoading(false);
	  }
	}, [woqlClient]);

	const onSubmit = (data) => {
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
			{ loading && <Loading /> }
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
	                         options={dataProvider.data}/>
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
