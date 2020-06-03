import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const GraphList = ({graphs, query, updateQuery}) => {
    if(!graphs || !graphs.length) return null
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {graphs}/>)
} 
    