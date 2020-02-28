import React, { useState } from 'react';
import { CLASSES_TAB, PROPERTIES_TAB, OWL_TAB, SCHEMA } from "../labels/tabLabels"
import { RENDER_TYPE_TABLE, RENDER_TYPE_SNIPPET } from "../labels/renderTypeLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels";
//import { Input } from "reactstrap";
import RenderTable from "../components/RenderTable";
import RenderSnippet from "../components/RenderSnippet";
import { QueryHook } from "../hooks/QueryHook";
import { APICallsHook } from "../hooks/APICallsHook"
import { useGlobalState } from "../init/initializeGlobalState";

export const TabContainer = (props) => {
    const state = props.tab || CLASSES_TAB;

    var isClassTab = false, isPropertyTab =false, isOWLTab=false;

    if (props.activeTab == CLASSES_TAB.state) isClassTab = true;
    else if (props.activeTab == PROPERTIES_TAB.state) isPropertyTab = true;
    else if (props.activeTab == OWL_TAB.state) isOWLTab = true;

    const getDataProvider = () => {
        if(props.activeTab === OWL_TAB.state){
            const [dataCallResponse] = APICallsHook(state.command,
                                                    RENDER_TYPE_SNIPPET);
            return dataCallResponse;

        }
        else{
            const [dataResponse] = QueryHook(state.command,
                                             RENDER_TYPE_TABLE);
            return dataResponse;
        }
    }
    return (
        <div>
             {isClassTab && <div className = "tab-co">
                 <RenderTable dataProvider = {getDataProvider()}/>
             </div>}
             {isPropertyTab && <div className = "tab-co">
                  <RenderTable dataProvider = {getDataProvider()}/>
              </div>}
             {isOWLTab && <div className = "tab-co">
                  <RenderSnippet dataProvider = {getDataProvider()}/>
              </div>}
        </div>
    )
}
