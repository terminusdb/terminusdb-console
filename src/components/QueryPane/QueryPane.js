import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Container } from "reactstrap";

export const QueryPane = ({query, result, type, className, children}) => {
    
    const [woql, setWoql] = useState(query);
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();
    const [report, setReport] = useState();

    const qpclass = className || "terminus-query-pane"
    if(result) processSuccessfulResult(result, Date.now(), Date.now())
    useEffect(() => {
        if(woql && !result) executeQuery()
    }, []);

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

    function updateQuery(nwoql, no_execute){
        setWoql(nwoql)
        !no_execute && executeQuery()
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
        setBindings(res.bindings)
        if(res && res.bindings && res.bindings.length){
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
        setBindings(false)
        setReport(rep)
    }

    if(type && (type == "table" || type == "graph" || type == "chart")){
        return (
            <Container className={qpclass}>
                <ResultView type={type} query={woql} bindings={bindings} updateQuery={updateQuery} />
            </Container>            
        )
    }
    if(type && type == "editor"){
        return (
        <Container className={qpclass}>
            <QueryEditor query={woql} bindings={bindings} updateQuery={updateQuery}>
                <QueryLibrary library="editor"/>
            </QueryEditor>
            <ResultReport report={report} query={woql} bindings={bindings} updateQuery={updateQuery} />
            <ResultPane query={woql} report={report} bindings={bindings} updateQuery={updateQuery} >
                <ViewEditor />
            </ResultPane>        
        </Container>)
    }

    const elements = React.Children.toArray(children) ;	
    const childrenEl = elements.map((child)=>{
        return React.cloneElement(child, { 
            updateQuery:updateQuery,
            report:report,
            query:woql, 
            bindings:bindings
        })
    })

    return (
        <Container className={qpclass}>
            {childrenEl}
        </Container>            
    )
}
