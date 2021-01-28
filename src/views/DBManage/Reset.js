import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {RESET_BRANCH_FORM} from "./constants.dbmanage"

export const Reset = ({branch, key, onReset}) => {
	const [commitDescriptor, setCommitDescriptor]=useState()

	return <Row className="new-branch" key={key}>
		<Col className="branch-id-col" >
			<input onBlur={(evt) => {setCommitDescriptor(evt.target.value)}}
				className={RESET_BRANCH_FORM.commitDescriptor.inputElement.className}
				type={RESET_BRANCH_FORM.commitDescriptor.inputElement.type}
				placeholder = {RESET_BRANCH_FORM.commitDescriptor.inputElement.placeholder}/>
		</Col>
		<Col>
			<button type="submit" onClick={()=> onReset(branch, commitDescriptor)} className="mt-1 tdb__button__base tdb__button__base--green">
				{RESET_BRANCH_FORM.buttons.submitText}
			</button>
		</Col>
	</Row>
}
