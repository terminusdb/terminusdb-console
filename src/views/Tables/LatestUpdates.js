import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const LatestUpdates = ({latests, query, updateQuery}) => {
    return (<>
        <h3>Latest Updates</h3>
        <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
    </>)
} 
    