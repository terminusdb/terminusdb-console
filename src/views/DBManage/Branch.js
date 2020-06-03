/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from "react";
import { TCForm } from  "../../components/Form/FormComponents"
import { CREATE_BRANCH_FORM, BRANCH_SOURCE_FORM  } from "./constants.dbmanage"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_INFO } from "../../constants/identifiers";
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import { printts } from "../../constants/dates";

export const Branch = ({onCancel, onCreate, onEdit, visible}) => {
    const {woqlClient} = WOQLClientObj();
    const {branch, ref, consoleTime, updateBranches} = DBContextObj();
    visible = visible || false
    
    let ics = {}
    CREATE_BRANCH_FORM.fields.map((item) => {
        ics[item.id] = item.value || ""
    })

    const [values, setValues] = useState(ics)
    const [sourceValues, setSourceValues] = useState()

    useEffect(() => {
        setSourceValues({
            branch: branch,
            ref: ref || "head",
            time: (consoleTime ? printts(consoleTime) : "now")
        })
    }, [branch, ref, consoleTime])
 
    const [report, setReport] = useState()

    let btns = CREATE_BRANCH_FORM.buttons
   

    function onCreate(){
        woqlClient.branch(values.bid)
        .then(() => {
            setReport({ status: TERMINUS_SUCCESS })
            updateBranches()
        })
        .catch((e) => {
            setReport({ status: TERMINUS_ERROR, message: "Failed to create branch", error: e})
        })
    }

    function onUpdate(key, val){
        values[key] = val
        setValues(values)
    }

    if(report && report.status == TERMINUS_SUCCESS){
        return (<TerminusDBSpeaks report={{status: "success",  message:"Successfully Created New Branch"}} />)
    }
    return (<>
        <TCForm 
            layout = {[3]}
            fields={BRANCH_SOURCE_FORM.fields}
            values={sourceValues}
            report={{status: TERMINUS_INFO, message: BRANCH_SOURCE_FORM.infoMessage } }
        />
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[1, 1]}
            onChange={onUpdate}
            fields={CREATE_BRANCH_FORM.fields}
            values={values}
            buttons={btns} 
        />
    </>)
}