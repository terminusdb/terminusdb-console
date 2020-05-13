import React, { useState, useEffect } from "react";
//import TerminusClient from '@terminusdb/terminusdb-client';
//import { WOQLGraph } from '@terminusdb/terminusdb-react-graph';

import { WOQLTable } from '@terminusdb/terminusdb-react-table';
//import { WOQLChart } from '@terminusdb/terminusdb-react-chart';
import { Container } from 'reactstrap'

export const ResultViewer = ({bindings, report, type, viewConfig, query, updateQuery}) => {
    const [currentView, setView] = useState(viewConfig)

    //updateView={updateView}

    function updateView(newconfig, newvtype){
        setView(newConfig)
        if(newvtype && newvtype != type) type = newvtype
    }
    
    const bindingsMy= bindings || []

    return (
       
            {(binds && type == "table") && 
                <WOQLTable bindings={bindingsMy} config={currentView} query={query} updateQuery={updateQuery} />
            }
            {(binds && type == "graph") && 
                <WOQLGraph bindings={bindingsMy} view={currentView} query={query} updateQuery={updateQuery}/>
            }                        
    )
}
//{JSON.stringify(bindingsMy, null, 4)} 
//{JSON.stringify(bindingsMy, null, 4)}
//<WOQLTable bindings={bindingsMy}  query={query}/>
 /*{(binds && type == "table") && 
                <WOQLTable bindings={binds} config={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }
            {(binds && type == "graph") && 
                <WOQLGraph bindings={binds} view={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }
            {(binds && type == "chart") && 
                <WOQLChart bindings={binds} view={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }*/