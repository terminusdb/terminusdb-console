import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import * as tag from "../../labels/tags"

// we use this component for both queries and rules
export const Editor = (props) => {
    const edit = props.editor.edit || false;
    const text = props.text || tag.BLANK;
    const isQuery = props.isQuery || false;
    const setShowRuleClosable = props.setShowRuleClosable;

    const [content, setContent] = useState(tag.BLANK);
    const setInputQuery = props.setInputQuery;
    const setInputRule = props.setInputRule;

    // rule close and show button
    const closable = props.editor.closable || false;
    const [showClose, setShowClose] = useState(closable);
    const [showRule, setShowRule] = useState(false);
    const [showCodeMirror, setShowCodeMirror] = useState(true);

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

    const handleClose = () => {
        setShowRule(true)
        setShowClose(false)
        setShowCodeMirror(false)
        setShowRuleClosable(false);
    }

    const handleShowRule = () => {
        setShowRule(false)
        setShowRuleClosable(true);
        setShowClose(true)
        setShowCodeMirror(true)
    }

    return (
       <div className = "rule-editor">

          {/***************** Close and Show button for rules *******************/}
          {(!isQuery) && showClose && closable &&
               <button onClick = { handleClose }> {tag.CLOSE_RULE} </button>}
          {(!isQuery) && showRule && closable &&
               <button onClick = { handleShowRule }> {tag.SHOW_RULE} </button>}

          {(showCodeMirror) && <CodeMirror value={ content }
                options={ options }
                onBeforeChange={(editor, data, value) => {
                    setContent(value);
                }}
                onChange={(editor, data, value) => {
                    setContent(value);
                    if(isQuery) setInputQuery(value)
                    else setInputRule(value)
                }}/>}
        </div>
    )
}
