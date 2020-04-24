import React, { useState } from "react";
import * as tag from "../../labels/tags"
import * as lang  from "../../labels/queryFormats";
import { parseText } from "../../utils/format"

export const ActionButton = (props) => {
    const text = props.text || tag.SUBMIT
    const isQuery = props.isQuery || false;
    const lang = props.lang || lang.WOQL_JS
    const inputQuery = props.inputQuery || false;
    const setWoql = props.setWoql;
    const inputRule = props.inputRule || false;
    const setRule = props.setRule;

    const handleClick = () => {
        if(isQuery){
            const q = parseText(inputQuery, lang, tag.QUERY);
            setWoql(q);
        }
        else {
            const r = parseText(inputRule, lang, tag.RULE);
            setRule(r);
        }
    }

    return(
       <button onClick = { handleClick }> { text } </button>
    )

}
