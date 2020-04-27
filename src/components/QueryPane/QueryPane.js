import React, { useState, useEffect } from "react";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
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

export const QueryPane = (props) => {
    // props
    const query = props.query || {};
    const editor = props.editor || {};
    const result = props.result || {};
    const resultReport = props.resultReport || {};
    const resultPane = props.resultPane || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

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

    const [results, setResults] = useState(result);
    const [viewer, setViewer] = useState(viewLabels.TABLE_VIEW);

    // editor
    useEffect(() => {
        if(isObject(woql)){
            const q = formatQuery(woql, qLang, tag.QUERY);
            setFormattedQuery(q);
            dbClient.query(woql).then((results) => {
                let wr = new TerminusClient.WOQLResult(results, woql)
                if(wr.hasBindings()) setResults(wr)
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
                edit = { editor.edit }
                setInputQuery = { setInputQuery }
                isQuery = { true }/>}
            {isObject(editor) && editor.submit && <ActionButton text = { editor.submit }
                lang = { qLang }
                inputQuery = { inputQuery }
                setWoql = { setWoql }
                isQuery = { true }/>}
            {isArray(editor.library) &&  <Library
                libs = { editor.library }
                setWoql = { setWoql }/>}
            {isArray(editor.languages) &&  <PrintLanguage
                languages = { editor.languages }
                isQuery = { true }
                setqLang = { setqLang }/>}
            {/********** rule ***********/}
            {(isObject(resultPane.viewEditor)) &&
                (resultPane.viewEditor.edit) &&
                <Editor text = { formattedRule }
                    edit = { resultPane.viewEditor.edit }
                    setInputRule = { setInputRule }
                    isQuery = { false }/>}
            {(isObject(resultPane.viewEditor)) &&
                (resultPane.submit != tag.BLANK) &&
                <ActionButton
                    text = { resultPane.viewEditor.submit }
                    lang = { rLang }
                    inputRule = { inputRule }
                    setRule = { setRule }
                    isQuery = { false }/>}
            {(isObject(resultPane.viewEditor)) &&
                isArray(resultPane.viewEditor.languages) &&
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
