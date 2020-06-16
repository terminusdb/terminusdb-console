/**
 * Controller application for metadata update form
 */
import React, {useState} from "react";
import { ADD_USER_FORM } from "./constants.server"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { ACCESS_FAILURE, TERMINUS_COMPONENT, TERMINUS_SUCCESS, TERMINUS_ERROR } from "../../constants/identifiers";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TCForm } from "../../components/Form/FormComponents"
import Loading from "../../components/Reports/Loading" 
import TerminusClient from '@terminusdb/terminusdb-client';

export const AddUser = () => {
    const { woqlClient } = WOQLClientObj();
    const [report, setReport] = useState()
    let values = {
        uid: "",
        password: "",
        commitlog: "",
        display: "",
        notes: "",
    }
    
    const [loading, setLoading] = useState()

    function createUser(deets){
        if(deets.uid && deets.password && deets.commitlog){
            setLoading(true)
            let tClient = woqlClient.copy()//do not change internal client state
            tClient.db("terminus")
            let note = deets.note || ""
            TerminusClient.WOQL.lib().add_user(deets.uid, [deets.commitlog, note, deets.password])
            .execute(tClient).then((result) => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Created New User"})
            })
            .catch((err) => {
                setReport({message: "Failed to create user", status: TERMINUS_ERROR, error: err})
            })
            .finally(() => setLoading(false))
        }
    }


    let buttons = ADD_USER_FORM.buttons
    if(loading) return <Loading />
    return (<>
        {report && 
            <TerminusDBSpeaks report={report} />
        }
        <TCForm
            onSubmit = {createUser}
            layout = {[2, 2, 1]}
            fields={ADD_USER_FORM.fields}
            values={values} 
            buttons={buttons}
        />    
    </>)
}
