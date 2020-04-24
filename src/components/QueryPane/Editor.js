import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import * as tag from "../../labels/tags"

// we use this component for both queries and rules
export const Editor = (props) => {
    const edit = props.edit || false;
    const text = props.text || tag.BLANK;
    const isQuery = props.isQuery || false;
    const [content, setContent] = useState(tag.BLANK);
    const setInputQuery = props.setInputQuery;
    const setInputRule = props.setInputRule;

    let rc = tag.EDITOR_READ_ONLY // edit is false
    if(edit) rc = false;

    const options = { mode: tag.EDITOR_LANGUAGE,
        noHScroll: false,
        theme: tag.EDITOR_THEME,
        readOnly: rc,
        lineNumbers: true}

    useEffect(() => {
        setContent(text);
    }, [text]);

    return (
      <CodeMirror value={ content }
        options={ options }
        onBeforeChange={(editor, data, value) => {
            setContent(value);
        }}
        onChange={(editor, data, value) => {
            setContent(value);
            if(isQuery) setInputQuery(value)
            else setInputRule(value)
        }}/>
    )
}
