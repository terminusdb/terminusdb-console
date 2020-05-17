import React from 'react'
import { useForm } from 'react-hook-form'
import { REQUIRED_FIELD, REQUIRED_FIELD_CSS} from "./constants"

/**
* Library of Terminus Console (TC) form patterns
*/

export const TCForm = ({onSubmit, elements, children}) => {
    return (
        <form onSubmit={handleSubmit(onSubmit) }>
            {elements}
            {children}   
        </form>     
    )
}

export const TCFormSection = ({section, title, cname, tcname, children}) => {
    return (
        <Container className={cname}>
            {title &&
                <span className={tcname}>{title}</span>
            }
            {children}
        </Container>
    )
}

export const TCFormSubmits = ({section, title, cname, tcname, children}) => {
    
    return (<form onSubmit={handleSubmit(onSubmit) }>
    <Container>
        <Row>
            <button type="cancel" className={createGraphText.cancelButtonClassName}>
                    {createGraphText.cancelButtonText}
            </button><span style={{"padding-right": 10}}>&nbsp;</span>
            <button type="submit" className={createGraphText.createButtonClassName}>
                    {createGraphText.createButtonText}
            </button>
        </Row>
        <Row>
            <Col>{typeField}</Col><Col>{idField}</Col>
        </Row>
    </Container>
</form>)
            
}



export const TCFormField = ({field_id, error, meta, className, children}) => {
    let show_label = typeof meta.label == "string"
    return (
        <span className={className}>
            {show_label && 
                <TCFieldLabel
                    field_id={field_id}
                    label={meta.label}
                    mandatory = {meta.mandatory}
                    className= {meta.labelClassName} />
            }
            {meta.input && 
                <TCFormInput field_id={field_id} meta={meta} />                                      
            }
            {meta.textarea && 
            
            }
        </span>
    )
}

export const TCFormInput = ({field_id, value, meta}) =>    {
    let refargs
    if(meta.mandatory){
        refargs = { validate: value => value.length > 0}
    }
    else if(meta.validate){
        refargs = { validate: value => meta.validate(value)}
    }
    return (
        <input
            placeholder={ ph }
            className = {createGraphText.inputClassName }
            defaultValue={val}
            name = {field_id}
            ref = { register(refargs) }/>
    )
}

export const TCFormTextarea = ({field_id, value, meta}) =>    {

}

return(<Select placeholder = {ph}
    className = {createGraphText.selectClassName}
    ref={register}
    options = {[
        {label: "Data", value: "instance"}, 
        {label: "Schema",  value: "schema"}, 
        {label: "Inference", value: "inference"}]}
    />
)        



export const TCFieldLabel = ({field_id, label, mandatory, className}) => {
    className = className || "form"
    return (
        <label className={className} htmlFor={field_id}>
            {label} 
            {mandatory && 
                <TCMandatory />
            }                 
        </label>
    )
}


export const TCMandatory = () => {
    return (<strong 
        title={REQUIRED_FIELD} 
        style={{"color": "red"}} 
        className={REQUIRED_FIELD_CSS}>
            * 
    </strong>)
}

function TCFieldErrors(field_id, emsg){
    if(errors[field_id]){
        return (
            <p className = {createDBText.errorClassName}>
                {meta.label + " " + createDBText.requiredField}
            </p>
        )
    }
    if(meta.help){
        return (
            <><HelpCowDuck text={meta.help} id={meta.label}/>
           { /*<p className = {createDBText.helpClassName}>
                {meta.help}
            </p>*/}</>
        )
    }
    return null
}



function generateFormField(field_id, meta){
    let x = generateFieldLabel(field_id, meta)
    let y =  generateFieldInput(field_id, meta)
    let z =  generateFieldPrompt(field_id, meta)
    return (
        <span class='form-field'>
            <span className="d-fl">
                <Col md={10} className="mb-10">{x}</Col>
                <Col md={2} className="mb-2 adjust-help-text">{z}</Col>
           </span>
           {y}
        </span>
    )
}



const onSubmit = (data) => {
    
    data.accountid = data.accountid || woqlClient.account() || woqlClient.uid()
    if(!data.data_url || data.data_url == "default"){
        data.data_url = getDefaultDocURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
    }
    if(!data.schema_url || data.schema_url == "default"){
        data.schema_url = getDefaultScmURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
    }
    let doc = {
        label: data.dbname,
        comment: data.description,
        base_uri: data.data_url,
        prefixes: {scm: data.schema_url}
    }
    setLoading(true)
    doCreate(data.dbid, doc, data.accountid, data.schema, data.instance)
}

