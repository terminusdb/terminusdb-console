import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminus-client';
import WOQLTable from '@terminusdb/terminus-react-table';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { PageView } from '../PageView'
import { DialogueBox } from "../../components/DialogueBox"


const DocumentView = (props) => {
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();
    const [documentClasses, setDocumentClasses] = useState();
    const [hasDocuments, setHasDocuments] = useState(false);

    const [activeQuery, setActiveQuery] = useState();

    useEffect(() => {
        const q = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())
        woqlClient.query(q).then((cresults) => {
            processQueryResult(cresults, q)
        }).catch((e) => {
            processQueryError(e, q)
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
            //setError()
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
        alert("No query results")
    }

    function headChanged(){}

    return (
        < PageView >
            {bindings && hasDocuments &&
                <WOQLTable bindings={bindings} />
            }
            {!hasDocuments &&
                <DialogueBox message = { 'No Documents available to show, You can create new Documents.' }/>}

        </PageView>
    )
}


export default DocumentView
