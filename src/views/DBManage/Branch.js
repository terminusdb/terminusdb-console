/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCForm } from  "../../components/Form/FormComponents"
import { CREATE_BRANCH_FORM  } from "./constants.dbmanage"
import { HistoryNavigator} from "../../components/History/HistoryNavigator"
import { TERMINUS_SUCCESS, TERMINUS_ERROR } from "../../constants/identifiers";
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { WOQLClientObj } from "../../init/woql-client-instance";

export const Branch = ({onCancel, onCreate, onEdit, visible}) => {
    const {woqlClient} = WOQLClientObj();
    visible = visible || false
    
    let ics = {}
    CREATE_BRANCH_FORM.fields.map((item) => {
        ics[item.id] = item.value || ""
    })

    const [values, setValues] = useState(ics)
    const [report, setReport] = useState()

    let btns = CREATE_BRANCH_FORM.buttons
   

    function onCreate(){
        woqlClient.ref(values.source)
        woqlClient.branch(values.bid)
        .then(() => {
            setReport({ status: TERMINUS_SUCCESS })
        })
        .catch((e) => {
            setReport({ status: TERMINUS_ERROR, message: "Failed to create branch", error: e})
        })
    }

    function onUpdate(key, val){
        values[key] = val
        setValues(values)
    }


    function headChanged(branch, ref){
        let nvalues = {source: (ref ? ref : ""), branch: branch}
        for(var key in values){
            if(typeof[nvalues[key]] == "undefined") nvalues[key] = values[key]
        }
        setValues(nvalues)
    }

    if(report && report.status == TERMINUS_SUCCESS){
        return (<TerminusDBSpeaks report={{status: "success",  message:"Successfully Created New Branch"}} />)
    }

    return (       
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            onChange={onUpdate}
            fields={CREATE_BRANCH_FORM.fields}
            values={values}
            buttons={btns} 
        >
            <HistoryNavigator onHeadChange={headChanged} />
        </TCForm>       
    )
}