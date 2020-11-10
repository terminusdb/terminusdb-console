import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const PropertyList = ({result, query, prefixes, updateQuery}) => {
    if(!result) return null
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Property ID", "Property Name", "Property Domain", "Property Range", "Property Type", "Property Description")
    return (<WOQLTable result={result} view={tabConfig.json()} query={query} prefixes={prefixes} />)
} 
