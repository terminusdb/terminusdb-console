import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const GraphList = ({graphs, query, updateQuery}) => {
    if(!graphs || !graphs.length) return null
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("ID", "Type", "Triples", "Size")

    return (<WOQLTable bindings={graphs} view={tabConfig.json()} />)

    //return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {graphs}/>)
} 
    