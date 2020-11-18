import React, {useState, useEffect} from 'react'
import { ResultViewer } from "..//QueryPane/ResultViewer"
import {Row, Col} from "reactstrap"
import {MdSlideshow} from "react-icons/md"
import {TiDeleteOutline} from "react-icons/ti"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {ControlledTable} from '../../views/Tables/ControlledTable'
import TerminusClient from '@terminusdb/terminusdb-client'
import {isArray} from "../../utils/helperFunctions"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {DOCUMENT_VIEW, CREATE_DB_VIEW} from "./constants.csv"
import {BiArrowBack} from "react-icons/bi"

export const CSVPreview=({preview, setPreview, previewCss})=>{
	const {woqlClient} = WOQLClientObj()
	let propertyColumnNames=[]
	const [query, setQuery] = useState(false)
	const tabConfig=TerminusClient.View.table();
	const [tConf, setTConf]=useState({})
	const [previewQuery, setPreviewQuery]=useState(false)
	const [cols, setCols]=useState([])

	let formatData=(bindings)=>{
		let row=bindings[0]["CSV Rows"], colName, nBindings=[], json={}
		for(var x=0; x<bindings.length; x++){
			let cn=bindings[x]["Property Name"]["@value"]
			colName=cn.replace('Column ','');
			if(row===bindings[x]["CSV Rows"]){
				//colName=bindings[x]["Property Name"]["@value"]
				json[colName]=bindings[x]["Value"]["@value"]
			}
			else {
				row=bindings[x]["CSV Rows"]
				nBindings.push(json)
				json={}
				json[colName]=bindings[x]["Value"]["@value"]
			}
		}
		return nBindings
	}

	/*useEffect(() => {
		let id=preview.selectedCSV
		// get property names from graph
        const q=TerminusClient.WOQL.triple(id, "scm:csv_column", "v:Column Obj").triple("v:Column Obj", "scm:csv_column_name", "v:Property Name")
        woqlClient.query(q).then((results) => {
			let wr = new TerminusClient.WOQLResult(results, q)
			for(var key in wr.bindings){
				//let cln= "Column " + wr.bindings[key]["Property Name"]["@value"]
				let cln=wr.bindings[key]["Property Name"]["@value"]
				propertyColumnNames.push(cln)
			}
			setCols(propertyColumnNames)
			let qp=TerminusClient.WOQL.triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id).triple('v:CSV ID', 'scm:csv_row', 'v:CSV Rows')
			   .triple('v:CSV Rows', 'v:Properties', 'v:Value').quad('v:Properties', 'label', 'v:Property Name', 'schema/main')
			setPropertyQuery(qp)
		})
	}, [preview.selectedCSV]) */

	useEffect(() => {
		let id=preview.selectedCSV
		let WOQL=TerminusClient.WOQL
		// get property names from graph
        const q=WOQL.and (
			WOQL.limit(1).triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id).triple('v:CSV ID', 'scm:csv_row', 'v:CSV Row')
				.triple('v:CSV Row', 'type', 'v:Row Type'),
		  	WOQL.quad('v:Property', 'domain', 'v:Row Type', 'schema/main').quad('v:Property', 'label', 'v:Property Name' ,'schema/main')
		)
		let columnQuery = []
        woqlClient.query(q).then((results) => {
			let wr = new TerminusClient.WOQLResult(results, q)
			for(var key in wr.bindings){
				let property=wr.bindings[key]["Property"]
				let propertyName= "v:" + wr.bindings[key]["Property Name"]["@value"].replace('Column ','')
				propertyColumnNames.push(wr.bindings[key]["Property Name"]["@value"].replace('Column ',''))
				columnQuery.push(WOQL.triple('v:CSV Row', property, propertyName))
				//propertyColumnNames.push(wr.bindings[key]["CSV ID"])
			}
			setCols(propertyColumnNames)
			let qp=WOQL.and(
				WOQL.triple('v:CSV ID', 'type', 'scm:CSV').triple('v:CSV ID', 'label', 'v:CSV Name').eq('v:CSV ID', id)
					.triple('v:CSV ID', 'scm:csv_row', 'v:CSV Row'),
				WOQL.and(...columnQuery)
			)
			setPreviewQuery(qp)
		})
	}, [preview.selectedCSV])


	/*useEffect(() => {
		tabConfig.pagesize(100)
		tabConfig.pager("remote")
		tabConfig.column_order(...cols)
		setTConf(tabConfig)
		setQuery(propertyQuery)
		tabConfig.bindings(formatData)
    }, [propertyQuery])*/

	useEffect(() => {
		tabConfig.pagesize(10)
		tabConfig.pager("remote")
		//tabConfig.column_order(...cols)
		setTConf(tabConfig)
		setQuery(previewQuery)
		//tabConfig.bindings(formatData)
    }, [previewQuery])

	const Contents = ({preview, query, tConf}) => {
		return <>
			{isArray(preview.data) && <Row className="csv-preview-results">
				<ResultViewer type="table" bindings={preview.data}/>
			</Row>}
			<Row className={previewCss}>
				{query && preview.selectedCSV && tConf && <ControlledTable
					query={query}
					freewidth={true}
					view={tConf}
					limit={tConf.pagesize()}/>}
			</Row>
		</>
	}


	const PreviewToolBarForSingleDocuments = ({preview, setPreview}) => {
		return <>
			<Col md={8}>
				<span className="db-card-credit subheader-spacing">
					<MdSlideshow className="db_info_icon_spacing"/>
					<span className="db_info">
						<span className="tdb__dblist__info--blue d-icons-text">
							Showing preview of file  <strong>{preview.fileName} </strong>
						</span>
					</span>
				</span>
			</Col>
			<Col md={4}>
				<span className="d-icon-header close-preview-span" key="cancel" title={"Close Preview and go back"}
					onClick={()=> setPreview({show: false, fileName:false, data:[], selectedCSV: false})}>
	                <BiArrowBack className="db_info_icon_spacing"/>
	            </span>
			</Col>
		</>
	}

	const PreviewBar = ({preview, setPreview}) => {
		return <>
			<Col md={8}>
				<MdSlideshow color="#0055bb" className="csv-preview-icon db_info_icon_spacing"/>
					Showing preview of file  <strong>{preview.fileName} </strong>
			</Col>
			<Col md={4}>
				<span onClick={()=> setPreview({show: false, fileName:false, data:[]})}
					className="db-card-credit csv-act">
					<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing'/>
					<span className="db_info">Close Preview</span>
				</span>
			</Col>
		</>
	}

	return <>
		{preview.show && <>
			{(!preview.selectedCSV) && <>
				<Row className='csv-preview-header'>
					<PreviewBar preview={preview} setPreview={setPreview}/>
				</Row>
				<Contents preview={preview} query={query} tConf={tConf}/>
			</>}
			{(preview.selectedCSV) && (preview.page==DOCUMENT_VIEW) && <>
				<div className="nav__main__wrap">
					<div className="tdb__model__header">
		                <Col md={2}></Col>
		                <Col md={8}>
							<Row>
								<PreviewToolBarForSingleDocuments preview={preview} setPreview={setPreview}/>
							</Row>
						</Col>
						<Col md={2}></Col>
					</div>
				</div>
				<main className="console__page__container console__page__container--width">
					<Contents preview={preview} query={query} tConf={tConf}/>
				</main>
			</>
			}
		</>}
	</>

}
