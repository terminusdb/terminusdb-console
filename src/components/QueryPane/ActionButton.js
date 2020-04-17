import React, { useState } from "react";
import * as lang  from "../../labels/queryFormats";
import * as tag from "../../labels/tags"
import { isObject } from "../../utils/helperFunctions"
import { hooks } from "../../hooks"
import { parseText } from "../../utils/format"

export const ActionButton = (props) => {
    const text = props.submit || tag.SUBMIT
    // query
    const inputQuery = props.inputQuery || tag.BLANK;
    const isQuery = props.isQuery || false
    const setResultData = props.setResultData;
    const woql = props.woql || {}
    const queryLang = props.queryLang || lang.WOQL_JS;

    // rule
    const inputRule = props.inputRule || tag.BLANK;
    const isRule = props.isRule || false;
    const setRuleObject = props.setRuleObject;
    const ruleLang = props.ruleLang || lang.WOQL_JS;

    const [queryObject, setQueryObject] = useState({});
    const [dataProvider, loading] = hooks(queryObject);
    if(isObject(dataProvider)) setResultData(dataProvider.results);

    const handleClick = () => {
        if(isQuery){
            const q = parseText(inputQuery, queryLang, tag.QUERY);
            setQueryObject(q);
        }
        else if (isRule){
            const r = parseText(inputRule, ruleLang, tag.RULE);
            setRuleObject(r);
        }
    }

    return(
       <button onClick = { handleClick }> { text } </button>
    )
}
