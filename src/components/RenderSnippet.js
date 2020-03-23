import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { editSchema } from "../variables/formLabels"
import { APICallsHook } from "../hooks/APICallsHook"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/base16-light.css');
require('codemirror/mode/turtle/turtle.js');
import { UPDATE_SCHEMA }  from '../labels/apiLabels'

import {Controlled as CodeMirror} from 'react-codemirror2';

export const RenderSnippet = (props) => {
    const { register, handleSubmit, errors } = useForm();
    let data = props.dataProvider || {};
    let action = props.edit || false;
    const [content, setContent] = useState(data.response);
    const [updatedSchema, setSchema] = useState('');
    const [edit, setEdit] = useState(action);
    const [options, setOptions] = useState({mode: 'turtle',
        theme: 'base16-light',
        readOnly: 'nocursor',
        lineNumbers: true});

    const [dataResponse, loading] = APICallsHook(UPDATE_SCHEMA,
                                                null,
                                                updatedSchema);

    const handleUpdate = (ev) => {
        setEdit(false);
        setSchema(content);
        setOptions({mode: 'turtle',
            theme: 'base16-light',
            readOnly: 'nocursor',
            lineNumbers: true})
    }

    const handleEdit = (ev) => {
        setEdit(true);
        setOptions({mode: 'turtle',
            theme: 'base16-light',
            readOnly: false,
            lineNumbers: true})
    }
    return (
        <>
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
                onClick = {handleUpdate}>
                { editSchema.cancel.text } </button>
            }
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
        </>
    )
}
