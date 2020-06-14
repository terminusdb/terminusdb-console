import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Reports/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT } from "../../constants/identifiers"
import { COPY_REMOTE_FORM, COPY_DB_DETAILS_FORM } from "./constants.createdb"
import { goDBHome } from "../../components/Router/ConsoleRouter"
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport";
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"
import { AccessControlErrorPage } from "../../components/Reports/AccessControlErrorPage"


export const CopyRemoteForm = () => {
    const {woqlClient, reconnectServer} = WOQLClientObj();
    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    if(!canCreate){
        return (<AccessControlErrorPage />)
    }
    const { loading, user } = useAuth0();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [report, setReport] = useState();
    const [sourceURL, setSourceURL] = useState()


    let update_start = Date.now()

    let basicInfo = {}  
    let fields = COPY_REMOTE_FORM.fields 

    //build values and options from database options
    COPY_REMOTE_FORM.fields.map((item, index) => {
        basicInfo[item.id] = item.value || ""
    })   

    function onChangeBasics(field_id, value){
        if(field_id == "dbsource"){
            setSourceURL(value)
        }
    }

    //we should really do some behind the scenes checking of auth situation before actually pulling the trigger, but oh well....
    function onClone(details){
        update_start = Date.now()
        setUpdateLoading(true)
        woqlClient.account( woqlClient.uid() )

        if(details.user && details.password){
            woqlClient.remote_auth({type: "basic", key: details.password, user: details.user})
        }
        let newid = details.newid || sourceURL.substring(sourceURL.lastIndexOf("/")+1)

        let src = {"remote_url": sourceURL, label: details.name || newid, comment: details.description }
        return woqlClient.clonedb(src, newid)
        .then(() => {
            let message = `${COPY_REMOTE_FORM.cloneSuccessMessage} (id: ${sourceURL})`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(newid, accountid, rep)  
        })
        .catch((err) => {
            let message = `${COPY_REMOTE_FORM.cloneSuccessMessage} (id: ${sourceURL})`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(newid, accountid, rep)  
      //      let message = `${COPY_REMOTE_FORM.cloneFailureMessage} (id: ${sourceURL}) `
      //      setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setUpdateLoading(false)
        })
    }

     /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, acc, rep){
        woqlClient.connect().then(result=>{
            goDBHome(id, acc, rep)
        })
    }

    let buttons = COPY_REMOTE_FORM.buttons

    return (<>
        {(loading || updateLoading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        {(report && report.error) && 
            <APIUpdateReport status={report.status} error={report.error} message={report.message} time={report.time} />
        }
        <TCForm 
            onSubmit={onClone} 
            layout = {[1, 2, 2, 1]}
            noCowDucks
            onChange={onChangeBasics} 
            fields={fields}
            buttons={buttons} 
        />
    </>)
}
