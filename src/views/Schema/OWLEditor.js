import React, { useState, useEffect } from "react";
import { editSchema } from "../../variables/formLabels"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/base16-light.css');
require('codemirror/mode/turtle/turtle.js');
import { commit } from "../../variables/formLabels"

import {Controlled as CodeMirror} from 'react-codemirror2';

export const OWLEditor = (props) => {
    let action = props.edit || false;
    const [content, setContent] = useState(props.dataProvider);
    const [commitMsg, setCommitMsg] = useState();
    const [edit, setEdit] = useState(action);

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

    const [options, setOptions] = useState(readMode);

    useEffect(() => {
        if(props.dataProvider) setContent(props.dataProvider)
        setEdit(props.edit)
    }, [props.dataProvider, props.edit])


    const handleCancel = (ev) => {
        setEdit(false);
        setContent(props.dataProvider || {})
        setOptions(readMode)
    }

    const handleUpdate = (ev) => {
        if(!commitMsg.value){
            console.log("error here no commit")
        }
        else {
            props.onChange(content, commitMsg.value)
        }
    }

    const handleEdit = (ev) => {
        setEdit(true);
        setOptions(writeMode)
    }

    return (
        <>
            <CodeMirror
                value={content}
                options={options}
                onBeforeChange={(editor, data, value) => {
                    setContent(value);
                }}
                onChange={(editor, data, value) => {
                    setContent(value);
                }}
            />
            {(edit) && <>
                <hr className = "my-space-15"/>
                <hr className = "my-space-100"/>
            	<textarea placeholder={ commit.act.input.placeholder }
                    className = { commit.act.input.className }
                    ref={cmsg  => (setCommitMsg(cmsg))}/>
                <hr className = "my-2"/>
                <hr className = "my-space-15"/>
            </>}
            {(!edit) && <button className = { editSchema.edit.className }
                type =  { editSchema.edit.type }
                onClick = {handleEdit}>
                { editSchema.edit.text }
            </button>}
            {(edit) && <button
                className = { editSchema.update.className }
                type =  { editSchema.update.type }
                onClick = {handleUpdate}>
                { editSchema.update.text } </button>
            }
            {(edit) && <button
                className = { editSchema.cancel.className }
                type =  { editSchema.cancel.type }
                onClick = {handleCancel}>
                { editSchema.cancel.text } </button>
            }
        </>
    )
}
