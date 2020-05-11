import React, { useState, useEffect } from "react";
//import TerminusClient from '@terminusdb/terminusdb-client';
//import { WOQLGraph } from '@terminusdb/terminusdb-react-graph';
import { WOQLTable } from '@terminusdb/terminusdb-react-table';
//import { WOQLChart } from '@terminusdb/terminus-react-chart';
import { Container } from 'reactstrap'

export const ResultViewer = ({bindings, report, type, viewConfig, query, updateQuery}) => {

    //const [binds, setBindings] = useState(bindings)
    const [currentView, setView] = useState(viewConfig)
    //useEffect(() => setBindings(bindings), [bindings])

    function updateView(newconfig, newvtype){
        setView(newConfig)
        if(newvtype && newvtype != type) type = newvtype
    }
    
    const bindingsMy= bindings || []

    return (
        <Container>
            <WOQLTable bindings={bindingsMy} />
   
           {JSON.stringify(bindingsMy, null, 4)}
        </Container>                
    )
}

 /*{(binds && type == "table") && 
                <WOQLTable bindings={binds} config={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }
            {(binds && type == "graph") && 
                <WOQLGraph bindings={binds} view={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }
            {(binds && type == "chart") && 
                <WOQLChart bindings={binds} view={currentView} query={query} updateQuery={updateQuery} updateView={updateView}/>
            }*/