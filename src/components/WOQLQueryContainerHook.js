import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { WOQLClientObj } from "../init/woql-client-instance";
import {TerminusClientInterceptor} from '../utils/TerminusClientInterceptor';
import TerminusClient from '@terminusdb/terminus-client';

function WOQLQueryContainerHook(startQuery){
	const query=startQuery || false; 
	const [woql, setWoqlQuery] = useState(query);
    const {woqlClient} = WOQLClientObj();
    const [report, setReport] = useState();
    const [commitMsg, setQueryCommitMsg] = useState("bla bla");
    const [bindings, setBindings] = useState();

    function processSuccessfulResult(response){
        if(response && response.bindings && response.bindings.length){
            setBindings(response.bindings)
            //rep.rows = res.bindings.length
            //rep.columns = res.binding[0].length
            setReport(response.metadata);
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
        setReport("error");
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

    const setWoql = (prop) => {
    	setWoqlQuery(prop)
    }

    const setCommitMsg= (prop) => setQueryCommitMsg(prop);

    return [setWoql, setCommitMsg, report, bindings];
    
}
 
export { WOQLQueryContainerHook };