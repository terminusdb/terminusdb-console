import React, {useState, useEffect} from "react"
import Loading from '../../components/Reports/Loading'
import {CSVContents} from "./CSVContents"
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { ResultViewer } from "../QueryPane/ResultViewer"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {CSVPreview} from "./CSVPreview"
import {CSVExport} from "./CSVExport"
import {readString} from 'react-papaparse';
import {Row, Col} from "reactstrap"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'

export const CSVList=()=>{
	const [loading, setLoading]=useState(false)
	const [happiness, setHappiness]=useState(false)
	const [csvBindings, setCsvBindings] = useState(false)
	const [rep, setReport]=useState(false)
	const [preview, setPreview] = useState({show:false, fileName:false, data:[]})
	const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()

	const csvQuery = TerminusClient.WOQL.limit(50,
		TerminusClient.WOQL.triple('v:Type', 'type', 'scm:CSV').triple('v:Type', 'label', 'v:name'))
	const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(
        woqlClient,
        csvQuery,
        branch,
        ref,
    )

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const getCsv=async(e) => {
		let name=e.target.id, update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.getCSV(name).then((results) =>{
			const res = readString(results, {quotes: false,
							  quoteChar: '"',
							  escapeChar: '"',
							  delimiter: ",",
							  header: true,
							  newline: "{",
							  skipEmptyLines: false,
							  columns: null
							})
			const jsonRes = res.data
			setPreview({show: true, fileName: name, data: jsonRes});
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
		.finally(() => setLoading(false))
	}

	const constructCsvBindings=(bindings)=>{
		for(var item in bindings) {
			bindings[item].Contents=<CSVContents getCsv={getCsv} fileName={bindings[item].name['@value']}/>
			bindings[item].Download=<CSVExport getCsv={getCsv} fileName={bindings[item].name['@value']}/>
		}
		setCsvBindings(bindings)
		setHappiness(true)
	}

	useEffect(() => {
		if (report) {
			if (report.error || report == 'error') {
				console.log(report.error)
			}
			else {
				constructCsvBindings(bindings)
			}
		}
    }, [bindings])

	return (<>
			{loading &&  <Loading type={TERMINUS_COMPONENT} />}
			<Row className="generic-message-holder">
				{rep && <TerminusDBSpeaks report={report}/>}
			</Row>
			{happiness && csvBindings && <>
				<div className="sub-headings">CSV Documents</div>
				<ResultViewer type ="table" query={woql} updateQuery={updateQuery} bindings= {csvBindings}/></>}
			<br/>
			<CSVPreview preview={preview} setPreview={setPreview}/>
	</>)
}
