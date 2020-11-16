import React, {useState} from 'react'
import { ResultViewer } from "..//QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import {MdSlideshow} from "react-icons/md"
import {TiDeleteOutline} from "react-icons/ti"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {ControlledTable} from '../../views/Tables/ControlledTable'
import TerminusClient from '@terminusdb/terminusdb-client'
import {isArray} from "../../utils/helperFunctions"

export const CSVPreview=({preview, setPreview})=>{
    const {woqlClient} = WOQLClientObj()

	const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("v:CSV ID", "Name", "v:Property Name", "v:Value")
    tabConfig.pagesize(10)
    tabConfig.pager("remote")

	return <>
		{preview.show && <>
			<Row className='csv-preview-header'>
				<Col md={10}>
					<MdSlideshow color="#0055bb" className="csv-preview-icon db_info_icon_spacing"/>
						Showing preview of file  <strong>{preview.fileName} </strong>
				</Col>
				<Col md={2}>
					<span onClick={()=> setPreview({show: false, fileName:false, data:[]})}
						className="db-card-credit csv-act">
						<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing'/>
						<span className="db_info">Close Preview</span>
					</span>
				</Col>
			</Row>
<<<<<<< HEAD
			{isArray(preview.data) && <Row className="csv-preview-results">
				<ResultViewer type="table" bindings={preview.data}/>
			</Row>}
			{preview.query && <Row className="csv-preview-results">
				<ControlledTable
					query={preview.query}
					freewidth={true}
					view={tabConfig}
					limit={tabConfig.pagesize()}/>
			</Row>}
=======
			<Row className="csv-preview-results">
                {preview.data && preview.data.length &&  
    				<ResultViewer type="table" bindings={preview.data}/>
                }
			</Row>
>>>>>>> b94c5cfcdd0782940c07e8182f8f9c6bc204cbb8
		</>}
	</>
}
