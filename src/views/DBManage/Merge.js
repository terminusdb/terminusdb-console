/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from "react";
import { TCForm } from  "../../components/Form/FormComponents"
import { MERGE_BRANCH_FORM, MERGE_SOURCE_FORM } from "./constants.dbmanage"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_INFO, TERMINUS_COMPONENT } from "../../constants/identifiers";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import { printts } from "../../constants/dates";
import Loading from "../../components/Reports/Loading"

export const Merge = ({onCancel, onCreate, onEdit, visible}) => {
    visible = visible || false
    const [report, setReport] = useState()
    const [loading, setLoading] = useState(false)

    const {woqlClient} = WOQLClientObj();
    const {branch, branches, ref, consoleTime, updateBranches} = DBContextObj();

    if(!branches){
        return (<Loading type={TERMINUS_COMPONENT} />)
    }

    let merge_fields = MERGE_BRANCH_FORM.fields.map((item) => {
        if(item.id == "target") item.inputElement.options = getBranchOptions()
        return item    
    }) 

    let update_start = Date.now()


    let ics = {}
    merge_fields.map((item) => {
        ics[item.id] = item.value || ""
    })

    const [values, setValues] = useState(ics)
    const [sourceValues, setSourceValues] = useState()

    function getBranchOptions(){
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })
        return bopts
    }

    
    useEffect(() => {   
        setSourceValues({
            branch: branch,
            ref: ref || "head",
            time: (consoleTime ? printts(consoleTime) : "now")
        })
    }, [branch, ref, consoleTime])  

    function onCreate(){
        let frombase = (woqlClient.account() || woqlClient.uid()) + "/" + woqlClient.db() + "/" + woqlClient.repo() + "/"
        if(ref) frombase += "commit/" + ref
        else frombase += "branch/" + branch 
        setLoading(true)
        update_start = Date.now()

        woqlClient.account(woqlClient.account() || woqlClient.uid())
        woqlClient.ref(false)
        woqlClient.checkout(values.target)
        let abc = woqlClient.basic_auth()
        woqlClient.remote_auth({type: "basic", key: abc.split(":")[1], user: abc.split(":")[0]})
        let rebase_source = {
            rebase_from: frombase,
            author: woqlClient.uid(),
            message: values.commit 
        }
        return woqlClient.rebase(rebase_source)
        .then(() => {
            let message = `${MERGE_BRANCH_FORM.mergeSuccessMessage} into branch ${values.target}`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(values.target)  
        })
        .catch((err) => {
            let message = `${MERGE_BRANCH_FORM.mergeFailureMessage} into branch ${values.target} `
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })        
    }

    function onUpdate(key, val){
        values[key] = val
        setValues(values)
    }

    function afterCreate(bid){
        updateBranches()
    }

    let btns = MERGE_BRANCH_FORM.buttons
    if(report && report.status == TERMINUS_SUCCESS){
        return (<TerminusDBSpeaks report={report} />)
    }
    return (<>
        {loading && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        <TCForm 
            layout = {[3]}
            fields={MERGE_SOURCE_FORM.fields}
            values={sourceValues}
            report={{status: TERMINUS_INFO, message: MERGE_SOURCE_FORM.infoMessage } }
        />
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            onChange={onUpdate}
            fields={merge_fields}
            values={values}
            buttons={btns} 
        />
    </>)
}

