import React, {useState,useMemo } from "react";
import { QueryEditor } from "./QueryEditor"
import { QueryLibrary } from "./QueryLibrary"
import { ReportWrapper } from "./ReportWrapper"
import {WOQLQueryContainerHook} from "../Query/WOQLQueryContainerHook";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import {ResultQueryPane} from './ResultQueryPane';
import TerminusClient from '@terminusdb/terminusdb-client';
import {QUERY_PANEL_TITLE,QUERY_EDITOR_LABEL} from "./constants.querypane"
import {DBContextObj} from "..//Query/DBContext";

/*
* this is only the queryEditor you don't need to process result;
*/
export const QueryPane = ({query,className,resultView, startLanguage, queryText}) => {
    /*
    * maybe a copy of this
    */

    const {woqlClient} = WOQLClientObj();
    const {ref,branch} = DBContextObj()
    const [updateQuery, report, bindings, woql, loading] = WOQLQueryContainerHook(woqlClient, query, branch, ref);
    const [baseLanguage, setBaseLanguage] = useState(startLanguage || "js");
    const [content, setContent] = useState(initcontent); 

    const [showLanguage, setShowLanguage] = useState(false);   
    const [showContent, setShowContent] = useState("");
    const [selectedTab, changeTab] = useState(0);
    const [error, setError] = useState(false);
    /*
    *onChange will be update
    */
    let initcontent = queryText || ""

    const [disabled]  = useMemo(() => {
        if(bindings){
            changeTab(1)
            return [{}]
        }else return [{disabled:true}]
    }, [bindings])

    const onSelect=(k)=>{
        changeTab(k)
    }

    //
    const errorObj=error===false ? {currentReport:report} : {type:"warning" , message:`${QUERY_EDITOR_LABEL.syntaxErrorMessage} ${error.message}`}
    const errorChild=error===false ? "" : <>{QUERY_EDITOR_LABEL.syntaxErrorMessage} <span className="report__text--bold">{error.message}</span></>
    return(
        <>
            <ReportWrapper {...errorObj}>{errorChild}</ReportWrapper>         
            <Tabs selected={selectedTab}  onSelect={onSelect} id="query_tabs">
                <Tab label={QUERY_PANEL_TITLE}>
                    <QueryEditor
                        setMainError={setError}
                        mainError={error}
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
                <Tab label="Result Viewer" {...disabled}>
                    <ResultQueryPane 
                        resultView={resultView} 
                        bindings={bindings || []} 
                        query={woql} 
                        updateQuery={updateQuery}/>
                    </Tab>
            </Tabs>
        </>
    )
}
                   