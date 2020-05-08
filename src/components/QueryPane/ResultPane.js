import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { WoqlGraph } from '@terminusdb/terminus-react-graph';
import { WOQLTable } from '@terminusdb/terminus-react-table';
import { FormatColumns } from '@terminusdb/terminus-react-table';
import { isObject } from "../../utils/helperFunctions"
import * as viewLabels from "../../labels/viewLabels"

export const ResultPane = ({bindings, viewer}) => {
    /*useEffect(() => {
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
*/
    if(!bindings) return null
    return (
        <div className="result-pane">
            <WOQLTable bindings={bindings} />}
        </div>
    )

}
