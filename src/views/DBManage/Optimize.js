import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {OPTIMIZE_BRANCH_FORM} from "./constants.dbmanage"


export const Optimize = ({key, onOptimize}) => {
	return <Row className="new-branch" key={key}>
		<Col className="branch-id-col" >
			<p>{OPTIMIZE_BRANCH_FORM.description}</p>
		</Col>
		<Col>
			<button type="submit" onClick={onOptimize} className="mt-1 tdb__button__base tdb__button__base--green">
				{OPTIMIZE_BRANCH_FORM.buttons.submitText}
			</button>
		</Col>
	</Row>
}
