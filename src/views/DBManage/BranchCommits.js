import React from "react";
import {Row, Col} from "react-bootstrap"
import {CommitLog} from "./../DBHome/CommitLog"
import {ScopedDetails} from "./../DBHome/ScopedDetails"

export const BranchCommits = ({selectedBranch}) => {
	return <>
		<Row className="scoped-details-row">
			 <ScopedDetails selectedBranch={selectedBranch}/>
		</Row>
		<Row key="rd">
			<CommitLog selectedBranch={selectedBranch}/>
		</Row>
	</>
}
