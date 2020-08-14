import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"

export const LatestUpdates = ({latests, query, updateQuery, title}) => {
    title = title || "Latest Updates" 
    return (<>
        <Col style={{width: "100%"}}>
        <Row><h3>{title}</h3></Row>
        <Row>
            <ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {latests}/>
        </Row>
        </Col>
    </>)
} 
    