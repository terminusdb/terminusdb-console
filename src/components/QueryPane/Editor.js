import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import * as tag from "../../labels/tags"


export const CodeViewer = ({text, language}) => {

    function getThemeForViewer(lang){
        return "mdn-like"
    }

    language = language || "javascript"
    let theme = getThemeForViewer(language)
    let cmoptions = {
        mode: language,
        noHScroll: false,
        theme: theme,
        readOnly: "nocursor",
        lineNumbers: true
    }
    return (<CodeMirror value={ text } options={ cmoptions }/>)
}

export const CodeEditor = ({text, language, onChange, onBlur}) => {
    function getThemeForEditor(lang){
        return "mdn-like"
    }

    language = language || "javascript"
    let theme = getThemeForEditor(language)
    let cmoptions = {
        mode: language,
        noHScroll: false,
        theme: theme,
        readOnly: false,
        lineNumbers: true
    }
    return (
    <CodeMirror value={ text } options={ cmoptions }
        onChange={(editor, data, value) => {
            if(onChange) onChange(content);
        }}
        onBlur={(editor, data, value) => {
            if(onBlur) onBlur(content);
        }}
    />)

}


