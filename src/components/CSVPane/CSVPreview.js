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

export const CSVPreview=({preview, setPreview, previewCss})=>{
	const {woqlClient} = WOQLClientObj()
	let propertyColumnNames=[]
	const [query, setQuery] = useState(false)
	const tabConfig=TerminusClient.View.table();
	const [tConf, setTConf]=useState({})
	const [propertyQuery, setPropertyQuery]=useState(false)
	const [cols, setCols]=useState([])

	let formatData=(bindings)=>{
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
		/*for(var key in bindings){
			bindings[key]["Properties"] = "helloWorld"
		}*/
		//nBindings = bindings
		console.log('nBindings', nBindings)
		return nBindings
	}

	useEffect(() => {
		let id=preview.selectedCSV
		// get property names from graph
        const q=TerminusClient.WOQL.triple(id, "scm:csv_column", "v:Column Obj").triple("v:Column Obj", "scm:csv_column_name", "v:Property Name")
        woqlClient.query(q).then((results) => {
			let wr = new TerminusClient.WOQLResult(results, q)
			for(var key in wr.bindings){
				let cln= "Column " + wr.bindings[key]["Property Name"]["@value"]
				propertyColumnNames.push(cln)
			}
			setCols(propertyColumnNames)
			let qp=TerminusClient.WOQL.triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id).triple('v:CSV ID', 'scm:csv_row', 'v:CSV Rows')
			   .triple('v:CSV Rows', 'v:Properties', 'v:Value').quad('v:Properties', 'label', 'v:Property Name', 'schema/main')
			setPropertyQuery(qp)
			//tabConfig.column_order('v:CSV Rows', 'v:Properties')
		})
	}, [preview.selectedCSV])

	useEffect(() => {
		tabConfig.pagesize(100)
		tabConfig.pager("remote")
		//tabConfig.column_order('v:Properties', 'v:CSV ID')
		tabConfig.column_order(...cols)
		setTConf(tabConfig)
		setQuery(propertyQuery)
		tabConfig.bindings(formatData)
		console.log('tabconfig after set', tConf)
    }, [propertyQuery])



	//console.log('tabConfig.bindings(formatData)', tabConfig.bindings)


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
			<Row className={previewCss}>
				{query && preview.selectedCSV && tConf && <ControlledTable
					query={query}
					freewidth={true}
					view={tConf}
					limit={tConf.pagesize()}/>}
			</Row>
		</>}
	</>

}
