import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"

export const LatestUpdates = ({latests, query, updateQuery, title}) => {
    title = title || "Latest Updates" 
    return (<>
        <Col style={{width: "100%"}}>
        	<h2 className="mt-4 mb-2">{title}</h2>
            <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
        </Col>
    </>)
} 
    