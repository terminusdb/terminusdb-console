import React, { useState } from 'react';
import { editSchema } from "../../variables/formLabels"
import { RENDER_TYPE_SNIPPET } from "../../labels/renderTypeLabels";
import { RenderSnippet } from "../../components/RenderSnippet";
import { GET_SCHEMA } from '../../labels/apiLabels';
import { APICallsHook } from "../../hooks/APICallsHook";
import { isObject } from "../../utils/helperFunctions";

export const OWL = (props) => {
    const [edit, setEdit] = useState(false);
    const [dataCallResponse] = APICallsHook(GET_SCHEMA,
                                            RENDER_TYPE_SNIPPET);


    const handleClick = (ev) =>{
        setEdit(true);
    }

    return (
        <>
            {isObject(dataCallResponse.response) &&
                <RenderSnippet dataProvider = {dataCallResponse}
                    edit = {false}/> }
            {(!isObject(dataCallResponse.response)) && <div/>}
        </>
    )
}
