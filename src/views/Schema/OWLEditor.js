import React, { useState, useEffect } from "react";
require('codemirror/lib/codemirror.css')
require('codemirror/mode/turtle/turtle.js')

import {Controlled as CodeMirror} from 'react-codemirror2'
import { OWL_CSS } from "./constants.schema"
import TerminusClient  from "@terminusdb/terminusdb-client"


export const OWLEditor = ({dataProvider, prefixes, edit, onChange}) => {
    const [content, setContent] = useState(dataProvider || "");

    const readMode = {
        mode: 'turtle',
        readOnly: true,
        lineNumbers: true
    }

    const writeMode = {
        mode: 'turtle',
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
            if(content == getEmptyTurtle()){
                setContent("")
            }
        }
        else if(mode == "read" && edit){
            setMode("write")
            if(content == ""){
                setContent(getEmptyTurtle())
            }
        }
    }, [edit])

    function updateContent(val){
        if(onChange) onChange(val)
        setContent(val)
    }

    function getEmptyTurtle() {
        let cts = []
        let standard_urls = TerminusClient.UTILS.standard_urls
        for(var pre in standard_urls){
            cts.push(`@prefix ${pre}: <${standard_urls[pre]}> .` + "\n")
        }
        for(var i = 0; i<prefixes.length; i++){
            let wun = `@prefix ${prefixes[i]['Prefix']['@value']}: <${prefixes[i]['IRI']['@value']}> .` + "\n"
            cts.push(wun)
        }
        return cts.join("")
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
