import React, { useState } from 'react';
import { RENDER_TYPE_SNIPPET } from "../../labels/renderTypeLabels";
import { RenderSnippet } from "../../components/RenderSnippet";
import { GET_SCHEMA } from '../../labels/apiLabels';
import { APICallsHook } from "../../hooks/APICallsHook";
import { isObject } from "../../utils/helperFunctions";

export const OWL = (props) => {

        const [dataCallResponse] = APICallsHook(GET_SCHEMA,
                                                RENDER_TYPE_SNIPPET);
    return (
        <>{(isObject(dataCallResponse.response)) && <div className = "tab-co">
            <RenderSnippet dataProvider = {dataCallResponse}/>
        </div>}
        {(!isObject(dataCallResponse.response)) && <div/>}</>
    )
}
