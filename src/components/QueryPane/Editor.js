import React from "react";
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/python/python.js');
import {UnControlled as CodeMirror} from 'react-codemirror2';
import {EDITOR_READ_OPTIONS, EDITOR_WRITE_OPTIONS} from "./constants.querypane"

export const CodeViewer = ({text, language}) => {

    let cmoptions = EDITOR_READ_OPTIONS
    cmoptions.language = getCMLanguage(language)
    if(language == "json"){
        cmoptions['json'] = true
        cmoptions['jsonld'] = true
    } 

    return (<CodeMirror value={ text } options={ cmoptions } className="readOnly"/>)
}

export const CodeEditor = ({text, language, onChange, onBlur}) => {
    function getThemeForEditor(lang){
        return "mdn-like"
    }

    let cmoptions = EDITOR_WRITE_OPTIONS
    cmoptions.language = getCMLanguage(language)
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
