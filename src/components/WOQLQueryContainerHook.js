import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { WOQLClientObj } from "../init/woql-client-instance";
import {TerminusClientInterceptor} from '../utils/TerminusClientInterceptor';

import TerminusClient from '@terminusdb/terminusdb-client';

function WOQLQueryContainerHook(startQuery){	
	const query=startQuery || false; 
	const [woql, setWoqlQuery] = useState(query);
    const [report, setReport] = useState();
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();

    let commitMsg="Update";

    const updateQuery = (nwoql, commitMsg)=>{
        commitMsg=commitMsg;
        setWoqlQuery(nwoql)
    }

    function processSuccessfulResult(response){
        if(response && response.metadata){
            setReport(response.metadata)
            if(response.bindings && response.bindings.length) setBindings(response.bindings)
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

		woql.execute(woqlClient, commitMsg)
	    .then((response) => {
	        processSuccessfulResult(response)//, start, Date.now())
	    })
	    .catch((error) => {
	        processErrorResult(error)
	    })
    }

    useEffect(() => {       
        if(woql!==false)executeQuery();
    }, [woql])

    
    return [updateQuery, report, bindings, woql];
    
}
 
export { WOQLQueryContainerHook };