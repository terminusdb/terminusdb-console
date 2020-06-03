import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const PropertyList = ({properties, query, updateQuery}) => {
    if(!properties || !properties.length) return null
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {properties}/>)
} 
