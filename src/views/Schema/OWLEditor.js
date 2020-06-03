import React, { useState, useEffect } from "react";
require('codemirror/lib/codemirror.css');
require('codemirror/theme/base16-light.css');
require('codemirror/mode/turtle/turtle.js');

import {Controlled as CodeMirror} from 'react-codemirror2';
import { OWL_CSS } from "./constants.schema"


export const OWLEditor = (props) => {
    const [content, setContent] = useState(props.dataProvider || "");
    const readMode = {
        mode: 'turtle',
        theme: 'base16-light',
        readOnly: 'nocursor',
        lineNumbers: true
    }

    const writeMode = {
        mode: 'turtle',
        theme: 'base16-light',
        readOnly: false,
        lineNumbers: true
    }

    const [options, setOptions] = useState();

    useEffect(() => {
        if(props.dataProvider) setContent(props.dataProvider)
        setOptions(props.edit ? writeMode : readMode)
    }, [props.dataProvider, props.edit])

    function updateContent(val){
        if(props.onChange) props.onChange(val)
        setContent(val)
    }


    let css = (props.edit ? OWL_CSS.writeContainer: OWL_CSS.readContainer)

    return (
        <CodeMirror
            className={css}
            value={content}
            options={options}
            onBeforeChange={(editor, data, value) => {
                updateContent(value);
            }}
            onChange={(editor, data, value) => {
                updateContent(value);
            }}
        />
    )
}
