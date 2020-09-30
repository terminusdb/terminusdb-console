import React, {useState, useRef} from 'react'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { DataViewer } from "../Table/DataViewer"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {Col, Row} from "reactstrap"
import { readString  } from 'react-papaparse'
import { WOQLTable } from '@terminusdb/terminusdb-react-components';

export const DataLoader = (props) => {

	const [files, setFiles] = useState(false);
	const [fileName, setFileName] = useState("")
    const [uploaded, setUploaded] = useState(false)
	const [commitMsg, setCommitMsg] = useState(false)
	const {woqlClient} = WOQLClientObj()
	const [bindings, setbindings] = useState(false)

	const loadFiles = (e) => {
        let files = e.target.files, value = e.target.value, message;
        if( files && files.length > 1 )
            message = `${files.length} files selected`;
        else message = value.split( '\\' ).pop();
		if(message) {
			setFileName(message)
			setFiles(e.target.files)
		}
    }

	const handleUpload = (e) => {
		woqlClient.addCSV(null, null, files, commitMsg).then((results) => {
			console.log('results', results)
		})
	}

	const updateCommitMsg = (e) => {
		if (e.target.value != "")
			setCommitMsg(e.target.value)
		else setCommitMsg("Adding csvs ...")
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
						data-multiple-caption={fileName}
						onChange={loadFiles}
						accept=".csv,.json"/>

					<label for="file-7"><span>{fileName}</span> <strong>Add Data</strong></label>
					</Col>
				{fileName && <>
					<Col md={5}>
						<input class="commit-log-input" type="text" placeholder="Enter message for commit log" width="40" onChange={updateCommitMsg}/>
					</Col>
					<Col md={3}>
						<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={handleUpload}>Upload Data</button>
					</Col>
				</>}
			</Row>
			<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={viewCsv}>View Csv</button>

			{bindings && <WOQLTable bindings={bindings}/>}

			{/*<DataViewer file={files}/>*/}
		</div>

		</>
	)
}
