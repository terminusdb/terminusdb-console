import React, {useState, useEffect} from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLClientObj} from '../../init/woql-client-instance'
import TerminusClient from '@terminusdb/terminusdb-client'
import {CSVLink, CSVDownload} from "react-csv";
import {Row, Col} from "reactstrap";
import {readString} from 'react-papaparse';
import {BiShow} from 'react-icons/bi'
import Loading from '../../components/Reports/Loading'
import {AiOutlineInfoCircle} from "react-icons/ai"
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'

export const CsvList = () => {
	const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()

	const [happiness, setHappiness] = useState(false)
	const [updateFiles, setUpdateFiles] = useState([])
    const [updateCommitMsg, setUpdateCommitMsg] = useState("Update csvs ...")

	const [loading, setLoading] = useState(false)
	//const [csvReport, setReport] = useState()

	const [contents, setContents]=useState({show:false, name: false, data:[]})

	//const csvQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.triple('v:Type', 'type', TerminusClient.WOQL.iri('csv:///schema#Csv'))
    //    .triple('v:Type', 'label', 'v:File Name'))
	const csvQuery = TerminusClient.WOQL.limit(50,
		TerminusClient.WOQL.triple('v:Type', 'type', 'scm:CSV').triple('v:Type', 'label', 'v:name'))

	const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(
        woqlClient,
        csvQuery,
        branch,
        ref,
    )

	const [csvBindings, setCsvBindings] = useState(false)
	const [csvContents, setCsvContents] = useState('false')
	const [csvData, setCsvData] = useState('sf')

	const loadUpdateFiles = (e) => {
		//for(var i=0; i<e.target.files.length; i++){
 		   let files = {};
           files = e.target.files
 		   setUpdateFiles(files);
 	   //}
    }

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const updateCsv = async(file, update_start) => {
        return await woqlClient.updateCSV(file, updateCommitMsg, null, null).then((results) => {
			//let rep = {status: TERMINUS_SUCCESS, message: "Successfully updated files"}
            //setReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
    }

	const getUpdateButton = () => {
		return (<Row className="upload-data-align">
			<Col md={3}>
				<input type="file"
					name="addCss"
					id="updateCss"
					class="inputfile add-files"
					onChange={loadUpdateFiles}
					accept=".csv"/>

				<label for="updateCss">Update Csv</label>
			</Col>
		</Row>)
	}

	const getUpload = () => {
		return (<>
			{(updateFiles.length > 0) && <>
			<Col md={6}>
				<input class="commit-log-input" type="text"
					placeholder="Enter message for commit log" width="40"
					onChange={(e) => setUpdateCommitMsg(e.target.value)}/>
			</Col>
			<Col md={3}>
				<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={updateCsv}>Update</button>
			</Col>
		</>}
	</>)
	}


	useEffect(() => {
        setCsvData(csvContents)
    }, [csvContents])

	const getDownloadButton = (bindings) => {
		return (<CSVLink
		  data={csvData}
		  asyncOnClick={true}
		  onClick={async(event, done) => {
			return await woqlClient.getCSV(null, null).then((results) =>{
				const csvRes = readString(results, {quotes: false,
								  quoteChar: '"',
								  escapeChar: '"',
								  delimiter: ",",
								  header: true,
								  newline: "{",
								  skipEmptyLines: false,
								  columns: null
								})
				const jsonRes = csvRes.data
				setCsvContents(jsonRes)
				done();
			})
		}}>Download me</CSVLink>)
	}

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const getCsv = async(e) => {
		let fileName=e.target.id, update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.getCSV(fileName, null).then((results) =>{
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
			setContents({show:true, name:fileName, data:jsonRes})
			//setReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + fileName))
		.finally(() => setLoading(false))
	}

	const getShowContents = (fileInfo) => {
		const fileName = fileInfo.name['@value']
		return (
			<span id={fileName} onClick={getCsv} className="db-card-credit csv-act">
				<BiShow id={fileName} color="#0055bb" className='db_info_icon_spacing csv_icon_spacing '/>
				<span className="db_info" id={fileName}>Show Contents</span>
			</span>
		)}


	const constructCsvBindings = (bindings) => {
		for(var item in bindings) {
			bindings[item].Contents = getShowContents(bindings[item])
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
    }, [report, bindings])

    return (<>
		{loading &&  <Loading type={TERMINUS_COMPONENT} />}
		{happiness && csvBindings &&
			<ResultViewer type ="table" query={woql} updateQuery={updateQuery} bindings= {csvBindings}/>}
		<br/>
		{contents.show && <>
			<Row key="rr">
				<AiOutlineInfoCircle color={"#787878"} className={"intro_text_icon"}/>
				<span className="intro_text csv_title">Contents of <strong>{contents.name}</strong></span>
			</Row>
			<Row key="re" className="upload-data-align csv-rows">
				<Col md={1}><CSVLink data={contents.data}>Download me</CSVLink></Col>
				<Col md={2}>
					<input type="file"
						name="addCss"
						id="updateCss"
						class="inputfile add-files"
						onChange={loadUpdateFiles}
						accept=".csv"/>

					<label for="updateCss">Update Csv</label>
				</Col>
				{(updateFiles.length > 0) && <>
					<Col md={6}>
						<input class="commit-log-input" type="text"
							placeholder="Enter message for commit log" width="40"
							onChange={(e) => setUpdateCommitMsg(e.target.value)}/>
					</Col>
					<Col md={3}>
						<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={updateCsv}>Update</button>
					</Col>
				</>}
			</Row>
			<ResultViewer type ="table" bindings= {contents.data}/>
		</>}
	</>)
}
