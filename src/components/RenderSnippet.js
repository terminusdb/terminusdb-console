import React, { useState, useCallback } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { useForm } from 'react-hook-form';
import { magula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const RenderSnippet = (props) => {
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data) =>{
       console.log('****data', data)
    }

    let data = props.dataProvider || {};
    return (
        <form onSubmit={ handleSubmit(onSubmit) }>
                <SyntaxHighlighter
                    style={magula}
                    showLineNumbers={true}
                    wrapLines={true}>
                   {data.response}
                </SyntaxHighlighter>
        </form>
    )
}
