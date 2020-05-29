import React, {useState } from "react";
import { QueryEditor } from "./QueryEditor"
import { QueryLibrary } from "./QueryLibrary"
import { ReportWrapper } from "./ReportWrapper"
import {WOQLQueryContainerHook} from "../Query/WOQLQueryContainerHook";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import {ResultQueryPane} from './ResultQueryPane';
import TerminusClient from '@terminusdb/terminusdb-client';
import {QUERY_PANEL_TITLE} from "./constants.querypane"

/*
* this is only the queryEditor you don't need to process result;
*/
export const QueryPane = ({query,className,resultView, startLanguage, queryText}) => {
    const {woqlClient} = WOQLClientObj();
    TerminusClient.WOQL.setContextFromClient(woqlClient)//sets constants in WOQL to use for forming resource strings (COMMITS, DB, META, REF, BRANCH, HEAD)
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
    const disabled = {}////bindings ? {} : {disabled:true};

    return(
        <>
            <ReportWrapper currentReport={report} />          
            <Tabs defaultActiveKey={2} activeKey={2} id="query_tabs">
                <Tab eventKey={1} label={QUERY_PANEL_TITLE}>
                    <QueryEditor 
                        baseLanguage={baseLanguage}
                        setBaseLanguage={setBaseLanguage}
                        content={content}
                        saveContent={setContent}
                        showLanguage={showLanguage}
                        setShowLanguage={setShowLanguage}
                        showContent={showContent}
                        setShowContent={setShowContent}
                        editable={true} 
                        query={woql} 
                        updateQuery={updateQuery} 
                        languages={["js", "json", "python"]}>
                        <QueryLibrary library="editor"/>
                    </QueryEditor>
                </Tab>
                <Tab eventKey={2} label="Result Viewer" {...disabled}>
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
                   