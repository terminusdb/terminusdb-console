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
import { UnderConstruction } from "../Widgets/UnderConstruction"
import { Container, Row } from "reactstrap";


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
    const [detailsLoaded, setDetailsLoaded] = useState()
    const [details, setDetails] = useState(COPY_REMOTE_FORM.sample)

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
        setDetailsLoaded(true)
        setUpdateLoading(true)
        let accountid = woqlClient.account() || woqlClient.uid()
        return woqlClient.clonedb(sourceURL)
        .then(() => {
            let message = `${COPY_REMOTE_FORM.cloneSuccessMessage} (id: ${sourceURL})`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(sourceURL, accountid, rep)  
        })
        .catch((err) => {
            let message = `${COPY_REMOTE_FORM.cloneFailureMessage} (id: ${sourceURL}) `
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setUpdateLoading(false)
        })
    }

     /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, acc, rep){
        reconnectServer()
        goDBHome(id, acc, rep)        
    }

    let buttons = (user ? COPY_REMOTE_FORM.buttons : false)

    return (<>
        {(loading || updateLoading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        {(report && report.error) && 
            <APIUpdateReport status={report.status} error={report.error} message={report.message} time={report.time} />
        }
        {!user && 
            <TCSubmitWrap>
                <UnderConstruction action={COPY_REMOTE_FORM.actionText} />
            </TCSubmitWrap>
        }
        <TCForm 
            onSubmit={onClone} 
            layout = {[2]}
            noCowDucks
            onChange={onChangeBasics} 
            fields={fields}
            buttons={buttons} 
        />
        {detailsLoaded && 
            <Container className={COPY_REMOTE_FORM.detailsWrapperClassName}>
                <Row className={COPY_REMOTE_FORM.detailsHeaderClassName}>
                    {COPY_REMOTE_FORM.detailsHeader}
                </Row>
                <TCForm
                    layout = {[2, 1]}
                    noCowDucks
                    fields={COPY_DB_DETAILS_FORM.fields}
                    values={details} 
                />
            </Container>
        }
    </>)
}
