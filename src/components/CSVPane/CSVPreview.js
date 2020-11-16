import React, {useState} from 'react'
import { ResultViewer } from "..//QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import {MdSlideshow} from "react-icons/md"
import {TiDeleteOutline} from "react-icons/ti"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {ControlledTable} from '../../views/Tables/ControlledTable'
import TerminusClient from '@terminusdb/terminusdb-client'
import {isArray} from "../../utils/helperFunctions"

export const CSVPreview=({preview, setPreview, previewCss})=>{
    const {woqlClient} = WOQLClientObj()

	const tabConfig= TerminusClient.View.table();

    //tabConfig.column_order("Column Duration", "Column Start date", "Column End date", "Column Start station number", "Column Start station",
	//	"Column	End station number", "Column End station", "Column Bike number", "Column Member type")
	//tabConfig.column_order("v:CSV ID", "v:CSV Rows", "v:Properties", "v:Property Name" , "v:Value")
    tabConfig.pagesize(100)
    tabConfig.pager("remote")

	function getColumns(bindings){
		let row=bindings[0]["CSV Rows"], cArr=[]
		for(var x=0; x<bindings.length; x++){
			if(row===bindings[x]["CSV Rows"]){
				let str= bindings[x]["Property Name"]["@value"]
				cArr.push(str)
			}
			else break;
		}
		//console.log('cArr', cArr)
		tabConfig.column_order(...cArr)
	}

	function formatData(bindings) {
		let row=bindings[0]["CSV Rows"], colName, nBindings=[], json={}
		for(var x=0; x<bindings.length; x++){
			if(row===bindings[x]["CSV Rows"]){
				colName=bindings[x]["Property Name"]["@value"]
				json[colName]=bindings[x]["Value"]["@value"]
			}
			else {
				row=bindings[x]["CSV Rows"]
				nBindings.push(json)
				json={}
				colName=bindings[x]["Property Name"]["@value"]
				json[colName]=bindings[x]["Value"]["@value"]
			}
		}
		//console.log('nBindings', nBindings)
		return nBindings
	}

	let formatBindings=(bindings)=>{
		getColumns(bindings)
		const nBindings=formatData(bindings)
		//console.log('tabConfig',tabConfig)
		return nBindings
	}

	if(preview.query){
		tabConfig.bindings(formatBindings)
	}

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
			{isArray(preview.data) && <Row className="csv-preview-results">
				<ResultViewer type="table" bindings={preview.data}/>
			</Row>}
			{preview.query && <Row className={previewCss}>
				<ControlledTable
					query={preview.query}
					freewidth={true}
					view={tabConfig}
					limit={tabConfig.pagesize()}/>
			</Row>}
		</>}
	</>
}
