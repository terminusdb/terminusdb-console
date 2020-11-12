import React, { useState, useEffect } from "react";
require('codemirror/lib/codemirror.css')
require("codemirror/mode/javascript/javascript.js")
//require('codemirror/mode/javascript/jsonld.js')

import {Controlled as CodeMirror} from 'react-codemirror2'
import { OWL_CSS } from "./constants.document"
import TerminusClient  from "@terminusdb/terminusdb-client"


export const JSONEditor = ({dataProvider, prefixes, edit, onChange}) => {
    
    const [content, setContent] = useState(dataProvider || "");

    useEffect(() => {
        setContent(dataProvider)
    }, [edit])

    const readMode = {
        mode: {
            name: "javascript",
            jsonld: true,
            statementIndent: 2
        },
        readOnly: true,
        lineNumbers: true
    }

    const writeMode = {
        mode: {
            name: "javascript",
            jsonld: true,
            statementIndent: 2
        },
        readOnly: false,
        lineNumbers: true
    }

    const [mode, setMode] = useState(edit ? "write" : "read");

    function getCMOptions(){
        if(mode == "write") return writeMode
        return readMode
    }

    useEffect(() => {
        if(mode == "write" && !edit){
            setMode("read")
        }
        else if(mode == "read" && edit){
            setMode("write")
        }
    }, [edit])

    function updateContent(val){
        if(onChange) onChange(val)
        setContent(val)
    }

    let css = (edit ? OWL_CSS.writeContainer: OWL_CSS.readContainer)
    if(!content) return null 
    return (
        <CodeMirror
            className={css}
            value={content}
            options={getCMOptions()}
            onBeforeChange={(editor, data, value) => {
                updateContent(value);
            }}
            onChange={(editor, data, value) => {
                updateContent(value);
            }}
        />
    )
}
