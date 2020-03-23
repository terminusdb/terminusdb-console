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
            {/*<button className = { editSchema.edit.className }
                type =  { editSchema.edit.type }
                onClick = {handleClick}>
                { editSchema.edit.text }
            </button>*/}

            {/*(edit && isObject(dataCallResponse.response)) && <div className = "tab-co">
                <RenderSnippet dataProvider = {dataCallResponse}
                    edit = {true}/>
            </div>*/}

            {/*(!edit && isObject(dataCallResponse.response)) && <div className = "tab-co">
                <RenderSnippet dataProvider = {dataCallResponse}
                    edit = {false}/>
            </div>*/}

            {isObject(dataCallResponse.response) && 
                <RenderSnippet dataProvider = {dataCallResponse}
                    edit = {false}/> }

            {(!isObject(dataCallResponse.response)) && <div/>}
        </>
    )
}
