import React, { useState, useCallback } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const RenderSnippet = (props) => {
    let data = props.dataProvider || {};
    return (
        <SyntaxHighlighter
            style={docco}
            showLineNumbers={true}
            wrapLines={true}>
           {data.response}
        </SyntaxHighlighter>
    )
}
