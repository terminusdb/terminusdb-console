import React from "react";
import { ButtonGroup } from "reactstrap";
import { BREADCRUMB } from "./constants.templates"

export const Crumbs = (props) => {
    const buttons = props.buttons || []
    var list = []
    const len = buttons.length;
    buttons.map((item, i) => {
         if(i == (len - 1)){
            list.push(
                <button key = {item.text + i} className={BREADCRUMB.currentCSS}>
                    {item.text}
                </button>
            )
         }
         else {
             let pid = (typeof item.page != "undefined" ? item.page : item.text )
             list.push(
                <button key = {item.text + i} className={BREADCRUMB.oldCSS} onClick={() => {props.setPage(pid)}}>
                    {item.text}
                </button>
             )
             list.push(
                <button key={item.text + "__" + i} className={BREADCRUMB.currentCSS }> 
                    {BREADCRUMB.separator} 
                </button>
            )
        }
    })

    if(list.length == 0) list = ""
    return (
        <ButtonGroup className={BREADCRUMB.buttonGroupCSS}>
            {list}
        </ButtonGroup>
    )
}
