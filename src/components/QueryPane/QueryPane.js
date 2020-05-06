import React, { useState, useEffect } from "react";
import { getCurrentDBName, isObject, isArray } from "../../utils/helperFunctions"
import { formatQuery } from "../../utils/format"
import * as lang  from "../../labels/queryFormats";
import * as tag from "../../labels/tags";
import * as viewLabels from "../../labels/viewLabels"
import TerminusClient from '@terminusdb/terminus-client';
import { Editor } from "./Editor"
import { ActionButton } from "./ActionButton"
import { Library } from "./Library"
import { PrintLanguage } from "./PrintLanguage"
import { ResultPane } from "./ResultPane"
import { Viewers } from "./Viewers"
import { Report } from "./Report"
import { WOQLClientObj } from "../../init/woql-client-instance";


export const QueryPane = (props) => {
    // props
    const query = props.query || {};
    const editor = props.editor || {};
    const result = props.result || {};
    const resultReport = props.resultReport || {};
    const resultPane = props.resultPane || {};

    const [commit_msg, setCommitMsg] = useState(false);
    const {woqlClient} = WOQLClientObj();

    // editor
    const [woql, setWoql] = useState(query);
    const [formattedQuery, setFormattedQuery] = useState(false);
    const [qLang, setqLang] = useState(lang.WOQL_JS)
    const [inputQuery, setInputQuery] = useState(false);

    // rule
    const view = TerminusClient.View.table();
    const [rule, setRule] = useState(view);
    const [formattedRule, setFormattedRule] = useState(false);
    const [rLang, setrLang] = useState(lang.WOQL_JS)
    const [inputRule, setInputRule] = useState(false);
    const [showRuleClosable, setShowRuleClosable] = useState(true);

    const [results, setResults] = useState(result);
    const [viewer, setViewer] = useState(viewLabels.TABLE_VIEW);

    // result report
    const [rep, setReport] = useState(false)

    // editor
    useEffect(() => {
        if(isObject(woql)){
            const q = formatQuery(woql, qLang, tag.QUERY);
            setFormattedQuery(q);
            let start = Date.now();
            woql.execute(woqlClient, commit_msg).then((results) => {
                let wr = new TerminusClient.WOQLResult(results, woql)
                let delta = (Date.now() - start)/1000;
                let message = tag.BLANK;
                if(wr.hasBindings()){
                    message = "Query returned " + wr.count()
                        + " results in " + delta + " seconds";
                }
                if(wr.hasUpdates()){
                    message = wr.inserts() + " triples inserted, "
                        + wr.deletes() + " triples deleted in "
                        + delta + " seconds";
                }
                setResults(wr)
                setReport({message: message, status: tag.SUCCESS});
                setCommitMsg(false)
            })
            .catch((err)=>{
                 setCommitMsg(false);
                 setReport({error: err, status: tag.ERROR});
             })
        }
    }, [woql, qLang]);

    // rule
    useEffect(() => {
        const r = formatQuery(rule, rLang, tag.RULE);
        setFormattedRule(r);
    }, [rule, rLang]);

    return (
        <div className="q-pane">

            {/********** editor ***********/}
            {isObject(editor) && <Editor text = { formattedQuery }
                editor = { editor }
                setInputQuery = { setInputQuery }
                isQuery = { true }/>}
            {isObject(editor) && editor.submit && <ActionButton text = { editor.submit }
                lang = { qLang }
                setReport = { setReport }
                inputQuery = { inputQuery }
                setWoql = { setWoql }
                setCommitMsg = { setCommitMsg }
                isQuery = { true }/>}
            {isArray(editor.library) &&  <Library
                libs = { editor.library }
                setWoql = { setWoql }/>}
            {isArray(editor.languages) &&  <PrintLanguage
                languages = { editor.languages }
                isQuery = { true }
                setqLang = { setqLang }/>}

            {/********** result report ***********/}
            {isObject(resultReport) && <Report results = { results }
                resultReport = { resultReport }
                report = { rep }/>}

            {/********** rule ***********/}
            {(isObject(resultPane.viewEditor)) &&
                (resultPane.viewEditor.edit) &&
                <Editor text = { formattedRule }
                    editor = { resultPane.viewEditor }
                    setInputRule = { setInputRule }
                    setShowRuleClosable = { setShowRuleClosable }
                    isQuery = { false }/>}
            {(isObject(resultPane.viewEditor)) &&
                (resultPane.submit != tag.BLANK) && showRuleClosable &&
                <ActionButton
                    text = { resultPane.viewEditor.submit }
                    lang = { rLang }
                    inputRule = { inputRule }
                    setRule = { setRule }
                    isQuery = { false }/>}
            {(isObject(resultPane.viewEditor)) &&
                isArray(resultPane.viewEditor.languages) && showRuleClosable &&
                <PrintLanguage
                    languages = { resultPane.viewEditor.languages }
                    isQuery = { false }
                    setrLang = { setrLang }/>}

            {/********** viewers  ***********/}
            {isObject(resultPane.view) && <Viewers
                views = { resultPane.view }
                setRule = { setRule }
                setViewer = { setViewer }/>}

            {/********** results  ***********/}
            {isObject(results) && <ResultPane results = { results }
                rule = { rule }
                viewer = { viewer }/>}

        </div>
    )
}
