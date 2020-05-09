import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Container } from "reactstrap";

export const QueryPane = ({query, result, className, children}) => {
    
    const [woql, setWoql] = useState(query);
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();
    const [report, setReport] = useState();

    const qpclass = className || "terminus-query-pane"
    if(result && !bindings) processSuccessfulResult(result, Date.now(), Date.now())

    function executeQuery(){
        let start = Date.now()
        woql.execute(woqlClient, commitMsg)
        .then((resoc) => {
            processSuccessfulResult(resoc, start, Date.now())
        })
        .catch((error) => {
            processErrorResult(error, start, Date.now())
        })
    }

    function processSuccessfulResult(res, start, end){
        let rep = {
            start: start, 
            end: end, 
            duration: (end-start)*1000, 
            inserts: res.inserts, 
            deletes: res.deletes, 
            transaction_restart_count: res.transaction_restart_count,
        }
        if(res && res.bindings && res.bindings.length){
            setBindings(res.bindings)
            rep.rows = res.bindings.length
            rep.columns = res.binding[0].length
        }
        setReport(rep)
    }

    function processErrorResult(e, start, end){
        let rep = {
            start: start, 
            end: end, 
            duration: (end-start)*1000,
            error: e 
        }
        /*
        * reset binding
        */
        setBindings([])
        setReport(rep)
    }

    useEffect(() => {
        if(!bindings) executeQuery()
    }, [woql]);

    return (
        <Container className={qpclass}>
            {children}
        </Container>            
    )
}
