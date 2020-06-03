import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const ClassList = ({classes, query, updateQuery}) => {
    if(!classes || !classes.length) return null
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {classes}/>)
} 
    