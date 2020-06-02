import React, { useState, useEffect } from "react";
import Loading from "../../components/Reports/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { SimplePageView } from '../Templates/SimplePageView'
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import { DOCUMENT_NO_SCHEMA, SYSTEM_ERROR, NO_DOCUMENT, NO_DOCUMENT_CLASS } from "./constants.pages"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {DBContextObj} from "../../components/Query/DBContext";

const DocumentPage = (props) => {
    /*
    * global woqlClient obj
    */
    const {woqlClient} = WOQLClientObj();
    const {ref,branch} = DBContextObj();

    const [happiness, setHappiness] = useState(false);
    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(woqlClient,docQuery,ref,branch);

    function interpretQueryError(report){
        setHappiness(NO_DOCUMENT)
        const hasSchemaGraph = TerminusClient.WOQL.lib().loadBranchGraphNames(woqlClient)
        woqlClient.query(hasSchemaGraph).then((results) => {
            if(results.bindings && results.bindings.length){
                let found = false
                for(var i = 0; i<results.bindings.length ; i++){
                    let res = results.bindings[0]
                    if(res['SchemaName']["@value"]){
                        found = true
                        continue
                    }
                }
                if(!found){
                    setHappiness(DOCUMENT_NO_SCHEMA)
                }    
            }
        }).catch( (e) => {
            setHappiness(SYSTEM_ERROR)
        })
    }

    /*function doRebuild(){
        updateQuery(docQuery)
    }*/

    function interpretEmptyResult(){
        const hasClasses = TerminusClient.WOQL.lib().concreteDocumentClasses()
        woqlClient.query(hasClasses).then((dresults) => {
            if(dresults.bindings && dresults.bindings.length > 1 ){
                setHappiness(NO_DOCUMENT)
            }
            else {
                setHappiness(NO_DOCUMENT_CLASS)
            }
        }).catch((e) => {
            setHappiness(SYSTEM_ERROR)
        })
    }

    useEffect(() => {
        if(report){
            if(report.error || report == "error") {
                interpretQueryError(report)
            }
            else if(report.rows == 0){
                interpretEmptyResult()
            }
            else {
                setHappiness(true)
            }
        }
    }, [report]);

    return (
    //onHeadChange={doRebuild}
    <SimplePageView page="document" >
        {!happiness &&
            <Loading />
        }
        {(happiness === true) &&
            <ResultViewer type="table" query={woql} bindings={bindings} />
        }
        {(happiness && happiness !== true) &&
            <TerminusDBSpeaks failure={happiness} report={report} />
        }
    </SimplePageView>
    )
}


export default DocumentPage
