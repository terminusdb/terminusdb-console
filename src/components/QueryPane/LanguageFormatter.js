import React, { useState } from "react";
import * as lang  from "../../labels/queryFormats";
import { Button, ButtonGroup } from "reactstrap";

export const LanguageFormatter = (props) => {
    const queryLanguages = props.queryLanguages || [];
    const isQuery = props.isQuery || false;
    const setQueryLanguage = props.setQueryLanguage;
    const queryLanguageButtons = [];

    const isRule = props.isRule || false;
    const ruleLanguages = props.ruleLanguages || [];
    const setRuleLanguage = props.setRuleLanguage;
    const ruleLanguageButtons = [];

    queryLanguages.map((lang) => {
        queryLanguageButtons.push(
          <Button onClick = { (ev) => {
             setQueryLanguage(lang);
           }}>{ lang }</Button>
        )
    })

    ruleLanguages.map((lang) => {
        ruleLanguageButtons.push(
          <Button onClick = { (ev) => {
             setRuleLanguage(lang);
           }}>{ lang }</Button>
        )
    })

    return(
        <div className="lib-pane">
            {isQuery && <ButtonGroup> { queryLanguageButtons } </ButtonGroup>}
            {isRule && <ButtonGroup> { ruleLanguageButtons } </ButtonGroup>}
        </div>
    )
}
