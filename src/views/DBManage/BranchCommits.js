import React from "react";
import {Row, Col} from "react-bootstrap"
import {CommitLog} from "./../DBHome/CommitLog"
import {ScopedDetails} from "./../DBHome/ScopedDetails"
import {MdRefresh} from "react-icons/md"
import {RESET_BRANCH} from "./constants.dbmanage"

export const BranchCommits = ({selectedBranch, onReset, setBranchAction}) => {

	const getResetButton =() => {
        return <span className="table-icons" title={RESET_BRANCH}>
        	<MdRefresh className="db_info_icon_spacing"/>
    	</span>
    }

	return <>
		<Row className="scoped-details-row">
			<ScopedDetails/>
		</Row>
		<Row key="rd">
			<CommitLog selectedBranch={selectedBranch} getResetButton={getResetButton} onReset={onReset} setBranchAction={setBranchAction}/>
		</Row>
	</>
}
