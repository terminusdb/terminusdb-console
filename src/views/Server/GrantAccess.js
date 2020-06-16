/**
 * Controller application for metadata update form
 */
import React, {useState} from "react";
import { GRANT_ACCESS_FORM } from "./constants.server"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { ACCESS_FAILURE, TERMINUS_COMPONENT, TERMINUS_SUCCESS, TERMINUS_ERROR } from "../../constants/identifiers";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TCForm } from "../../components/Form/FormComponents"
import Loading from "../../components/Reports/Loading" 
import TerminusClient from '@terminusdb/terminusdb-client';

export const GrantAccess = () => {
    const { woqlClient } = WOQLClientObj();
    const [report, setReport] = useState()
    let values = {
        accid: "",
        capid: "",
    }
    
    const [loading, setLoading] = useState()

    function grant(deets){
        if(deets.accid && deets.capid ){
            setLoading(true)
            let tClient = woqlClient.copy()//do not change internal client state
            tClient.db("terminus")           
            TerminusClient.WOQL.lib().grant_access(deets.capid, deets.accid)
            .execute(tClient).then((result) => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Granted Access"})
            })
            .catch((err) => {
                setReport({message: "Failed to Grant Access", status: TERMINUS_ERROR, error: err})
            })
            .finally(() => setLoading(false))
        }
    }


    let buttons = GRANT_ACCESS_FORM.buttons
    if(loading) return <Loading />
    return (<>
        {report && 
            <TerminusDBSpeaks report={report} />
        }
        <TCForm
            onSubmit = {grant}
            layout = {[2]}
            fields={GRANT_ACCESS_FORM.fields}
            values={values} 
            buttons={buttons}
        />    
    </>)
}
