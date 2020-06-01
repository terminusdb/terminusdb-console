import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import {TerminusClientInterceptor} from './TerminusClientInterceptor';

import TerminusClient from '@terminusdb/terminusdb-client';

function WOQLQueryContainerHook(startQuery){	
	const query=startQuery || false; 
	const [woql, setWoqlQuery] = useState(query);
    const [report, setReport] = useState();
    const [bindings, setBindings] = useState();
    const [loading, setLoading] = useState();
    const {woqlClient} = WOQLClientObj();

    const [cmsg, setCMsg] = useState("Update Query from Console Query Page")

    const updateQuery = (nwoql, commitMsg)=>{
        setCMsg(commitMsg)
        setWoqlQuery(nwoql)
    }

    function processSuccessfulResult(response){
        if(response && response.metadata){
            setReport(response.metadata)
            if(typeof response.bindings != "undefined") setBindings(response.bindings)
        }
    }

    /*
    * I have to review the error in interceptor
    */
    function processErrorResult(e){
    	 /*let rep = {
            start: start, 
            end: end, 
            duration: (end-start)*1000,
            error: e 
        }*/
        setBindings(undefined)
        setReport({"error":e});
    }

    function executeQuery() {
        setLoading(true)
		woql.execute(woqlClient, cmsg)
	    .then((response) => {
	        processSuccessfulResult(response)//, start, Date.now())
	    })
	    .catch((error) => {
	        processErrorResult(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {       
        if(woql!==false) executeQuery();
    }, [woql])

    
    return [updateQuery, report, bindings, woql, loading];
    
}
 
export { WOQLQueryContainerHook };