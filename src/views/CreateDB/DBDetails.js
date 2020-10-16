import React, {useState} from 'react'
import {TCForm} from '../../components/Form/FormComponents'
import {DB_DETAILS_FORM, DB_ADVANCED_FORM} from './constants.createdb'
import {getDefaultScmURL, getDefaultDocURL} from '../../constants/functions'
import { AiOutlineInfoCircle } from "react-icons/ai";

/**
 * Form for viewing and editing database meta data
 */
export const DBDetailsForm = ({onSubmit, buttons, dbid, logged_in, from_local}) => {
    //first load form configuration
    let dbInfo = {}
    if(from_local && from_local.id){
        dbInfo.dbid = from_local.id
    }
    if(from_local && from_local.label){
        dbInfo.dbname = from_local.label
    }
    if(from_local && from_local.comment){
        dbInfo.description = from_local.comment
    }
    if(from_local && from_local.icon){
        dbInfo.icon = from_local.icon
    }
    let advancedInfo = {}
    let detfields = []

    DB_DETAILS_FORM.fields.map((item) => {
        if(!dbInfo[item.id]) dbInfo[item.id] = item.value || ''
        if(logged_in || (item.id != "sharing" && item.id != "icon" && item.id != "iconUrl")){
            detfields.push(item)
        }
    })

    DB_ADVANCED_FORM.fields.map((item) => {
        advancedInfo[item.id] = item.value || ''
    })



    let layout = (logged_in ? [3,2,1]  : [2, 1])

    //set up state variables configuration
    const [values, setValues] = useState(dbInfo)
    const [advanced, setAdvanced] = useState(advancedInfo)
    const [advancedSettings, setAdvancedSettings] = useState(false)
    const [files, setFiles] = useState(false);
    const [fileName, setFileName] = useState("")

    function toggleAdvanced() {
        setAdvancedSettings(!advancedSettings)
    }

    //advanced field we just harvest as it changes
    function onChangeField(field_id, value) {
        advanced[field_id] = value
        setAdvanced(advanced)
    }

    //combine inputs from advanced and regular forms and marshalls into format suitable for submitting to api
    function onExtract(extract) {
        setValues(extract)
        let dbdoc = {
            id: extract.dbid,
            label: extract.dbname,
            comment: extract.description
        }
        if(files){
            dbdoc.files = files
        }
        if(advanced.schema){
            dbdoc.schema = true
        }
        if(logged_in){
            dbdoc.sharing = extract.sharing
        }
        else {
            dbdoc.sharing = "local"
        }

        if(extract.iconUrl) dbdoc.icon = extract.iconUrl
        else dbdoc.icon = extract.icon
        if (
            (advanced['data_url'] && advanced['data_url'].trim()) ||
            (advanced['schema_url'] && advanced['schema_url'].trim())
        ) {
            let scmns = advanced['schema_url'].trim() || getDefaultScmURL()
            let docns = advanced['data_url'].trim() || getDefaultDocURL()
            dbdoc.prefixes = {scm: scmns, doc: docns}
        }
        onSubmit(dbdoc)
    }

    const loadFiles = (e) => {
        let files = e.target.files, value = e.target.value, message;
        if( files && files.length > 1 )
            message = `${files.length} files selected`;
        else message = value.split( '\\' ).pop();
		if(message) {
			setFileName(message)
			setFiles(e.target.files)
		}
    }

    return (
        <>
            <TCForm
                onSubmit={onExtract}
                layout={layout}
                fields={detfields}
                values={values}
                buttons={buttons}
            />

            <input type="file"
                name="file-7[]"
                id="file-7"
                class="inputfile inputfile-6"
                data-multiple-caption={fileName}
                onChange={loadFiles}
                accept=".csv,.json"/>

            <label for="file-7"><span>{fileName}</span> <strong>Add Data</strong></label>

            <span className={DB_ADVANCED_FORM.advancedWrapperClassName}>
                {(!advancedSettings && !from_local) && (
                    <button
                        className={DB_ADVANCED_FORM.advancedButtonClassName}
                        onClick={toggleAdvanced}
                    >
                        {DB_ADVANCED_FORM.showAdvanced}
                    </button>
                )}
                {advancedSettings && (
                    <button
                        className={DB_ADVANCED_FORM.advancedButtonClassName}
                        onClick={toggleAdvanced}
                    >
                        {DB_ADVANCED_FORM.hideAdvanced}
                    </button>
                )}
            </span>
            {advancedSettings && (
                <TCForm
                    fields={DB_ADVANCED_FORM.fields}
                    layout={[1, 1, 1]}
                    values={advanced}
                    onChange={onChangeField}
                />
            )}
        </>
    )
}
