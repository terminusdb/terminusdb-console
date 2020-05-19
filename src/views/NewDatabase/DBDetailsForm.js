import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
import { useForm } from 'react-hook-form';
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { isObject } from "../../utils/helperFunctions";
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { HelpCowDuck } from "../../components/Reports/HelpCowDuck"
import {TCFormSubmits, TCForm, TCFormInput, TCFormField, TCFormSelect, TCFormCheckbox, TCFormTextarea, TCCol, TCRow, TCSubmitWrap} from  "../../components/Form/FormComponents"
//import {REQUIRED_FIELD_ERROR, ILLEGAL_ID_ERROR, INTERNAL_COL_CSS} from "../../components/Form/constants"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_INFO} from "../../constants/identifiers"
import {CREATE_DB_FORM} from "./constants"
import {REQUIRED_FIELD_ERROR, ILLEGAL_ID_ERROR} from "../../components/Form/constants"


const DBDetailsForm = (props) => {
    let initconfig = props.dbInfo;
    if(!initconfig) {
        initconfig =  {
            schema: "on",
            instance: "on",
            dbid: "",
            dbname: "",
            description: "",
            data_url: "",
            schema_url: ""
        }
    }

    const { register, handleSubmit, errors } = useForm();
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const [dbLocation, setDBLoction] = useState(CREATE_DB_LOCAL);
    const [report, setReport] = useState()
    const [dbInfo, updateDbInfo] = useState(initconfig)
    const [formErrors, setFormErrors] = useState({})

    const [loading, setLoading] = useState(false);
    const [advancedSettings, setAdvancedSettings] = useState(false)

    const {woqlClient} = WOQLClientObj();

    const onSubmit = (data) => {
        if((dbLocation === CREATE_TERMINUS_DB) &&(!user)) {
            loginWithRedirect();  // authenticate
        }
        setFormErrors(false)
        let nformErrors = {}
        let ok = true
        for(var i in dbInfo){
            let e = findError(i, dbInfo[i])
            if(e) {
                nformErrors[i] = e
                ok = false
            }
        }
        setFormErrors(nformErrors)
        if(ok){
            let accountid = woqlClient.account() || woqlClient.uid()
            if(!dbInfo.data_url || dbInfo.data_url.trim() == ""){
                dbInfo.data_url = getDefaultDocURL(accountid, dbInfo.dbid, (dbLocation === CREATE_TERMINUS_DB))
            }
            if(!dbInfo.schema_url || dbInfo.schema_url.trim() == ""){
                dbInfo.schema_url = getDefaultScmURL(accountid, dbInfo.dbid, (dbLocation === CREATE_TERMINUS_DB))
            }
            let doc = {
                label: dbInfo.dbname,
                comment: dbInfo.description,
                prefixes: {doc: dbInfo.data_url, scm: dbInfo.schema_url}
            }
            setLoading(true)
            doCreate(dbInfo.dbid, doc, accountid, dbInfo.schema, dbInfo.instance)
        }
    }


    let update_start = Date.now()

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
                setReport({message: message, error: e, status: TERMINUS_SUCCESS})
            }
        })
        .catch((err) => {
            let message = `${CREATE_DB_FORM.createFailureMessage} ${doc.label}, id: [${id}] `
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => setLoading(false))
    }


    function createStarterGraphs(instance, schema){
        let message = ""
        if(schema && instance){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
            .then(() => {
                return woqlClient.createGraph("instance", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
                .then(() => setReport({message: message, status: TERMINUS_SUCCESS}))
                .catch((e) => {
                    message += CREATE_DB_FORM.instanceFailedSchemaWorkedMessage
                    setReport({message: message, error: e, status: TERMINUS_WARNING})
                })
            }).catch((e) => {
                message += CREATE_DB_FORM.schemaFailedMessage
                setReport({message: message, error: e, status: TERMINUS_WARNING})
            })
        }
        else if(schema){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
            .then(() => {
                message += CREATE_DB_FORM.noDataGraphMessage
                setReport({message: message, error: e, status: TERMINUS_SUCCESS})
            }).catch((e) => {
                message += CREATE_DB_FORM.schemaFailedMessage
                setReport({message: message, error: e, status: TERMINUS_WARNING})
            })
        }
        else if(instance){
            return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
            .then(() => {
                message += CREATE_DB_FORM.noSchemaGraphMessage
                setReport({message: message, error: e, status: TERMINUS_SUCCESS})
            }).catch((e) => {
                message += CREATE_DB_FORM.instanceFailedMessage
                setReport({message: message, error: e, status: TERMINUS_WARNING})
            })
        }
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

    function findError(field, val){
        if(val == "" && (field == "dbid" || field == "dbname")) return REQUIRED_FIELD_ERROR
        if(field == "dbid"){
            let xval = val.trim()
            if(xval.indexOf(" ") != -1 || xval.indexOf(":") != -1 || xval.indexOf("/") != -1){
                return ILLEGAL_ID_ERROR
            }
        }
        return false
    }

    function onChangeField(field_id, value){
        dbInfo[field_id] = value
        updateDbInfo(dbInfo)
    }

    if(report){
        report.time = Date.now() - update_start
    }
    if(loading) return (<Loading /> )
    return (
        <TCForm onSubmit={onSubmit} >
            <TCFormSubmits submitText={CREATE_DB_FORM.createButtonText} visible="true" />
            {report && 
                <APIUpdateReport error = { report.error } message={report.message} status={report.status} time={report.time}/>
            }
            <TCRow>
                <TCCol>
                    <TCFormField error={formErrors} field_id="dbid" mandatory label={CREATE_DB_FORM.fields["dbid"].label}  help={CREATE_DB_FORM.fields["dbid"].help}>
                        <TCFormInput field_id="dbid" mandatory placeholder={CREATE_DB_FORM.fields["dbid"].placeholder} onChange={onChangeField}/>
                    </TCFormField>
                </TCCol>
                <TCCol>
                    <TCFormField error={formErrors} field_id="dbname" mandatory label={CREATE_DB_FORM.fields["dbname"].label} help={CREATE_DB_FORM.fields["dbname"].help}>
                        <TCFormInput placeholder={CREATE_DB_FORM.fields["dbname"].placeholder} field_id="dbname" onChange={onChangeField} />
                    </TCFormField>
                </TCCol>
            </TCRow>
            <TCRow>
                <TCCol>
                    <TCFormField error={formErrors} field_id="description" label={CREATE_DB_FORM.fields["description"].label} help={CREATE_DB_FORM.fields["description"].help}>
                        <TCFormTextarea placeholder={CREATE_DB_FORM.fields["description"].placeholder} field_id="description" onChange={onChangeField} />
                    </TCFormField>
                </TCCol>
            </TCRow>
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
            {advancedSettings && <>
                <hr className = "my-space-15"/>
                <hr className = "my-space-15"/>
                <TCRow>
                    <TCCol>
                        <TCFormField  helpCols="8" error={formErrors} field_id="schema" label={CREATE_DB_FORM.fields["schema"].label}  help={CREATE_DB_FORM.fields["schema"].help}>
                            <TCFormCheckbox field_id="schema" label ={CREATE_DB_FORM.fields["schema"].placeholder} onChange={onChangeField}/>
                        </TCFormField>
                    </TCCol>
                    <TCCol>
                        <TCFormField  helpCols="7" error={formErrors} field_id="instance" label={CREATE_DB_FORM.fields["instance"].label} help={CREATE_DB_FORM.fields["instance"].help}>
                            <TCFormCheckbox checked={dbInfo["instance"]} label={CREATE_DB_FORM.fields["instance"].placeholder} field_id="instance" onChange={onChangeField} />
                        </TCFormField>
                    </TCCol>
                </TCRow>
                <TCRow>
                    <TCCol>
                        <TCFormField error={formErrors} field_id="data_url" label={CREATE_DB_FORM.fields["data_url"].label} help={CREATE_DB_FORM.fields["data_url"].help}>
                            <TCFormInput placeholder={CREATE_DB_FORM.fields["data_url"].placeholder} field_id="data_url" onChange={onChangeField} />
                        </TCFormField>
                    </TCCol>
                </TCRow>
                <TCRow>
                    <TCCol>
                        <TCFormField error={formErrors} field_id="schema_url" label={CREATE_DB_FORM.fields["schema_url"].label} help={CREATE_DB_FORM.fields["data_url"].help}>
                            <TCFormInput placeholder={CREATE_DB_FORM.fields["schema_url"].placeholder} field_id="schema_url" onChange={onChangeField} />
                        </TCFormField>
                    </TCCol>
                </TCRow>
            </>}
        </TCForm>
    )
}
export default DBDetailsForm;
