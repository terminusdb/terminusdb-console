import React from "react"
import RenderTable from "../../components/Table/RenderTable"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

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
    return (
        <div style={{"marginBottom": "40px"}} >
            <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {prefixes}/>
        </div>
    )
} 

    
    
