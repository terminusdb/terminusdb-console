import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {SQUASH_BRANCH_FORM} from "./constants.dbmanage"

export const Squash = ({branch, key, onSquash}) => {
	const [commitMsg, setCommitMsg]=useState()

	return <Row className="new-branch" key={key}>
		<Col className="branch-id-col" >
			<input onBlur={(evt) => {setCommitMsg(evt.target.value)}}
				className={SQUASH_BRANCH_FORM.commit.inputElement.className}
				type={SQUASH_BRANCH_FORM.commit.inputElement.type}
				placeholder = {SQUASH_BRANCH_FORM.commit.inputElement.placeholder}/>
		</Col>
		<Col>
			<button type="submit" onClick={()=> onSquash(branch, commitMsg)} className="mt-1 tdb__button__base tdb__button__base--green">
				{SQUASH_BRANCH_FORM.buttons.submitText}
			</button>
		</Col>
	</Row>
}
