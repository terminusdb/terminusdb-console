import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminus-client';
//import WOQLTable from '../../components/Table/WOQLTable';
import { WOQLTable } from '@terminusdb/terminus-react-table';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { PageView } from '../PageView'

import { QueryPane } from "../../components/QueryPane/QueryPane"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { QueryEditor } from "../../components/QueryPane/QueryEditor"
import { QueryLibrary } from "../../components/QueryPane/QueryLibrary"
import { ResultReport } from "../../components/QueryPane/ResultReport"
import { ViewEditor } from "../../components/QueryPane/ViewEditor"
import { ResultPane } from "../../components/QueryPane/ResultPane"

ResultPane

const DocumentView = (props) => {
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();
    const [documentClasses, setDocumentClasses] = useState();

    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())

    useEffect(() => {
        woqlClient.query(docQuery).then((cresults) => {
            processQueryResult(cresults, docQuery)
        }).catch((e) => {
            processQueryError(e, docQuery)
        })
        const q2 = TerminusClient.WOQL.lib().concreteDocumentClasses()
        woqlClient.query(q2).then((dresults) => {
            processClassesResult(dresults, q2)
        }).catch((e) => {
            processClassesError(e, q2)
        })
    }, []);

    function processClassesResult(json, q){
        let res = new TerminusClient.WOQLResult(json, q)
        if(res.hasBindings()){
            setDocumentClasses(res.getBindings())
        }
        else {
            alert("No document classes")
        }
    }

    function processClassesError(e, q){
        alert("Classes error " + JSON.stringify(e))

    }

    function processQueryError(e, q){
        alert("query error " + JSON.stringify(e))
    }


    function processQueryResult(json, q){
        let res = new TerminusClient.WOQLResult(json, q)
        if(res.hasBindings()){
            setBindings(res.getBindings())
        }
        else alert("No query results")
    }

    function headChanged(){}

    return (
    <PageView page="document">
        <QueryPane query={docQuery}>
            <QueryEditor autosubmit="false">
                <QueryLibrary library="myqueries"/>
            </QueryEditor>
            <ResultReport/>
            <ResultPane>
                <ViewEditor />
                <ResultViewer type="table" />
            </ResultPane>
        </QueryPane>
        {bindings && 
            <ResultViewer type="table" bindings={bindings} query={docQuery}/>
        }
        {docQuery && 
        <QueryPane query={docQuery}>
            <ResultViewer type="table" />
        </QueryPane>
        }
    </PageView>   
    )
}


export default DocumentView
