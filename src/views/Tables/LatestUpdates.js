import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const LatestUpdates = ({result, query, prefixes, updateQuery, title}) => {
    title = title || "Latest Updates"
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Time", "Author", "Commit ID", "Message")

    return (<Row className="update-list">
        <div className="sub-headings latest-update-heading">{title}</div>
        <div style={{width: "100%"}}>
            <WOQLTable result={result} view={tabConfig.json()} query={query} prefixes={prefixes} />
        </div>
    </Row>)
}
