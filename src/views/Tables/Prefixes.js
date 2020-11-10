import React from "react"
import RenderTable from "../../components/Table/RenderTable"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const BuiltInPrefixes = ({prefixes}) => {
    const cols = [
        {name: "Prefix", selector: "prefix"},    
        {name: "URL", selector: "url"}
    ]   

    const dataProvider = {columnData:prefixes, columnConf:cols}
    return (<RenderTable dataProvider={dataProvider} />)

    //if(!prefixes || !prefixes.length) return null
    //return (<ResultViewer type ="table" bindings= {prefixes}/>)
} 
    
export const CustomPrefixes = ({prefixes, query, updateQuery}) => {
    if(!prefixes || !prefixes.length) return null
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Prefix", "IRI")
    return (
        <div style={{"marginBottom": "40px"}} >
            <WOQLTable bindings={prefixes} view={tabConfig.json()} query={query}/>
        </div>
    )
} 
    
