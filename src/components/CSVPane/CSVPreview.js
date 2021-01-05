import React, {useState, useEffect} from 'react'
import { ResultViewer } from "..//QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import {MdSlideshow} from "react-icons/md"
import {TiDeleteOutline} from "react-icons/ti"
import {ControlledTable} from '../../views/Tables/ControlledTable'
import {JSONEditor} from "../../views/Document/JSONEditor"
import {CSV_FILE_TYPE, JSON_FILE_TYPE} from "./constants.csv"

export const CSVPreview=({preview, setPreview, previewCss})=>{

	const DisplayData = ({preview}) => {
		return <Row className="csv-preview-results">
			{(preview.fileType==CSV_FILE_TYPE) && <ResultViewer type="table" bindings={preview.data}/>}
			{(preview.fileType==JSON_FILE_TYPE) && <div style={{width: "100%"}}>
				<JSONEditor dataProvider={JSON.stringify(JSON.parse(preview.data), null, 2)} edit={false}/>
			</div>}
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
