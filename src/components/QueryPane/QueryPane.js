import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Container, Row } from "reactstrap";
import { ResultViewer } from "./ResultViewer"
import { QueryEditor } from "./QueryEditor"
import { QueryLibrary } from "./QueryLibrary"
import { ResultReport } from "./ResultReport"
import { ViewEditor } from "./ViewEditor"
import { ResultPane } from "./ResultPane"
import { ViewChooser } from "./ViewChooser"

export const QueryPane = ({query, result, type, className, children}) => {
    
    const [woql, setWoql] = useState(query);
    const [bindings, setBindings] = useState();
    const {woqlClient} = WOQLClientObj();
    const [report, setReport] = useState();

    const qpclass = className || "terminus-query-pane"
    if(result) processSuccessfulResult(result, Date.now(), Date.now())

    useEffect(() => {
        if(query && !result) executeQuery(query)
    }, []);

    function executeQuery(q, commitMsg){
        let start = Date.now()
        q.execute(woqlClient, commitMsg)
        .then((resoc) => {
            processSuccessfulResult(resoc, start, Date.now())
        })
        .catch((error) => {
            processErrorResult(error, start, Date.now())
        })
    }

    function updateQuery(nwoql, commitMsg, no_execute){
        !no_execute && executeQuery(nwoql, commitMsg)
        setWoql(nwoql)
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
            rep.bindings = res.bindings.length
            //rep.columns = Object.keys(res.binding[0]).length
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
                <ResultViewer type={type} query={woql} bindings={bindings} updateQuery={updateQuery} />
            </Container>            
        )
    }
    if(type && type == "editor"){
        return (
        <Container className={qpclass}>
            <Row>
                <QueryEditor closable="false" query={woql} bindings={bindings} updateQuery={updateQuery} language="js" languages={["js", "json", "python"]}>
                    <QueryLibrary library="editor"/>
                </QueryEditor>
            </Row>
            <Row>
                <ResultReport report={report} query={woql} bindings={bindings} updateQuery={updateQuery} />
                <ResultPane query={woql} report={report} bindings={bindings} updateQuery={updateQuery} >
                    <ViewEditor display="hidden" query={woql} report={report} bindings={bindings} updateQuery={updateQuery} />
                    <ViewChooser query={woql} report={report} bindings={bindings} updateQuery={updateQuery} />
                    <ResultViewer type="table" query={woql} bindings={bindings} updateQuery={updateQuery} />
                </ResultPane>
            </Row>        
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
