import React, { useState } from "react";
import { hooks } from "../../hooks"
import { isObject } from "../../utils/helperFunctions"

export const AutoExecute = (props) => {
    const query = props.query || {};
    const setResultData = props.setResultData;

    const [dataProvider, loading] = hooks(query);
    if(isObject(dataProvider)) setResultData(dataProvider.results);

    return (<> </>)

}
