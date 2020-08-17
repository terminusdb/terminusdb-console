import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"

export const LatestUpdates = ({latests, query, updateQuery, title}) => {
    title = title || "Latest Updates"
    return (<Row className="update-list">
        <h2 className="mt-4 mb-2">{title}</h2>
        <div style={{width: "100%"}}>
            <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
        </div>
    </Row>)
}
