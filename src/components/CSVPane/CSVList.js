import React, {useState, useEffect} from "react"
import {WOQLTable} from '@terminusdb/terminusdb-react-components';
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { ResultViewer } from "../QueryPane/ResultViewer"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {CSVPreview} from "./CSVPreview"
import {CSVControls} from "./CSVControls"
import {DOCTYPE_CSV, SHOW, REMOVE, DOWNLOAD} from "./constants.csv"
import {convertStringsToJson} from '../../utils/helperFunctions';
import {Row, Col} from "reactstrap"
import {ControlledTable} from '../../views/Tables/ControlledTable'

import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'

export const CSVList=()=>{
	const [loading, setLoading]=useState(false)
	const [happiness, setHappiness]=useState(false)
	const [csvBindings, setCsvBindings] = useState(false)
	const [rep, setReport]=useState(false)
	let WOQL = TerminusClient.WOQL
	const [preview, setPreview] = useState({show:false, fileName:false, data:[]})
	const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()

	const csvQuery = () => {
        let q = WOQL.and(WOQL.lib().document_metadata())
        q.sub(DOCTYPE_CSV, "v:Type ID")
        return q
    }

	const [query, setQuery]=useState(csvQuery)

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const getCsv=async(name, download) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.getCSV(name, download).then((results) =>{
			const jsonRes=convertStringsToJson(results)
			if(!download) setPreview({show: true, fileName: name, data: jsonRes});
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
		.finally(() => setLoading(false))
	}

	const handleDelete=async(e) => {
		let name=e.target.id, update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.deleteCSV(name).then((results) =>{
			console.log('results', results)
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
		.finally(() => setLoading(false))
	}

	const constructCsvBindings=(bindings)=>{
		for(var item in bindings) {
			let fileName=bindings[item].Name['@value']
			bindings[item].Contents=<CSVControls action={SHOW} color={"#0055bb"} onClick={getCsv} fileName={fileName} loading={loading}/>
			bindings[item].Download=<CSVControls action={DOWNLOAD} color={"#0055bb"} fileName={fileName} onClick={getCsv} loading={loading}/>
			bindings[item].Delete=<CSVControls action={REMOVE} color={"#721c24"} fileName={fileName} onClick={handleDelete} loading={loading}/>
		}
		setCsvBindings(bindings)
		setHappiness(true)
	}

	/*useEffect(() => {
		if (report) {
			if (report.error || report == 'error') {
				console.log(report.error)
			}
			else {
				constructCsvBindings(qresult.bindings)
			}
		}
    }, [qresult]) */

	let onRowClick = function(row){
		const name=row.original.Name["@value"]
        getCsv(name, false)
    }

	const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.column("Document ID", "Name").width(200)
	tabConfig.row().click(onRowClick)
    tabConfig.pager("remote")
    tabConfig.pagesize(10)

	return (<>
			{loading &&  <Loading type={TERMINUS_COMPONENT} />}
			<Row className="generic-message-holder">
				{rep && <TerminusDBSpeaks report={report}/>}
			</Row>
			{happiness && csvBindings && <>
				<div className="sub-headings">CSV Documents</div>
				{/*<ResultViewer type ="table" query={woql} updateQuery={updateQuery} bindings= {csvBindings}/>*/}
			</>}
			<ControlledTable limit={tabConfig.pagesize()}
				query={query}
				view={tabConfig}
				onError={setReport}/>
			<br/>
			<CSVPreview preview={preview} setPreview={setPreview} previewCss={"csv-preview-results csv-preview-results-border "}/>
	</>)
}
