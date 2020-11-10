import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const ClassList = ({result, prefixes, query, updateQuery}) => {
    if(!result) return null
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Class ID", "Class Name", "Parents", "Children", "Abstract", "Description")
    return (<WOQLTable result={result} view={tabConfig.json()} query={query} prefixes={prefixes} />)
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {result.bindings}/>)
} 
    