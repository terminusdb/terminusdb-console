import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { PageView } from '../PageView'
import { PageFailure } from "../../components/Reports/PageFailure"
import { WOQLQueryContainerHook } from "../../components/WOQLQueryContainerHook"
import { DOCUMENT_NO_SCHEMA, SYSTEM_ERROR, NO_DOCUMENT, NO_DOCUMENT_CLASS } from "./constants"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

const DocumentPage = (props) => {
    const {woqlClient} = WOQLClientObj();
    const [happiness, setHappiness] = useState(false);

    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(docQuery);

    function interpretQueryError(report){
        setHappiness(NO_DOCUMENT)
        const hasSchemaGraph = TerminusClient.WOQL.lib().loadBranchGraphNames(woqlClient)
        woqlClient.query(hasSchemaGraph).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, hasSchemaGraph)
            let found = false
            var res
            while(res = wr.next()){
                if(res['SchemaName']["@value"]){
                    found = true
                    continue
                }
            }
            if(!found){
                setHappiness(DOCUMENT_NO_SCHEMA)
            }
        }).catch( (e) => {
            setHappiness(SYSTEM_ERROR)
        })
    }

    function doRebuild(){
        updateQuery(docQuery)
    }

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
    <PageView page="document" onHeadChange={doRebuild}>
        {!happiness &&
            <Loading />
        }
        {(happiness === true) &&
            <ResultViewer type="table" query={woql} bindings={bindings} />
        }
        {(happiness && happiness !== true) &&
            <PageFailure failure={happiness} report={report} />
        }
    </PageView>
    )
}


export default DocumentPage