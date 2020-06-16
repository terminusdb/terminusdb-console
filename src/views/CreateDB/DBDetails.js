import React, { useState } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TCForm } from  "../../components/Form/FormComponents"
import {DB_DETAILS_FORM, DB_ADVANCED_FORM} from "./constants.createdb"
import { getDefaultScmURL, getDefaultDocURL } from "../../constants/functions"

/**
 * Form for viewing and editing database meta data
 */
export const DBDetailsForm = ({onSubmit, buttons, dbid}) => {

    //first load form configuration 
    let dbInfo = {}
    let advancedInfo = {}
    DB_DETAILS_FORM.fields.map((item) => {
        dbInfo[item.id] = item.value || ""
    })
    DB_ADVANCED_FORM.fields.map((item) => {
        advancedInfo[item.id] = item.value || ""
    })

    //set up state variables configuration 
    const [values, setValues] = useState(dbInfo)
    const [advanced, setAdvanced] = useState(advancedInfo)
    const [advancedSettings, setAdvancedSettings] = useState(false)
    const {woqlClient} = WOQLClientObj();

    function toggleAdvanced(){
        setAdvancedSettings(!advancedSettings)
    }

    //advanced field we just harvest as it changes
    function onChangeField(field_id, value){
        advanced[field_id] = value
        setAdvanced(advanced)
    }
    //combine inputs from advanced and regular forms and marshalls into format suitable for submitting to api
    function onExtract(stuff){
        setValues(stuff)
        let data = values;
        Object.keys(advanced).forEach(key => data[key] = advanced[key])
        if(!data.data_url || data.data_url.trim() == ""){
            data.data_url = getDefaultDocURL()
        }
        if(!data.schema_url || data.schema_url.trim() == ""){
            data.schema_url = getDefaultScmURL()
        }
        let doc = {
            id: data.dbid,
            label: data.dbname,
            comment: data.description,
            prefixes: {scm: data.schema_url, doc: data.data_url}
        }
        onSubmit(doc, data.schema)
    }

    return (<>
        <TCForm
            onSubmit={onExtract}
            layout = {[2, 1]}
            fields={DB_DETAILS_FORM.fields}
            values={values}
            buttons={buttons}
        />

        <span className={DB_ADVANCED_FORM.advancedWrapperClassName}>
            {!advancedSettings &&
                <button
                    className={DB_ADVANCED_FORM.advancedButtonClassName}
                    onClick={toggleAdvanced}>
                    {DB_ADVANCED_FORM.showAdvanced}
                </button>
            }
            {advancedSettings &&
                <button
                    className={DB_ADVANCED_FORM.advancedButtonClassName}
                    onClick={toggleAdvanced}>
                    {DB_ADVANCED_FORM.hideAdvanced}
                </button>
            }
        </span>
        { advancedSettings &&
            <TCForm
                fields={DB_ADVANCED_FORM.fields}
                layout = {[1, 1, 1]}
                values={advanced}
                onChange = {onChangeField}
            />
        }
    </>)
}