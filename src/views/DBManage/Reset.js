import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {RESET_BRANCH_FORM} from "./constants.dbmanage"

export const Reset = ({branch, key, onReset, commit}) => {

	function setCommit() {
		let commitDescriptor = document.getElementById("cmt-inp").value
		onReset(branch, commitDescriptor)
	}

	return <Row className="new-branch" key={key}>
		<Col className="branch-id-col" >
			{commit && <input id={"cmt-inp"}
						className={RESET_BRANCH_FORM.commitDescriptor.inputElement.className}
						type={RESET_BRANCH_FORM.commitDescriptor.inputElement.type}
						value = {commit}/>
			}
			{!commit && <input id={"cmt-inp"}
				className={RESET_BRANCH_FORM.commitDescriptor.inputElement.className}
				type={RESET_BRANCH_FORM.commitDescriptor.inputElement.type}
				placeholder = {RESET_BRANCH_FORM.commitDescriptor.inputElement.placeholder}/>}
		</Col>
		<Col>
			<button type="submit" onClick={setCommit} className="mt-1 tdb__button__base tdb__button__base--green">
				{RESET_BRANCH_FORM.buttons.submitText}
			</button>
		</Col>
	</Row>
}
