import React, {useState } from "react";
import { QueryEditor } from "./QueryEditor"
import { QueryLibrary } from "./QueryLibrary"
import { ReportWrapper } from "./ReportWrapper"
import {WOQLQueryContainerHook} from "../WOQLQueryContainerHook";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import {ResultQueryPane} from './ResultQueryPane';
/*
* this is only the queryEditor you don't need to process result;
*/
export const QueryPane = ({query,className,resultView, startLanguage, queryText}) => {

    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(query);
    const [baseLanguage, setBaseLanguage] = useState(startLanguage || "js");
    const [content, setContent] = useState(initcontent); 

    const [showLanguage, setShowLanguage] = useState(false);   
    const [showContent, setShowContent] = useState("");
    /*
    *onChange will be update
    */
    let initcontent = queryText || ""
    //to be review
    //if(!initcontent && query){
        //initcontent = makeWOQLIntoString(query, baseLanguage)
    //}
    const qpclass = className || "terminus-query-pane";
    const disabled = bindings ? {} : {disabled:true};

    return(
            <>
              <ReportWrapper currentReport={report} />
              <Tabs activeKey="viewer" id="query_tabs">
                  <Tab eventKey="query" label="Query Panel">
                    <QueryEditor 
                        baseLanguage={baseLanguage}
                        setBaseLanguage={setBaseLanguage}
                        content={content}
                        saveContent={setContent}
                        showLanguage={showLanguage}
                        setShowLanguage={setShowLanguage}
                        showContent={showContent}
                        setShowContent={setShowContent}
                        display={"hidden"} 
                        editable={true} 
                        query={woql} 
                        updateQuery={updateQuery} 
                        languages={["js", "json", "python"]}>
                        <QueryLibrary library="editor"/>
                    </QueryEditor>
                  </Tab>
                  <Tab eventKey="viewer" label="Result Viewer" {...disabled}>
                    <ResultQueryPane 
                        resultView={resultView} 
                        bindings={bindings} 
                        query={woql} 
                        updateQuery={updateQuery}/>
                  </Tab>
                </Tabs>
            </>
    )
}
                   