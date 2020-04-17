import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import * as tag from "../../labels/tags"

// we use this component for both queries and rules

export const Editor = (props) => {
    // query
    const query = props.query || false;
    const qEdit = props.edit || false;
    const setInputQuery = props.setInputQuery;
    const isQuery = props.isQuery || false;

    //rule
    const rule = props.rule || tag.BLANK;
    const rEdit = props.edit || false;
    const isRule = props.isRule || false;
    const setInputRule = props.setInputRule;

    const [content, setContent] = useState(tag.BLANK);

    var readOnly = tag.EDITOR_READ_ONLY;
    if(qEdit) readOnly = false;
    if(rEdit) readOnly = false;

    useEffect(() => {
        setContent(query);
    }, [query]);

    useEffect(() => {
        setContent(rule);
    }, [rule]);

    const options = { mode: tag.EDITOR_LANGUAGE,
        noHScroll: false,
        theme: tag.EDITOR_THEME,
        readOnly: readOnly,
        lineNumbers: true}

    return (
      <CodeMirror value={ content }
        options={ options }
        onBeforeChange={(editor, data, value) => {
            setContent(value);
        }}
        onChange={(editor, data, value) => {
            setContent(value);
            if(isQuery) setInputQuery(value);
            if(isRule) setInputRule(value);
        }}/>
    )
}
