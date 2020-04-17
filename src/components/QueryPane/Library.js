import React, { useState } from "react"
import * as tag from "../../labels/tags"
import * as query from "../../labels/queryLabels"
import { isObject } from "../../utils/helperFunctions"
import { Button, ButtonGroup } from 'reactstrap'
import { getQuery } from "../../utils/queryList"
import { hooks } from "../../hooks"

export const Library = (props) => {
    const libs = props.libs || [];
    const changeWoql = props.changeWoql;
    const setResultData = props.setResultData;
    const library_autosubmit = props.library_autosubmit || false;
    const libButtons = [];

    const [queryObject, setQueryObject] = useState({});
    const [dataProvider, loading] = hooks(queryObject);
    if(isObject(dataProvider)) setResultData(dataProvider.results);
    
    libs.map((items) => {
        libButtons.push(
          <Button onClick = { () => {
              const woql = getQuery(items, {});
              if(isObject(woql)){
                  changeWoql(woql);
                  if(library_autosubmit) setQueryObject(woql);
              }}}>{ items }</Button>
        )
    })

    return(
        <div className="lib-pane">
            <ButtonGroup> { libButtons } </ButtonGroup>
        </div>
    )
}
