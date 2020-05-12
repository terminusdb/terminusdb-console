import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { ResultViewer } from "./ResultViewer"
import { QueryEditor } from "./QueryEditor"
import { QueryLibrary } from "./QueryLibrary"
import { ResultReport } from "./ResultReport"
import { ViewEditor } from "./ViewEditor"
import { ResultPane } from "./ResultPane"
import { ViewChooser } from "./ViewChooser";
import {WOQLQueryContainerHook} from "../WOQLQueryContainerHook";
import { queryControls } from "../../variables/formLabels"
/*
* this is only the queryEditor you don't need to process result; 
*/

export const QueryPane = ({query, result, type, className, children}) => {

    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(query);
    const qpclass = className || "terminus-query-pane"
  
    return (
        <Container className={qpclass}>
            <Row>
                <QueryEditor closable="false" query={woql} bindings={bindings} updateQuery={updateQuery} language="js" languages={["js", "json", "python"]}>
                    <QueryLibrary library="editor"/>
                </QueryEditor>
            </Row>
            <Row>
                <ResultReport report={report} />
                <Container >
                    <ViewEditor display="hidden" query={woql} report={report} bindings={bindings} updateQuery={updateQuery} />
                    <ViewChooser query={woql} report={report} bindings={bindings} updateQuery={updateQuery} />
                    
                    <ResultViewer type="table" bindings={bindings}/>
                </Container>
            </Row>     
        </Container>           
    )
}
