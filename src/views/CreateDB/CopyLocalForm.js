import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Reports/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_INFO, TERMINUS_COMPONENT } from "../../constants/identifiers"
import { COPY_LOCAL_FORM, COPY_DB_DETAILS_FORM } from "./constants.createdb"
import { goDBHome, goServerHome } from "../../components/Router/ConsoleRouter"
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport";
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"
import { AccessControlErrorPage } from "../../components/Reports/AccessControlErrorPage"
import { Container, Row } from "reactstrap";
import { UnstableWarning } from "../../components/Reports/UnstableWarning"

export const CopyLocalForm = () => {
    const {woqlClient, reconnectServer} = WOQLClientObj();
    let dbl = getDBList()
    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    if(dbl.length == 0 || !canCreate){
        return (<AccessControlErrorPage />)
    }
    const { loading, user } = useAuth0();
    const [localDBs, setLocalDBs] = useState(dbl)
    const [updateLoading, setUpdateLoading] = useState(false);
    const [report, setReport] = useState({
        status: TERMINUS_INFO, 
        message: COPY_LOCAL_FORM.intro
    })
    const [sourceID, setSourceID] = useState()
    const [details, setDetails] = useState({})
    const [newID, setNewID] = useState()
    let update_start = Date.now()

    let basicInfo = {}  
    let fields = COPY_LOCAL_FORM.fields 

    //build values and options from database options
    COPY_LOCAL_FORM.fields.map((item, index) => {
        basicInfo[item.id] = item.value || ""
        if(item.id == "dbsource") fields[index].inputElement.options = getDBOptions(dbl)
    })   


    function getDBOptions(dblist){
        return dblist.map((item) => {
            return { 
                value: `${item.account}/${item.db}`,
                label: item.title 
            }
        })        
    }

    function getStarterTitle(orig){
        let base = orig + " Clone"
        let ntry = base
        let i = 1;
        while(titleTaken(ntry)){
            ntry = base + " (" + (i++) + ")" 
        }
        return ntry
    }

    function titleTaken(ntitle){
        let istaken = false
        localDBs.map((item) => {
            if(item.title == ntitle) istaken = true
        })        
        return istaken
    }

    function getStarterDescription(orig){
        return "(Local Clone) " + orig
    }

    function getDBList(){
        const records = woqlClient.connection.getServerDBMetadata() || [];
        if(!records || records.length == 0){
            return false
        }
        const dblist = records.filter(meta => meta.db != "terminus");    
        const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
        if(dblist.length == 0 && !canCreate){
            return false 
        }      
        return dblist  
    }

    function loadDetailsForDB(dbid){
        let parts = dbid.split('/')
        for(var i = 0 ; i<localDBs.length; i++){
            if(localDBs[i].db == parts[1] && localDBs[i].account == parts[0]) return dbToForm(localDBs[i])
        }
        return {}
    }

    //translate from dblist json to form json
    function dbToForm(item){
        return {
            dbid: `${item.account}/${item.db}`,
            dbname: getStarterTitle(item.title),
            description: getStarterDescription(item.description)
        }
    }

    function onChangeBasics(field_id, value){
        if(field_id == "dbsource"){
            setDetails(loadDetailsForDB(value))
            setSourceID(value)
        }
        else if(field_id == 'newid') {
            setNewID(value)
        }
    }

    function onClone(){
        update_start = Date.now()
        setUpdateLoading(true)
        let sourceURL = woqlClient.server() + sourceID
        let src = {"remote_url": sourceURL, label: details.dbname}
        if(details.description ) src.comment = details.description 
        let cClient = woqlClient.copy()
        let abc = cClient.basic_auth()
        cClient.remote_auth({type: "basic", key: abc.split(":")[1], user: abc.split(":")[0]})
        cClient.account(woqlClient.user_account())
        return cClient.clonedb(src, newID)
        .then(() => {
            let message = `${COPY_LOCAL_FORM.cloneSuccessMessage} (db: ${sourceID})`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(newID, rep)  
        })
        .catch((err) => {
            let message = `${COPY_LOCAL_FORM.cloneFailureMessage} (db: ${sourceID}) `
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setUpdateLoading(false)
        })
    }

     /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, rep){
        woqlClient.connect().then(result=>{
            goDBHome(id, woqlClient.user_account(), rep)
        })
    }

    let buttons = COPY_LOCAL_FORM.buttons 

    return (<>
        {(loading || updateLoading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        <UnstableWarning feature="Cloning Databases" />
        {(report && report.error) && 
            <APIUpdateReport status={report.status} error={report.error} message={report.message} time={report.time} />
        }      
        <TCForm 
            onSubmit={onClone} 
            layout = {[2]}
            noCowDucks
            onChange={onChangeBasics} 
            report={report}
            fields={fields}
            buttons={buttons} 
        />
        {sourceID && 
            <Container className={COPY_LOCAL_FORM.detailsWrapperClassName}>
                <Row className={COPY_LOCAL_FORM.detailsHeaderClassName}>
                    {COPY_LOCAL_FORM.detailsHeader}
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
