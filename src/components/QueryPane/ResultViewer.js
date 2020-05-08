import React, { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { WoqlGraph } from '@terminusdb/terminus-react-graph';
import { WOQLTable } from '@terminusdb/terminus-react-table';

export const ResultViewer = ({bindings, type, config, query}) => {
    if(!bindings) return (<span>"No Bindings"</span>)
    type = type || "table"
    switch (type) {
        case "table" : 
            return (<WOQLTable bindings={bindings} config={config} query={query}/>)
        case "graph" : 
            //return (<WOQLGraph bindings={bindings} config={config} query={query}/>)
        case "chart" : 
            //return (<WOQLChart bindings={bindings} config={config} query={query}/>)
    }
    return (<span>{type} is not supported</span>)
}
