import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
//import WOQLTable from '../../components/Table/WOQLTable';
import { WOQLTable } from '@terminusdb/terminusdb-react-table';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { PageView } from '../PageView'
import { DialogueBox } from "../../Reports/DialogueBox"
import { Container, Row } from "reactstrap";
import { QueryPane } from "../../components/QueryPane/QueryPane"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { QueryEditor } from "../../components/QueryPane/QueryEditor"
import { QueryLibrary } from "../../components/QueryPane/QueryLibrary"
import { ResultReport } from "../../components/QueryPane/ResultReport"
import { ViewEditor } from "../../components/QueryPane/ViewEditor"
import { ResultPane } from "../../components/QueryPane/ResultPane"

import {WOQLQueryContainerHook} from "../../components/WOQLQueryContainerHook";


const DocumentView = (props) => {
    const [bindings, setBindings] = useState();
    //const {woqlClient} = WOQLClientObj();
    const [documentClasses, setDocumentClasses] = useState();
    const [hasDocuments, setHasDocuments] = useState(2);

    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())

    //const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(docQuery);


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
            setHasDocuments(true)
        }
        else {
            setHasDocuments(false)
        }
    }

    function headChanged(){}


    return (
    <PageView page="document">
         <Container className={qpclass}>
            <ResultViewer type={"table"} query={woql} bindings={bindings} updateQuery={updateQuery} />
         </Container>
    {!hasDocuments &&
        <DialogueBox message = { 'No Documents available to show, You can create new Documents.' }/>}
    </PageView>
    )
}


export default DocumentView
