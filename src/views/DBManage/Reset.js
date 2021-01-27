import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {RESET_BRANCH_FORM} from "./constants.dbmanage"

export const Reset = ({branch, key}) => {
	const [commitMsg, setCommitMsg]=useState()

	function onClick(){

	}

	return <Row className="new-branch" key={key}>
		<Col className="branch-id-col" >
			<input onBlur={(evt) => {setCommitMsg(evt.target.value)}}
				className={RESET_BRANCH_FORM.commit.inputElement.className}
				type={RESET_BRANCH_FORM.commit.inputElement.type}
				placeholder = {RESET_BRANCH_FORM.commit.inputElement.placeholder}/>
		</Col>
		<Col>
			<button type="submit" onClick={onClick} className="mt-1 tdb__button__base tdb__button__base--green">
				{RESET_BRANCH_FORM.buttons.submitText}
			</button>
		</Col>
	</Row>
}
