import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Reports/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT } from "../../constants/identifiers"
import { COPY_LOCAL_FORM, COPY_DB_DETAILS_FORM } from "./constants.createdb"
import { goDBHome } from "../../components/Router/ConsoleRouter"
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport";
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"
import { AccessControlErrorPage } from "../../components/Reports/AccessControlErrorPage"
import { Container, Row } from "reactstrap";


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
    const [report, setReport] = useState();
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
                value: item.db,
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
        for(var i = 0 ; i<localDBs.length; i++){
            if(localDBs[i].db == dbid) return dbToForm(localDBs[i])
        }
        return {}
    }

    //translate from dblist json to form json
    function dbToForm(item){
        return {
            dbid: item.db,
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
        let accountid = woqlClient.account() || woqlClient.uid()
        let sourceURL = woqlClient.server() + accountid + "/" + sourceID
        let src = {"remote_url": sourceURL, label: details.dbname, comment: details.description }
        //fake remote auth just use local basic auth
        let abc = woqlClient.basic_auth()
        woqlClient.remote_auth({type: "basic", key: abc.split(":")[1], user: abc.split(":")[0]})
        return woqlClient.clonedb(src, newID)
        .then(() => {
            let message = `${COPY_LOCAL_FORM.cloneSuccessMessage} (id: ${sourceID})`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterCreate(sourceID, accountid, rep)  
        })
        .catch((err) => {
            let message = `${COPY_LOCAL_FORM.cloneFailureMessage} (id: ${sourceID}) `
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
        woqlClient.connect().then(result=>{
            goDBHome(id, acc, rep)
        })
    }

    let buttons = COPY_LOCAL_FORM.buttons 

    return (<>
        {(loading || updateLoading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        {(report && report.error) && 
            <APIUpdateReport status={report.status} error={report.error} message={report.message} time={report.time} />
        }      
        <TCForm 
            onSubmit={onClone} 
            layout = {[2]}
            noCowDucks
            onChange={onChangeBasics} 
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
