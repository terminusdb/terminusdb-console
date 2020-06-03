import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const DocumentList = ({documents, query, updateQuery}) => {
    if(!documents || !documents.length) return null
    return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {documents}/>)
} 
    