import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import { CreateDatabase } from "../views/NewDatabase/CreateDatabaseView"
import { CopyFrom } from "../views/NewDatabase/CopyFrom"
import { isArray } from "../utils/helperFunctions"

export const Crumbs = (props) => {
    const buttons = props.buttons || []
    const setPage = props.setPage;
    var list = []
    const len = buttons.length;

    let btnList = buttons.map((item, i) => {
         if(i == (len - 1)){
             list.push(<button key = {item.text + i} className="flat-buttons-link curr-flat-btn"
                onClick={() => {setPage(item.page)}}>{item.text} </button>)
         }
         else list.push(<button key = {item.text + i} className="flat-buttons-link already-selected-flat-btn"
            onClick={() => {setPage(item.page)}}>{item.text} /</button>)
    })


    return (
        <ButtonGroup className={'crumbs-button-group'}>
            {list}
        </ButtonGroup>
    )
}
