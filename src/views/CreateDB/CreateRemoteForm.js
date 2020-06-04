import React, { useState } from "react";
import Loading from "../../components/Reports/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT } from "../../constants/identifiers"
import { CREATE_REMOTE_FORM } from "./constants.createdb"
import { goDBHome } from "../../components/Router/ConsoleRouter"
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport";
import { AccessControlErrorPage } from "../../components/Reports/AccessControlErrorPage"
import { UnderConstruction } from "../../components/Reports/UnderConstruction"
import { useAuth0 } from "../../react-auth0-spa";
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"


export const CreateRemoteForm = () => {
    let update_start = Date.now()
    const {woqlClient, reconnectServer} = WOQLClientObj();
    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    if(!canCreate){
        return (<AccessControlErrorPage />)
    }
    const { loading, user } = useAuth0();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [report, setReport] = useState();
    const details = CREATE_REMOTE_FORM.sample

    /**
     * Creates the database and, if a schema graph is set, creates the main schema graph
     * On success, it fires up the home page of the database and rebuilds the list of databases 
     */
    function onCreate(doc, schema){
        setReport(false)
        update_start = Date.now()
        let accountid = woqlClient.account() || woqlClient.uid()
        let e = {data: doc}
        /**
         * This is where we patch in the mini hub-client that creates the database online
         */
        setReport({error: e, status: TERMINUS_ERROR, message: "Adding Database to account " + accountid + " - Warning - not hooked up to API yet"})
    }
    let buttons = (user ? CREATE_REMOTE_FORM.buttons : false)

    return (<>
        {(loading || updateLoading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        {report  && 
            <APIUpdateReport status={report.status} error={report.error} message={report.message} time={report.time} />
        }
        {!user && 
            <TCSubmitWrap>
                <UnderConstruction action={CREATE_REMOTE_FORM.actionText} />
            </TCSubmitWrap>
        }
        <TCForm
            onSubmit={onCreate}
            layout = {[2, 3, 1, 2, 1, 1, 1]}
            fields={CREATE_REMOTE_FORM.fields}
            values={details}
            buttons={buttons}
        />
    </>)
}
