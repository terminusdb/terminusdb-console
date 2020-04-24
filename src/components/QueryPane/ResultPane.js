import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { GraphComponent } from '@terminusdb/terminus-react-graph';
import { isObject } from "../../utils/helperFunctions"
import * as viewLabels from "../../labels/viewLabels"

export const ResultPane = (props) => {
    const results = props.results || {};
    const rule = props.rule || [];
    const viewer = props.viewer || viewLabels.GRAPH_VIEW;
    const [display, setDisplay] = useState(false);

    const view = TerminusClient.View;

    useEffect(() => {
        const gv = view.graph();
        gv.height(700).width(1200);
        let g = gv.create(null);
        if(isObject(rule)) g.config = rule;
        g.setResult(results);
        setDisplay(g);
    }, [viewer, rule]);

    return (
        <div className="result-pane">
            {display &&
                <GraphComponent config={ display.config }
                    dataProvider = { display }
                    date = {Date.now()}/>}
        </div>
    )

}
