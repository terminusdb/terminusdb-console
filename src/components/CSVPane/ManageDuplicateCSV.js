import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "react-bootstrap" //replaced
import {AiOutlineExclamationCircle} from "react-icons/ai"
import {DEFAULT_COMMIT_MSG} from "./constants.csv"

export const ManageDuplicateCsv=({fileName})=>{

	return (<Row className="csv-duplicate-msg" key={"Row_exists_msg_"+fileName}>
		<Col key={"Col_exists_msg_"+fileName} md={8}>
			<span id={fileName} className={action.DUPLICATE_SPAN_CSS}>
				<AiOutlineExclamationCircle id={fileName} color="#856404" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT}>This CSV was already added, you can update or create a new CSV</span>
			</span>
		</Col>
	</Row>)
}

export const ShowNewIDInput=({newIDField})=>{
	let item=newIDField
	function handleInput(e, item){
		item.newFileName=e.target.value
		item.action=action.CREATE_NEW
	}

	return <Row className="csv-duplicate-msg" key={"New_id_"+item.name}>
		<Col key={"Col_new_id_"+item.name} md={3}>
			<span className={action.CONTROLS_TEXT}>Add a new ID to create new CSV</span>
		</Col>
		<Col key={"Col_new_id_inp_"+item.name} md={2}>
			<input onBlur={(e)=>handleInput(e, item)} required/>
		</Col>
	</Row>
}
