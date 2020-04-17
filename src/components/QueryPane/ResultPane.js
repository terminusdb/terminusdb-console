import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { GraphComponent } from '@terminusdb/terminus-react-graph';
//import { TableComponent } from '@terminusdb/terminus-react-table';
import { Viewers } from "./Viewers"
import * as viewLabels from "../../labels/viewLabels"
import { isObject } from "../../utils/helperFunctions"

export const ResultPane = (props) => {
    const resultPane = props.resultPane || {};
    const resultData = props.resultData || {};
    const view = TerminusClient.View;
    const setViewChange = props.setViewChange;
    const ruleObject = props.ruleObject || {};
    const [graphviewer, setGraphViewer] = useState(false);
    const [tableviewer, setTableViewer] = useState(false);
    const [currentView, setCurrentView] = useState(viewLabels.GRAPH_VIEW);

    console.log(' ***** resultData ***** ', resultData)
    useEffect(() => {
        if(isObject(resultData)) {
            switch (currentView){
                case viewLabels.TABLE_VIEW:
                break;
                case viewLabels.GRAPH_VIEW:
                    const gView = view.graph();
                    gView.height(700).width(1200);
                    let g = gView.create(null);
                    // update new rule
                    if(isObject(ruleObject)) g.config = ruleObject;
                    g.setResult(resultData);
                    setGraphViewer(g);
                break;
            }
            setViewChange(currentView);
        }
    }, [resultData, currentView, ruleObject]);

    return (
        <div className="result-pane">
            {isObject(resultData) &&
                <Viewers views = { resultPane.view }
                    setCurrentView = { setCurrentView }/>}
            {graphviewer && <GraphComponent config={graphviewer.config}
                dataProvider = { graphviewer }
                date = {Date.now()}/>}
        </div>
    )
}
