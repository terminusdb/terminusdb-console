import React, { useState, useEffect } from "react";
//import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { CREATE_TERMINUS_DB, CREATE_DB_LOCAL } from "../../labels/actionLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import {TCForm } from  "../../components/Form/FormComponents"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT } from "../../constants/identifiers"
import {CREATE_DB_FORM, CREATE_DB_ADVANCED} from "./constants"
import {getDefaultScmURL, getDefaultDocURL} from "../../constants/functions"
import { goDBHome } from "../../components/Router/ConsoleRouter"


const DBDetailsForm = (props) => {

    let dbLocation = false;//to be added for hub

    let dbInfo = {}
    let advancedInfo = {}

    CREATE_DB_FORM.fields.map((item) => {
        dbInfo[item.id] = item.value || ""
    })

    CREATE_DB_ADVANCED.fields.map((item) => {
        advancedInfo[item.id] = item.value || ""
    })

    const [report, setReport] = useState()

    const [values, setValues] = useState(dbInfo)
    const [advanced, setAdvanced] = useState(advancedInfo)

    const [loading, setLoading] = useState(false);
    const [advancedSettings, setAdvancedSettings] = useState(false)

    const {woqlClient,reconnectServer} = WOQLClientObj();


    let update_start = Date.now()

    function onCreate(dbInfo){
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
            prefixes: {scm: dbInfo.schema_url, doc: dbInfo.data_url}
        }
        update_start = Date.now()
        setLoading(true)
        return woqlClient.createDatabase(dbInfo.dbid , doc, accountid)
        .then(() => {
            let message = `${CREATE_DB_FORM.createSuccessMessage} ${doc.label}, (id: ${dbInfo.dbid}) `
            if(dbInfo.schema){
                return createStarterGraph(message, dbInfo.dbid, accountid)
            }
            else {
                message += CREATE_DB_FORM.noSchemaGraphMessage
                setReport({message: message, status: TERMINUS_SUCCESS})
                afterCreate(dbInfo.dbid, accountid)
            }
        })
        .catch((err) => {
            let message = `${CREATE_DB_FORM.createFailureMessage} ${doc.label}, (id: ${dbInfo.dbid}) `
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })
    }

    /**
     * Creates default main schema graph when chosen
     */
    function createStarterGraph(message, id, acc){
        return woqlClient.createGraph("schema", "main", CREATE_DB_FORM.schemaGraphCommitMessage)
        .then(() => {
            setReport({status: TERMINUS_SUCCESS, message: message})
            afterCreate(id, acc)
        }).catch((e) => {
            message += CREATE_DB_FORM.schemaFailedMessage
            setReport({message: message, error: e, status: TERMINUS_WARNING})
            afterCreate(id, acc)
        })
    }


    /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, acc){
        reconnectServer()
        goDBHome(id, acc)
    }

    function onChangeField(field_id, value){
        advanced[field_id] = value
        setAdvanced(advanced)
    }

    function toggleAdvanced(){
        setAdvancedSettings(!advancedSettings)
    }

    //combines inputs from advanced and regular forms
    function onSubmit(stuff){
        setValues(stuff)
        let dbinf = values;
        Object.keys(advanced).forEach(key => dbinf[key] = advanced[key])
        onCreate(dbinf)
    }

    return (<>
        {loading &&
            <Loading />
        }
        <TCForm
            onSubmit={onSubmit}
            report={report}
            layout = {[2, 1]}
            fields={CREATE_DB_FORM.fields}
            values={values}
            buttons={CREATE_DB_FORM.buttons}
        />

        <span className={CREATE_DB_ADVANCED.advancedWrapperClassName}>
            {!advancedSettings &&
                <button
                    className={CREATE_DB_ADVANCED.advancedButtonClassName}
                    onClick={toggleAdvanced}>
                    {CREATE_DB_ADVANCED.showAdvanced}
                </button>
            }
            {advancedSettings &&
                <button
                    className={CREATE_DB_ADVANCED.advancedButtonClassName}
                    onClick={toggleAdvanced}>
                    {CREATE_DB_ADVANCED.hideAdvanced}
                </button>
            }
        </span>
        { advancedSettings &&
            <TCForm
                fields={CREATE_DB_ADVANCED.fields}
                layout = {[1, 1, 1]}
                values={advanced}
                onChange = {onChangeField}
            />
        }
    </>)
}

export default DBDetailsForm;
