import React, { useState } from 'react';
import { RENDER_TYPE_SNIPPET } from "../../labels/renderTypeLabels";
import RenderSnippet from "../../components/RenderSnippet";
import { GET_SCHEMA } from '../../labels/apiLabels';
import { APICallsHook } from "../../hooks/APICallsHook";

export const OWL = (props) => {

    const getDataProvider = () => {
        const [dataCallResponse] = APICallsHook(GET_SCHEMA,
                                                RENDER_TYPE_SNIPPET);
        return dataCallResponse;
    }

    return (
        <div className = "tab-co">
            <RenderSnippet dataProvider = {getDataProvider()}/>
        </div>
    )
}
