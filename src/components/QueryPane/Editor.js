import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/python/python.js');
import {UnControlled as CodeMirror} from 'react-codemirror2';
import * as tag from "../../labels/tags"

export const CodeViewer = ({text, language}) => {
    function getThemeForViewer(lang){
        return "mdn-like"
    }

    language = getCMLanguage(language)
    let theme = getThemeForViewer(language)
    let cmoptions = {
        mode: language,
        noHScroll: false,
        theme: theme,
        readOnly: "nocursor",
        lineNumbers: true
    }
    if(language == "json") cmoptions['jsonld'] = true
    return (<CodeMirror value={ text } options={ cmoptions } className="readOnly"/>)
}

export const CodeEditor = ({text, language, onChange, onBlur}) => {
    function getThemeForEditor(lang){
        return "mdn-like"
    }

    language = getCMLanguage(language)
    let theme = getThemeForEditor(language)
    let cmoptions = {
        mode: language,
        noHScroll: false,
        theme: theme,
        lineNumbers: true,
        autoCursor:false
    }
    if(language == "json"){
        cmoptions['json'] = true
        cmoptions['jsonld'] = true
    } 
    return (
    <CodeMirror value={ text } options={ cmoptions }
        onChange={(editor, data, value) => {
            if(onChange) onChange(value);
        }}
        onBlur={(editor, data) => {
            if(onBlur) onBlur(editor.doc.getValue());
        }}
    />
    )

}


function getCMLanguage(language){
    if(language == "python") return language
    if(language == "json") return "javascript"
    return "javascript"
}
