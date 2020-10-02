import React, {useState, useRef} from 'react'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { DataViewer } from "../Table/DataViewer"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {Col, Row} from "reactstrap"
import { readString  } from 'react-papaparse'
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import { TerminusDBSpeaks } from '../Reports/TerminusDBSpeaks'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'

export const DataLoader = (props) => {

	//const [files, setFiles] = useState(false);
	//const [fileName, setFileName] = useState("")
    const [uploaded, setUploaded] = useState(false)
	const [commitMsg, setCommitMsg] = useState("Adding csvs ...")

	const [files, setFiles] = useState({name: false, file: {}})

	const {woqlClient} = WOQLClientObj()
	const [bindings, setbindings] = useState(false)

	const [report, setReport] = useState()
    const [loading, setLoading] = useState(false)

	const loadFiles = (e) => {
        let files = e.target.files, value = e.target.value, message;
        if( files && files.length > 1 )
            message = `${files.length} files selected`;
        else message = value.split( '\\' ).pop();
		if(message) {
			setFiles({name: message, files:e.target.files})
		}
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


	const handleUpload = (e) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		woqlClient.insertCSV(files.files, commitMsg, null, null).then((results) => {
			let rep = {status: TERMINUS_SUCCESS, message: "Successfully uploaded " + files.name}
            setReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
	}

	const updateCommitMsg = (e) => {
		setCommitMsg(e.target.value)
	}


	const viewCsv = (e) => {
		woqlClient.getCSV(null, null).then((results) =>{
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
			setbindings(jsonRes)
		})
	}

	return ( <>
		<div className="load-data-section">
			<div>
				<AiOutlineInfoCircle color="#787878" className="intro_text_icon"/>
				<span class="intro_text">Click here to import CSV or Json file to create a database with data (Optional)</span>
			</div>

			<Row className="upload-data-align">
				<Col md={4}>
					<input type="file"
						name="file-7[]"
						id="file-7"
						class="inputfile inputfile-6"
						data-multiple-caption={files.name}
						onChange={loadFiles}
						accept=".csv,.json"/>

					<label for="file-7"><span>{files.name}</span> <strong>Add Data</strong></label>
					</Col>
				{files.name && <>
					<Col md={5}>
						<input class="commit-log-input" type="text" placeholder="Enter message for commit log" width="40" onChange={updateCommitMsg}/>
					</Col>
					<Col md={3}>
						<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={handleUpload}>Upload Data</button>
					</Col>
				</>}
			</Row>

			<Row className="generic-message-holder">
                {report &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>

			<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={viewCsv}>View Csv</button>

			{bindings && <WOQLTable bindings={bindings}/>}

			{/*<DataViewer file={files}/>*/}
		</div>

		</>
	)
}
