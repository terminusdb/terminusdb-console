import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import { CreateDatabase } from "../views/NewDatabase/CreateDatabaseView"
import { CopyFrom } from "../views/NewDatabase/CopyFrom"

export const Crumbs = (props) => {
    const buttons = props.buttons || []
    const setPage = props.setPage;
    var list = []

    let btnList = buttons.map((item) => {
         list.push(<button key = {item} className="flat-buttons-link" onClick={() => {setPage(item)}}>{item} /</button>)
    })

    return (
        <ButtonGroup>
            {list}
        </ButtonGroup>
    )
}
