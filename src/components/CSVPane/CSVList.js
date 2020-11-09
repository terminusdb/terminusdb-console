import React, {useState, useEffect} from "react"
import Loading from '../../components/Reports/Loading'
import {CSVContents} from "./CSVContents"
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { ResultViewer } from "../QueryPane/ResultViewer"
import {CSVPreview} from "./CSVPreview"
import {CSVExport} from "./CSVExport"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'

export const CSVList=()=>{
	const [loading, setLoading]=useState(false)
	const [happiness, setHappiness]=useState(false)
	const [csvBindings, setCsvBindings] = useState(false)
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

	const constructCsvBindings=(bindings)=>{
		for(var item in bindings) {
			bindings[item].Contents=<CSVContents fileName={bindings[item].name['@value']}
			setPreview={setPreview} setLoading={setLoading}/>
			bindings[item].Download=<CSVExport/>
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
			{happiness && csvBindings && <>
				<div className="sub-headings">CSV Documents</div>
				<ResultViewer type ="table" query={woql} updateQuery={updateQuery} bindings= {csvBindings}/></>}
			<br/>
			<CSVPreview preview={preview} setPreview={setPreview}/>
	</>)
}
