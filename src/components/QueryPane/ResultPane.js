import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WoqlGraph } from '@terminusdb/terminusdb-react-graph';
import { WoqlTable } from '@terminusdb/terminusdb-react-table';
import { FormatColumns } from '@terminusdb/terminusdb-react-table';
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
                <WoqlGraph config={ graphResults.config }
                    dataProvider = { graphResults }
                    date = { Date.now() }/>}
            {tableResults && (viewer === viewLabels.TABLE_VIEW) &&
                <WoqlTable columns = { listOfColumns }
                    data = { tableResults } />}
        </div>
    )

}
