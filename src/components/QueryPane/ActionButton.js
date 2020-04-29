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
    const setReport = props.setReport;

    const handleClick = () => {
        if(isQuery){
            const q = parseText(inputQuery, lang, tag.QUERY);
            if(!q){
        		let message = "Query could not be extracted from input box - "
                    + "remember that the last element in the query must be a WOQL object"
                setReport({status: tag.ERROR, error: message})
        	}
            else setWoql(q);
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
