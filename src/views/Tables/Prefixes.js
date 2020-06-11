import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const BuiltInPrefixes = ({prefixes}) => {
    const cols = [
        {name: "Prefix", selector: "prefix"},    
        {name: "URL", selector: "url"}
    ]   

    if(!prefixes || !prefixes.length) return null
    return (<ResultViewer type ="table" bindings= {prefixes}/>)
} 
    
export const CustomPrefixes = ({prefixes, query, updateQuery}) => {
    if(!prefixes || !prefixes.length) return null
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {prefixes}/>)
} 

    
    
