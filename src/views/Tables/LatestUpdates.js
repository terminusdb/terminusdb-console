import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const LatestUpdates = ({latests, query, updateQuery, title}) => {
    title = title || "Latest Updates" 
    return (<>
        <h3>{title}</h3>
        <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
    </>)
} 
    