import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "reactstrap"
import {AiOutlineExclamationCircle} from "react-icons/ai"
import {DEFAULT_COMMIT_MSG} from "./constants.csv"

export const ManageDuplicateCsv=({fileName})=>{

	return (<Row className="csv-duplicate-msg" key={"Row_exists_msg_"+fileName}>
		<Col key={"Col_exists_msg_"+fileName} md={8}>
			<span id={fileName} className={action.DUPLICATE_SPAN_CSS}>
				<AiOutlineExclamationCircle id={fileName} color="#856404" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT}>This CSV was already added, you can update or create a new Csv</span>
			</span>
		</Col>
	</Row>)
}
