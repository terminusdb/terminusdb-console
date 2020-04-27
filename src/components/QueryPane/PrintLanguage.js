import React, { useState } from "react";
import * as lang  from "../../labels/queryFormats";
import { Button, ButtonGroup } from "reactstrap";

export const PrintLanguage = (props) => {
    const languages = props.languages || [];
    const isQuery = props.isQuery || false;
    const setqLang = props.setqLang;
    const setrLang = props.setrLang;
    const btns= [];

    languages.map((lang) => {
        btns.push(
          <Button key = { lang } onClick = { (ev) => {
             if(isQuery) setqLang(lang)
             else setrLang(lang)
           }}>{ lang }</Button>
        )
    })

    return(
        <div className="lib-pane">
            <ButtonGroup> { btns } </ButtonGroup>
        </div>
    )

}
