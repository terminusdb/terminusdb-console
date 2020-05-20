import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
//import { createDBText } from "../../variables/formLabels"
import { CREATE_DB_FORM } from "./constants"
import { useForm } from 'react-hook-form';
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { isObject } from "../../utils/helperFunctions";
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { HelpCowDuck } from "../../components/Reports/HelpCowDuck"

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

    const {woqlClient,reconnectServer} = WOQLClientObj();

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
            prefixes: {doc: data.data_url, scm: data.schema_url}
        }
        setLoading(true)
        doCreate(data.dbid, doc, data.accountid, data.schema, data.instance)
    }

    let update_start = Date.now()

    function createStarterGraphs(instance, schema){
        if(schema && instance){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
            .then(() => {
                return woqlClient.createGraph("instance", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
                .then(() => setReport({message: message, status: reportAlert.SUCCESS}))
                .catch((e) => {
                    message += CREATE_DB_FORM.instanceFailedSchemaWorkedMessage
                    setReport({message: message, error: e, status: reportAlert.WARNING})
                })
            }).catch((e) => {
                message += CREATE_DB_FORM.schemaFailedMessage
                setReport({message: message, error: e, status: reportAlert.WARNING})
            })
        }
        else if(schema){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
            .then(() => {
                message += CREATE_DB_FORM.noDataGraphMessage
                setReport({message: message, error: e, status: reportAlert.SUCCESS})
            }).catch((e) => {
                message += CREATE_DB_FORM.schemaFailedMessage
                setReport({message: message, error: e, status: reportAlert.WARNING})
            })
        }
        else if(instance){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
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
            let message = `${CREATE_DB_FORM.createSuccessMessage} ${doc.label}, id: [${id}] `
            if(instance || schema){
                return createStarterGraphs(instance, schema, message)
            }
            else {
                message += CREATE_DB_FORM.noGraphMessage
                setReport({message: message, error: e, status: reportAlert.SUCCESS})
            }
        })
        .catch((err) => {
            setReport({error: err, status: reportAlert.ERROR});
        })
        .finally(() => {
            setLoading(false)
            reconnectServer();

        })
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
        return (<strong title={label + " " + CREATE_DB_FORM.requiredField} style={{"color": "red"}} className={CREATE_DB_FORM.errorClassName}> * </strong>)
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
        let cname = CREATE_DB_FORM.labelClassName
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
        let cname = CREATE_DB_FORM.inputClassName
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
                <div className={CREATE_DB_FORM.graphsRowClassName}>
                    <span className={CREATE_DB_FORM.checkboxWrapperClassName}>
                        <input type="checkbox"
                            className = {CREATE_DB_FORM.checkboxClassName }
                            defaultChecked={dbInfo.schema}
                            name = "schema"
                            id="instancecbox"
                            ref = {register}/>
                        <label className={CREATE_DB_FORM.checkboxLabelClassName} htmlFor="instancecbox">
                            {meta.schema_text}
                        </label>
                    </span>
                    <span className={CREATE_DB_FORM.checkboxWrapperClassName}>
                        <input type="checkbox"
                            className = {CREATE_DB_FORM.checkboxClassName  }
                            defaultChecked ={dbInfo.instance}
                            name = "instance"
                            id="schemacbox"
                            ref = {register}/>
                        <label className={CREATE_DB_FORM.checkboxLabelClassName} htmlFor="schemacbox">
                            {meta.instance_text}
                        </label>
                    </span>
                </div>

            )
        }
    }

    function generateFieldPrompt(field_id, meta){
        if(errors[field_id]){
            return (
                <p className = {CREATE_DB_FORM.errorClassName}>
                    {meta.label + " " + CREATE_DB_FORM.requiredField}
                </p>
            )
        }
        if(meta.help){
            return (
                <><HelpCowDuck text={meta.help} id={meta.label}/>
               { /*<p className = {CREATE_DB_FORM.helpClassName}>
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

    function generateSection(secid){
        let sec = CREATE_DB_FORM.sections[secid]
        let fields = []
        for(var k in sec.fields){
            fields.push(generateFormField(k, sec.fields[k]))
        }
        if(secid == "details"){
            let nfields = [];
            nfields.push(<Row><Col>{fields[0]}</Col><Col>{fields[1]}</Col></Row>)
            nfields.push(<Row><Col>{fields[2]}</Col></Row>)
            fields = nfields
        }
        return (
            <Container>
                {sec.name &&
                    <span class='form-section-header'>{sec.name}</span>
                }
                {fields}
            </Container>
        )
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
                 <span className={CREATE_DB_FORM.advancedWrapperClassName}>
                    {!advancedSettings &&
                        <button className={CREATE_DB_FORM.advancedButtonClassName}
                        onClick={handleAdvancedSettings}>
                            {CREATE_DB_FORM.showAdvanced}
                            {advancedIcon()}
                        </button>
                    }
                    {advancedSettings &&
                        <button className={CREATE_DB_FORM.advancedButtonClassName}
                            onClick={handleHideAdvancedSettings}>
                                {CREATE_DB_FORM.hideAdvanced}
                                {advancedIcon()}
                        </button>
                    }
                 </span>
                {advancedSettings &&
                    <div className={CREATE_DB_FORM.advancedSectionClassName}>
                        <hr className = "my-space-15"/>
                        {generateSection("advanced")}
                    </div>
                }
                <button type="submit" className={CREATE_DB_FORM.createButtonClassName}>
                    {CREATE_DB_FORM.createButtonText}
                </button>
            </form>}
          </>)
}

export default CreateDB;
