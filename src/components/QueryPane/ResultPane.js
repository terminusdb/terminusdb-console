import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { GraphComponent } from '@terminusdb/terminus-react-graph';
import { TableComponent } from '@terminusdb/terminus-react-table';
import { FormatColumns } from '@terminusdb/terminus-react-table';
import { isObject } from "../../utils/helperFunctions"
import * as viewLabels from "../../labels/viewLabels"

export const ResultPane = (props) => {
    const results = props.results || {};
    const rule = props.rule || [];
    const viewer = props.viewer || viewLabels.GRAPH_VIEW;
    const [graphResults, setGraphResults] = useState(false);
    const [tableResults, setTableResults] = useState(false);
    const [listOfColumns, setListOfColumns] = useState([])

    const view = TerminusClient.View;

    useEffect(() => {
        switch(viewer){
            case viewLabels.GRAPH_VIEW:
                const gv = view.graph();
                gv.height(700).width(1200);
                let g = gv.create(null);
                if(isObject(rule)) g.config = rule;
                g.setResult(results);
                setGraphResults(g);
            break;
            case viewLabels.TABLE_VIEW:
                //temp
                const columns =[{ Header:'Table View', columns:listOfColumns}]
                const d = results.getBindings();
                setListOfColumns(FormatColumns(results.getVariableList()));
                setTableResults(d);
            break;
        }
    }, [viewer, results, rule]);

    return (
        <div className="result-pane">
            {graphResults && (viewer === viewLabels.GRAPH_VIEW) &&
                <GraphComponent config={ graphResults.config }
                    dataProvider = { graphResults }
                    date = { Date.now() }/>}
            {tableResults && (viewer === viewLabels.TABLE_VIEW) &&
                <TableComponent columns = { listOfColumns }
                    data = { tableResults } />}
        </div>
    )

}
