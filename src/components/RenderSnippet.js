import React, { useState, useCallback } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const RenderSnippet = (props) => {

    let data = props.dataProvider;
    //let data = '{"canApprove": true, "hasDisplayed": false}'

    return (
        <SyntaxHighlighter language="javascript"
                            style={docco}
                            showLineNumbers={true}
                            wrapLines={true}>
            {JSON.stringify(data)}
        </SyntaxHighlighter>
    )
}

export default RenderSnippet;
