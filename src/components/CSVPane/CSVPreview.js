import React, {useState, useEffect} from 'react'
import { ResultViewer } from "..//QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import {MdSlideshow} from "react-icons/md"
import {TiDeleteOutline} from "react-icons/ti"
import {ControlledTable} from '../../views/Tables/ControlledTable'

export const CSVPreview=({preview, setPreview, previewCss})=>{

	const DisplayData = ({preview}) => {
		return <Row className="csv-preview-results">
			<ResultViewer type="table" bindings={preview.data}/>
		</Row>
	}

	const PreviewBar = ({preview, setPreview}) => {
		return <>
			<Col md={8}>
				<MdSlideshow color="#0055bb" className="csv-preview-icon db_info_icon_spacing"/>
				<span className="preview-bar-title">Showing preview of file  <strong>{preview.fileName} </strong></span>
			</Col>
			<Col md={4}>
				<span onClick={()=> setPreview({show: false, fileName:false, data:[], selectedCSV:false})}
					className="db-card-credit csv-act" style={{float: "right"}}>
					<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing'/>
					<span className="db_info">Close Preview</span>
				</span>
			</Col>
		</>
	}

	return <>
		{preview.show && <>
			<Row className='csv-preview-header'>
				<PreviewBar preview={preview} setPreview={setPreview}/>
			</Row>
			<DisplayData preview={preview}/>
		</>}
	</>
}