import React, { useState } from "react";
import { HistoryNavigator } from "../../components/HistoryNavigator/HistoryNavigator"
import { WOQLClientObj } from "../../init/woql-client-instance";
import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import Loading from "../../components/Loading";
import { createGraphText } from "../../variables/formLabels"

const CreateBranch = (props) => {
    const {woqlClient} = WOQLClientObj();

    const onCreateBranch = (data) => {
        woqlClient.branch(data.bid, data.uri_prefix)
        .then(() => {
            //report some success
        })
        .catch((e) => {

        }
    }

    function handleBranch(){
        let nuid = newBranch.value
        props.onBranch(nuid)
    }

    function headChanged(b, r){
    }


                 
    function generateFieldInput(field_id, meta){
        if(field_id == "gid"){
            let ph = meta.placeholder || ""
            let val = dbInfo[field_id] || ""
            return (
                <input
                    placeholder={ ph }
                    className = {createGraphText.inputClassName }
                    defaultValue={val}
                    name = {field_id}
                    ref = { register({ validate: value => value.length > 0}) }/>
            )                   
        }
        if(field_id == "gtype"){
            let ph = meta.placeholder || ""
            return(<Select placeholder = {ph}
                className = {createGraphText.selectClassName}
                ref={register}
                options = {[
                    {label: "Data", value: "instance"}, 
                    {label: "Schema",  value: "schema"}, 
                    {label: "Inference", value: "inference"}]}
                />
            )        
        }
    }

    <Label><b>Create New Branch</b></Label>
			 <hr className = "my-space-25"/>
			 <HistoryNavigator  onHeadChange={headChanged} />



             
             export const CreateGraph = ({onCancel, onCreate}) => {
             
                 const { register, handleSubmit, errors } = useForm();
             
                 const [dbInfo, setDbInfo] = useState({gid: "", gtype: ""});
             

             
                 function generateFieldPrompt(field_id, meta){
                     if(errors[field_id]){
                         return (
                             <p className = {createGraphText.errorClassName}>
                                 {meta.label + " " + createGraphText.requiredField} 
                             </p>
                         )
                     }
                     if(meta.help){
                         return (
                             <p className = {createGraphText.helpClassName}>
                                 {meta.help} 
                             </p>
                         )
                     }
                     return null
                 }
             
                 function generateFormField(field_id, meta){
                     let x = generateFieldLabel(field_id, meta)
                     let y =  generateFieldInput(field_id, meta)
                     let z =  generateFieldPrompt(field_id, meta)
                     return (
                         <span class='form-field'>{x}{y}{z}</span>
                     )
                 }
             
                 function onSubmit(data){
                     alert(JSON.stringify(data))
                 }
             
                 let typeField = generateFormField("gtype", createGraphText.fields.gtype)
                 let idField = generateFormField("gid", createGraphText.fields.gid)
             
                 function showMandatory(label){
                     return (<strong 
                         title={label + " " + createGraphText.requiredField} 
                         style={{"color": "red"}} 
                         className={createGraphText.errorClassName}>
                             * 
                     </strong>)
                 }
             
             
                 return (<form onSubmit={handleSubmit(onSubmit) }>
                     <Container>
                         <Row>
                             <button type="cancel" className={createGraphText.cancelButtonClassName}>
                                     {createGraphText.cancelButtonText}
                             </button><span style={{"padding-right": 10}}>&nbsp;</span>
                             <button type="submit" className={createGraphText.createButtonClassName}>
                                     {createGraphText.createButtonText}
                             </button>
                         </Row>
                         <Row>
                             <Col>{typeField}</Col><Col>{idField}</Col>
                         </Row>
                     </Container>
                 </form>)
             }             



             return (
                <>{(!loading) && <Alert color="success">
                   Successfully created new User - <b>{userInfo.id}</b>
                 </Alert>}
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <label htmlFor = { createUser.id.label.htmlFor }>
                       { createUser.id.label.text }
                   </label>
                   <input placeholder={ createUser.id.input.placeholder }
                       className = { createUser.id.input.className }
                       name = { createUser.id.input.name }
                       ref = { register({ validate: value => value.length > 0}) }/>
   
                          { errors.userID &&
                              <p className = { createUser.id.error.className }>
                              { createUser.id.error.text }</p>}
   
                  <label className = { createUser.userName.label.className }
                     htmlFor = { createUser.userName.label.htmlFor }>
                     { createUser.userName.label.text }
                 </label>
                 <input placeholder={ createUser.userName.input.placeholder }
                     className = { createUser.userName.input.className }
                     name = { createUser.userName.input.name }
                     ref = { register({ validate: value => value.length > 0}) }/>
   
                        { errors.userName &&
                            <p className = { createUser.userName.error.className }>
                            { createUser.userName.error.text }</p>}
   
                <label className = { createUser.userEmail.label.className }
                   htmlFor = { createUser.userEmail.label.htmlFor }>
                   { createUser.userEmail.label.text }
               </label>
               <input placeholder={ createUser.userEmail.input.placeholder }
                   className = { createUser.userEmail.input.className }
                   name = { createUser.userEmail.input.name }
                   ref = { register }/>
   
                <label className = { createUser.userDescription.label.className }
                   htmlFor = { createUser.userDescription.label.htmlFor }>
                   { createUser.userDescription.label.text }
               </label>
               <input placeholder={ createUser.userDescription.input.placeholder }
                   className = { createUser.userDescription.input.className }
                   name = { createUser.userDescription.input.name }
                   ref = { register }/>
   
               <hr className = "my-space-50"/>
               <span className="d-fl">
                    <Col md={1} className="mb-1">
                        <input type="checkbox"
                           name={ READ.name }
                           ref = { register }/>
                   </Col>
                   <Col md={3} className="mb-3">
                       <label htmlFor = { READ.name }/>
                           { READ.label }
                   </Col>
                   <Col md={1} className="mb-1">
                       <input type="checkbox"
                          name={ WRITE.name }
                          ref = { register }/>
                   </Col>
                  <Col md={4} className="mb-4">
                      <label htmlFor = { WRITE.name }/>
                           { WRITE.label }
                  </Col>
                  <Col md={1} className="mb-1">
                      <input type="checkbox"
                         name={ MANAGE.name }
                         ref = { register }/>
                  </Col>
                 <Col md={4} className="mb-4">
                     <label htmlFor = { MANAGE.name }/>
                          { MANAGE.label }
                 </Col>
              </span>
   
             <button className = { createUser.action.className }
                 type =  { createUser.action.type } >
                 { createUser.action.text }
             </button>
   
         </form> </>
       )
   }

   
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

import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
import { createDBText } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { isObject } from "../../utils/helperFunctions";
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { HelpCowDuck } from "../Reports/HelpCowDuck"

const CreateDB = (props) => {
    let initconfig = props.dbInfo;
    if(!initconfig) {
        initconfig =  {
            schema: true,
            instance: true,
            accountid: "",
            dbid: "",
            dbname: "",
            description: "",
            data_url: "default",
            schema_url: "default"
        }
    }

    let textinputs = ["dbid", "dbname", "data_url", "schema_url"]

    const { register, handleSubmit, errors } = useForm();
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const [dbLocation, setDBLoction] = useState(CREATE_DB_LOCAL);
    const [rep, setReport] = useState({})
    const [dbInfo, updateDbInfo] = useState(initconfig)

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const [advancedSettings, setAdvancedSettings] = useState(false)

    const {woqlClient} = WOQLClientObj();

    const onSubmit = (data) => {
        if((dbLocation === CREATE_TERMINUS_DB) &&(!user)) {
            loginWithRedirect();  // authenticate
        }
        data.accountid = data.accountid || woqlClient.account() || woqlClient.uid()
        if(!data.data_url || data.data_url == "default"){
            data.data_url = getDefaultDocURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
        }
        if(!data.schema_url || data.schema_url == "default"){
            data.schema_url = getDefaultScmURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
        }
        let doc = {
            label: data.dbname,
            comment: data.description,
            base_uri: data.data_url,
            prefixes: {scm: data.schema_url}
        }
        setLoading(true)
        doCreate(data.dbid, doc, data.accountid, data.schema, data.instance)
    }

    let update_start = Date.now()

    function createStarterGraphs(instance, schema){
        if(schema && instance){
            return woqlClient.createGraph("schema", "main", createDBText.schemaGraphCommitMessage)
            .then(() => {
                return woqlClient.createGraph("instance", "main", createDBText.schemaGraphCommitMessage)
                .then(() => setReport({message: message, status: reportAlert.SUCCESS}))
                .catch((e) => {
                    message += createDBText.instanceFailedSchemaWorkedMessage
                    setReport({message: message, error: e, status: reportAlert.WARNING})
                })
            }).catch((e) => {
                message += createDBText.schemaFailedMessage
                setReport({message: message, error: e, status: reportAlert.WARNING})
            })
        }
        else if(schema){
            return woqlClient.createGraph("schema", "main", createDBText.schemaGraphCommitMessage)
            .then(() => {
                message += createDBText.noDataGraphMessage
                setReport({message: message, error: e, status: reportAlert.SUCCESS})
            }).catch((e) => {
                message += createDBText.schemaFailedMessage
                setReport({message: message, error: e, status: reportAlert.WARNING})
            })
        }
        else if(instance){
            return woqlClient.createGraph("schema", "main", createDBText.schemaGraphCommitMessage)
            .then(() => {
                message += createDBText.noSchemaGraphMessage
                setReport({message: message, error: e, status: reportAlert.SUCCESS})
            }).catch((e) => {
                message += createDBText.instanceFailedMessage
                setReport({message: message, error: e, status: reportAlert.WARNING})
            })
        }
    }

    function doCreate(id, doc, acc, schema, instance){
        update_start = Date.now()
        return woqlClient.createDatabase(id , doc, acc)
        .then((cresults) => {
            let message = `${createDBText.createSuccessMessage} ${doc.label}, id: [${id}] `
            if(instance || schema){
                return createStarterGraphs(instance, schema, message)
            }
            else {
                message += createDBText.noGraphMessage
                setReport({message: message, error: e, status: reportAlert.SUCCESS})
            }
        })
        .catch((err) => {
            setReport({error: err, status: reportAlert.ERROR});
        })
        .finally(() => setLoading(false))
    }

    //should be moved out into general settings
    function getDefaultDocURL(aid, did, on_hub){
        let base = (on_hub ? "http://hub.terminusdb.com/" : woqlClient.server())
        return `${base}${aid}/${did}/data/`
    }

    function getDefaultScmURL(aid, did, on_hub){
        let base = (on_hub ? "http://hub.terminusdb.com/" : woqlClient.server())
        return `${base}${aid}/${did}/schema#`
    }

    function showMandatory(label){
        return (<strong title={label + " " + createDBText.requiredField} style={{"color": "red"}} className={createDBText.errorClassName}> * </strong>)
    }

    const advancedIcon = () => {
        return null
    }


    const setLocalDB = (ev) => {
        setDBLoction(CREATE_DB_LOCAL);
    }

    const setTerminusDB = (ev) => {
        setDBLoction(CREATE_TERMINUS_DB);
    }

    const handleAdvancedSettings = () => {
        setAdvancedSettings(true)
    }

    const handleHideAdvancedSettings = () => {
        setAdvancedSettings(false)
    }

    function generateFieldLabel(field_id, meta){
        let cname = createDBText.labelClassName
        let cbits = ""
        if(textinputs.indexOf(field_id) != -1 || errors[field_id]){
            if(textinputs.indexOf(field_id) != -1) cbits =showMandatory(meta.label)
        }
        let lab = (
            <label className={cname} htmlFor={field_id}>
                {meta.label} {cbits}
            </label>
        )
        return lab
    }

    function generateFieldInput(field_id, meta){
        let cname = createDBText.inputClassName
        if(textinputs.indexOf(field_id) != -1){
            let ph = meta.placeholder || ""
            let val = dbInfo[field_id] || ""
            return (
                <input
                    placeholder={ ph }
                    className = {cname }
                    defaultValue={val}
                    name = {field_id}
                    ref = { register({ validate: value => value.length > 0}) }/>
            )
        }
        if(field_id == "description"){
            let ph = meta.placeholder || ""
            let val = dbInfo[field_id] || ""
            return (
                <textarea name= { field_id }
            	    className = { cname }
            	    placeholder = { ph }
                    ref={register}
                    defaultValue={val}/>
            )
        }
        else if(field_id == "graphs"){
            return (
                <div className={createDBText.graphsRowClassName}>
                    <span className={createDBText.checkboxWrapperClassName}>
                        <input type="checkbox"
                            className = {createDBText.checkboxClassName }
                            defaultChecked={dbInfo.schema}
                            name = "schema"
                            id="instancecbox"
                            ref = {register}/>
                        <label className={createDBText.checkboxLabelClassName} htmlFor="instancecbox">
                            {meta.schema_text}
                        </label>
                    </span>
                    <span className={createDBText.checkboxWrapperClassName}>
                        <input type="checkbox"
                            className = {createDBText.checkboxClassName  }
                            defaultChecked ={dbInfo.instance}
                            name = "instance"
                            id="schemacbox"
                            ref = {register}/>
                        <label className={createDBText.checkboxLabelClassName} htmlFor="schemacbox">
                            {meta.instance_text}
                        </label>
                    </span>
                </div>

            )
        }
    }


    if(rep){
       rep.time = Date.now() - update_start
    }
    return (<>
            <hr className = "my-space-15"/>
			{isObject(rep) &&
                <APIUpdateReport error = { rep.error } message={rep.message} status={rep.status} time={rep.time}/>
            }
            { loading && <Loading /> }
            {show && <form onSubmit={handleSubmit(onSubmit) }>
                {generateSection("details")}
				 <hr className = "my-space-15"/>
                 <span className={createDBText.advancedWrapperClassName}>
                    {!advancedSettings &&
                        <button className={createDBText.advancedButtonClassName}
                        onClick={handleAdvancedSettings}>
                            {createDBText.showAdvanced}
                            {advancedIcon()}
                        </button>
                    }
                    {advancedSettings &&
                        <button className={createDBText.advancedButtonClassName}
                            onClick={handleHideAdvancedSettings}>
                                {createDBText.hideAdvanced}
                                {advancedIcon()}
                        </button>
                    }
                 </span>
                {advancedSettings &&
                    <div className={createDBText.advancedSectionClassName}>
                        <hr className = "my-space-15"/>
                        {generateSection("advanced")}
                    </div>
                }
                <button type="submit" className={createDBText.createButtonClassName}>
                    {createDBText.createButtonText}
                </button>
            </form>}
          </>)
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

import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import Loading from "../../components/Loading";
import { createGraphText } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import Select from "react-select";

export const CreateGraph = ({onCancel, onCreate}) => {

    const { register, handleSubmit, errors } = useForm();

    const [dbInfo, setDbInfo] = useState({gid: "", gtype: ""});

    function generateFieldLabel(field_id, meta){
        let cname = createGraphText.labelClassName
        let cbits = ""
        if(field_id == "gid") cbits =showMandatory(meta.label)
        let lab = (
            <label className={cname} htmlFor={field_id}>
                {meta.label} {cbits}                 
            </label>
        )
        return lab
    }

    function generateFieldInput(field_id, meta){
        if(field_id == "gid"){
            let ph = meta.placeholder || ""
            let val = dbInfo[field_id] || ""
            return (
                <input
                    placeholder={ ph }
                    className = {createGraphText.inputClassName }
                    defaultValue={val}
                    name = {field_id}
                    ref = { register({ validate: value => value.length > 0}) }/>
            )                   
        }
        if(field_id == "gtype"){
            let ph = meta.placeholder || ""
            return(<Select placeholder = {ph}
                className = {createGraphText.selectClassName}
                ref={register}
                options = {[
                    {label: "Data", value: "instance"}, 
                    {label: "Schema",  value: "schema"}, 
                    {label: "Inference", value: "inference"}]}
                />
            )        
        }
    }

    function generateFieldPrompt(field_id, meta){
        if(errors[field_id]){
            return (
                <p className = {createGraphText.errorClassName}>
                    {meta.label + " " + createGraphText.requiredField} 
                </p>
            )
        }
        if(meta.help){
            return (
                <p className = {createGraphText.helpClassName}>
                    {meta.help} 
                </p>
            )
        }
        return null
    }

    function generateFormField(field_id, meta){
        let x = generateFieldLabel(field_id, meta)
        let y =  generateFieldInput(field_id, meta)
        let z =  generateFieldPrompt(field_id, meta)
        return (
            <span class='form-field'>{x}{y}{z}</span>
        )
    }

    function onSubmit(data){
        alert(JSON.stringify(data))
    }

    let typeField = generateFormField("gtype", createGraphText.fields.gtype)
    let idField = generateFormField("gid", createGraphText.fields.gid)

    function showMandatory(label){
        return (<strong 
            title={label + " " + createGraphText.requiredField} 
            style={{"color": "red"}} 
            className={createGraphText.errorClassName}>
                * 
        </strong>)
    }

    function showSubmitPane(){
        return (
            <button type="cancel" className={createGraphText.cancelButtonClassName}>
                {createGraphText.cancelButtonText}
            </button><span style={{"padding-right": 10}}>&nbsp;</span>
            <button type="submit" className={createGraphText.createButtonClassName}>
                    {createGraphText.createButtonText}
            </button>
        )
    }



    return (<form onSubmit={handleSubmit(onSubmit) }>
        <Container>
            <Row>
                {showSubmitPane()}
            </Row>
            <Row>
                <Col>{typeField}</Col><Col>{idField}</Col>
            </Row>
        </Container>
    </form>)
}




export default CreateDB;



   export default CreateNewUser;
   