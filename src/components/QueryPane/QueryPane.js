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
import { queryControls } from "../../variables/formLabels";
import { Tabs, Tab } from 'react-bootstrap-tabs';
/*
* this is only the queryEditor you don't need to process result; 
*/
export const QueryPane = ({query,className}) => {

    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(query);
    const qpclass = className || "terminus-query-pane";
    const disabled = bindings ? {} : {disabled:true}   
  
    return(
            <>
                <Tabs defaultActiveKey="query" id="query_tabs">
                  <Tab eventKey="query" label="Query Panel">
                    <QueryEditor display={"hidden"} editable={true} closable="false" query={woql} bindings={bindings} updateQuery={updateQuery} language="js" languages={["js", "json", "python"]}>
                        <QueryLibrary library="editor"/>
                    </QueryEditor>
                  </Tab>
                  <Tab eventKey="viewer" label="Result Wiewer" {...disabled}>
                    <Container >
                        <ViewEditor display="hidden" query={woql} report={report} bindings={bindings} updateQuery={updateQuery} />
                        <ViewChooser/>    
                        <ResultViewer type="table" bindings={bindings} query={woql}/>
                    </Container>
                  </Tab>
                </Tabs>
                <ResultReport currentReport={report} />
            </>             
    )
}
