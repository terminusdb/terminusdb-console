import React, { useState, useEffect } from "react";
import { Editor } from "./Editor"
import { Library } from "./Library"
import { LanguageFormatter } from "./LanguageFormatter"
import { ActionButton } from "./ActionButton"
import { ResultPane } from "./ResultPane"
import * as lang  from "../../labels/queryFormats";
import * as tag from "../../labels/tags";
import * as view from "../../labels/viewLabels"
import { isObject, isArray } from "../../utils/helperFunctions";
import { formatQuery } from "../../utils/format"

export const QueryPane = (props) => {
    // props
    const query = props.query || {};
    const editor = props.editor || {};
    const result = props.result || {};
    const resultReport = props.resultReport || {};
    const resultPane = props.resultPane || {};

    // query editor state
    const [woql, setWoql] = useState({});
    const [inputQuery, setInputQuery] = useState(tag.BLANK);
    const [formattedQuery, setFormattedQuery] = useState(tag.BLANK);
    const [queryLanguage, setQueryLanguage] = useState(lang.WOQL_JS);
    const [queryLangChange, setChangedQueryLang] = useState(lang.WOQL_JS);

    //result pane state
    const [resultData, setResultData] = useState({});
    const [viewChange, setViewChange] = useState(view.GRAPH_VIEW);
    const [inputRule, setInputRule] = useState(tag.BLANK);
    const [ruleObject, setRuleObject] = useState({});
    const [ruleLanguage, setRuleLanguage] = useState(lang.WOQL_JS);
    const [ruleLangChange, setChangedRuleLang] = useState(lang.WOQL_JS);
    const [formattedRule, setFormattedRule] = useState(tag.BLANK);

    //query
    useEffect(() => {
        if(isObject(woql)){
            setChangedQueryLang(queryLanguage);
            const q = formatQuery(woql, queryLanguage, tag.QUERY);
            setFormattedQuery(q);
        }
        else setFormattedQuery(tag.BLANK);
    }, [woql, queryLanguage]);

    // rules
    useEffect(() => {
        if(isObject(inputRule)){
            setChangedRuleLang(ruleLanguage);
            const r = formatQuery(inputRule, ruleLanguage, tag.RULE);
            setFormattedRule(r);
        }
        else setFormattedRule(tag.BLANK);
    }, [ruleLanguage]);

    return(
        <div className="q-pane">

            {/*****  QUERY *****/}
            {/*****  load editor component *****/}
            {isObject(editor) && <Editor
                query = { formattedQuery }
                isQuery = { true }
                edit = { editor.edit }
                setInputQuery = { setInputQuery }/>}
            {/*****  load Language Formatter component *****/}
            {isArray(editor.languages) && <LanguageFormatter
               setQueryLanguage = { setQueryLanguage }
               isQuery = { true }
               queryLanguages = { editor.languages }/>}
             {/*****  load Library component *****/}
             {isArray(editor.library) && <Library
                libs = { editor.library }
                changeWoql = { setWoql }
                isQuery = { true }
                setResultData = { setResultData }
                library_autosubmit = { editor.library_autosubmit }/>}
             {/*****  load Submit component *****/}
             {editor.submit && <ActionButton submit = { editor.submit }
                woql = { woql }
                queryLang = { queryLangChange }
                isQuery = { true }
                setResultData = { setResultData }
                inputQuery = { inputQuery }/>}

             {/*****  RESULT *****/}
             {/*****  load Result Pane component *****/}
             {isObject(resultPane) &&
                <ResultPane resultData = { resultData }
                    ruleObject = { ruleObject }
                    resultPane = { resultPane }
                    setViewChange = { setViewChange }/>}
             {/*****  load rule editor component *****/}
             {isObject(resultPane) && resultPane.viewEditor.edit && <Editor
                rule = { formattedRule }
                edit = { resultPane.viewEditor.edit }
                isRule = { true }
                setInputRule = { setInputRule }/>}
            {/*****  load rule Language Formatter component *****/}
            {isArray(resultPane.viewEditor.languages) && <LanguageFormatter
               setRuleLanguage = { setRuleLanguage }
               isRule = { true }
               ruleLanguages = { resultPane.viewEditor.languages }/>}
            {/*****  load rule update component *****/}
            {resultPane.viewEditor.submit && <ActionButton
                submit = { resultPane.viewEditor.submit }
                ruleLang = { ruleLanguage }
                isRule = { true }
                setRuleObject = { setRuleObject }
                inputRule = { inputRule }/>}
        </div>
    )
}
