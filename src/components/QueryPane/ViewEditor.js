import React, { useState } from "react"
import { Button, ButtonGroup } from 'reactstrap'

export const ViewEditor = (props) => {    
    //icons for changing stuff
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
    return(
        <div className="lib-pane">
            View Editor
        </div>
    )
}