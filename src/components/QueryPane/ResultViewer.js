import React, { useState, useEffect } from "react";
import { WOQLGraph } from '@terminusdb/terminusdb-react-components';

import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const ResultViewer = ({bindings, type, viewConfig, query, prefixes, updateQuery}) => {
    const [currentView, setView] = useState(viewConfig)
    /*
    to be review  I have to move from here
    */
    const woqlGraphConfig= TerminusClient.View.graph();
    woqlGraphConfig.height(800).width(1000)
    //woqlGraphConfig.edges(["Object", "Subject"]);
    //woqlGraphConfig.node("Subject").size(20).color([180, 220, 250]).text("Predicate")
    //woqlGraphConfig.node("Object").size(30).color([0, 220, 250]).text("Predicate")
    //woqlGraphConfig.node("Subject").text("Predicate")
    //woqlGraphConfig.node("B").text("v:BLabel")
    const result = new TerminusClient.WOQLResult({bindings:bindings},query);

    let viewer = woqlGraphConfig.create(null);
    viewer.setResult(result);
    const myviewer=viewer;

    return (<>
        {bindings && type==="table" &&
            <WOQLTable bindings={bindings} view={currentView} query={query} updateQuery={updateQuery} prefixes={prefixes} />
        }
        {bindings && type==="graph" &&
            <WOQLGraph config={myviewer.config} dataProvider={myviewer} query={query} updateQuery={updateQuery}/>
        }
    </>
    )
}
//{JSON.stringify(bindingsMy, null, 4)}
//{JSON.stringify(bindingsMy, null, 4)}
//<WOQLTable bindings={bindingsMy}  query={query}/>
 /*{(binds && type == "table") &&
=======
export const ResultViewer = ({bindings, report, type, viewConfig, query, updateQuery}) => {

    function updateView(newconfig, newvtype){
        setView(newConfig)
        if(newvtype && newvtype != type) type = newvtype
    }

    if(!bindings) return null
    return (
        <Container>
            <WOQLTable bindings={bindings} />
        </Container>
    )
}
*/
