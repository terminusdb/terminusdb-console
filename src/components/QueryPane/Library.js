import React, { useState } from "react"
import * as tag from "../../labels/tags"
import { Button, ButtonGroup } from 'reactstrap'
import { getQuery } from "../../utils/queryList"

export const Library = (props) => {
    const libs = props.libs || [];
    const setWoql = props.setWoql;
    const libButtons = [];

    libs.map((items) => {
        libButtons.push(
          <Button onClick = { () => {
              const q = getQuery(items);
              setWoql(q)
          }}>{ items } </Button>
        )
    })

    return(
        <div className="lib-pane">
            <ButtonGroup> { libButtons } </ButtonGroup>
        </div>
    )
}
