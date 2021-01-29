import React, {useState} from "react";
import {Row, Col} from "react-bootstrap"
import {TiDeleteOutline} from "react-icons/ti"

export const ActionHeader = ({branchAction, onClose}) => {
	var title=branchAction.title
	if(branchAction.merge)
	 	title=branchAction.title + " " + branchAction.branch

	return <div class="csv-preview-header row">
		<Col md={10}>
			<span class="preview-bar-title">
				<strong>{title}</strong>
			</span>
		</Col>
		<Col md={2}>
			<span onClick={onClose} className="db-card-credit csv-act" style={{float: "right"}}>
				<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing'/>
				<span className="db_info">Close</span>
			</span>
		</Col>
	</div>
}
