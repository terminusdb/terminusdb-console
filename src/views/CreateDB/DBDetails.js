import React, {useState} from 'react'
import {TCForm} from '../../components/Form/FormComponents'
import {DB_DETAILS_FORM, DB_ADVANCED_FORM} from './constants.createdb'
import {getDefaultScmURL, getDefaultDocURL} from '../../constants/functions'

/**
 * Form for viewing and editing database meta data
 */
export const DBDetailsForm = ({onSubmit, buttons, dbid, logged_in}) => {
    //first load form configuration
    let dbInfo = {}
    let advancedInfo = {}
    let detfields = []
    DB_DETAILS_FORM.fields.map((item) => {
        dbInfo[item.id] = item.value || ''
        if(logged_in || (item.id != "sharing" && item.id != "icon")){
            detfields.push(item)
        }
    })
    DB_ADVANCED_FORM.fields.map((item) => {
        advancedInfo[item.id] = item.value || ''
    })

    let layout = (logged_in ? [3,1,1]  : [2, 1])

    //set up state variables configuration
    const [values, setValues] = useState(dbInfo)
    const [advanced, setAdvanced] = useState(advancedInfo)
    const [advancedSettings, setAdvancedSettings] = useState(false)

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
            comment: extract.description,
        }
        if(logged_in){
            dbdoc.sharing = extract.sharing
        }
        else {
            dbdoc.sharing = "local"
        }
        if (
            (advanced['data_url'] && advanced['data_url'].trim()) ||
            (advanced['schema_url'] && advanced['schema_url'].trim())
        ) {
            let scmns = advanced['schema_url'].trim() || getDefaultScmURL()
            let docns = advanced['data_url'].trim() || getDefaultDocURL()
            dbdoc.prefixes = {scm: scmns, doc: docns}
        }
        onSubmit(dbdoc, advanced.schema)
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

            <span className={DB_ADVANCED_FORM.advancedWrapperClassName}>
                {!advancedSettings && (
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
