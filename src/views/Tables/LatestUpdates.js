import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"

export const LatestUpdates = ({latests, query, updateQuery, title}) => {
    title = title || "Latest Updates"
    return (<Row className="update-list">
        <div className="sub-headings">{title}</div>
        <div style={{width: "100%"}}>
            <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
        </div>
    </Row>)
}
