import React, {useState} from 'react'
import {TCForm} from '../../components/Form/FormComponents'
import {DB_DETAILS_FORM, DB_ADVANCED_FORM, CREATE_WITH_CSV, DB_CREATE_FORM,
    ADD_MORE_CSV, } from './constants.createdb'
import {getDefaultScmURL, getDefaultDocURL} from '../../constants/functions'
import { AiOutlineInfoCircle } from "react-icons/ai";
import {CsvLoader} from "../../components/Form/CsvLoader"
import {Row, Col} from "reactstrap"

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

    const [csvs, setCsvs]=useState([])

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
        if (Array.isArray(csvs) && csvs.length){
            dbdoc.files = []
            dbdoc.files = csvs
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

    const insertCsvs = (e) => {
	   for(var i=0; i<e.target.files.length; i++){
		   let files = {};
           files = e.target.files[i]
		   setCsvs( arr => [...arr, files]);
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

            {(csvs.length > 0) && <CsvLoader csvs={csvs} setCsvs={setCsvs} page="create"/>}

            <Row>

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

                <span className={DB_CREATE_FORM.csvWrapperClassName}>
                    <input type="file"
                        name="addCss"
                        id="addCss"
                        className="inputfile inputfile-6" multiple
                        onChange={insertCsvs}
                        accept=".csv"/>

                    {(!csvs.length) && <label for="addCss">{CREATE_WITH_CSV}</label>}
                    {(csvs.length > 0) && <label for="addCss">{ADD_MORE_CSV}</label>}
                </span>

            </Row>
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
