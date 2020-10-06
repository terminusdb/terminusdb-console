import React, {useState, useRef} from 'react'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { DataViewer } from "../Table/DataViewer"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {Col, Row} from "reactstrap"
import { readString  } from 'react-papaparse'
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import { TerminusDBSpeaks } from '../Reports/TerminusDBSpeaks'
import { CSVLink, CSVDownload   } from "react-csv";
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'

export const DataLoader = (props) => {

	const [insertFiles, setInsertFiles] = useState({})
	const [insertCommitMsg, setInsertCommitMsg] = useState("Adding csvs ...")

    const [updateFiles, setUpdateFiles] = useState({})
	const [updateCommitMsg, setUpdateCommitMsg] = useState("Update csvs ...")

	const [insertInput, setInsertInput] = useState(false)
    const [updateInput, setUpdateInput] = useState(false)

	const {woqlClient} = WOQLClientObj()
	const [bindings, setbindings] = useState(false)

	const [report, setReport] = useState()
    const [loading, setLoading] = useState(false)

	const loadInsertFiles = (e) => {
        let files = e.target.files, value = e.target.value, text;
        if( files && files.length > 1 )
            text = `${files.length} files selected`;
        else text = value.split( '\\' ).pop();
		if(text) {
			setInsertFiles(e.target.files)
			setInsertInput(text)
		}
    }

    const loadUpdateFiles = (e) => {
        let files = e.target.files, value = e.target.value, text;
        if( files && files.length > 1 )
            text = `${files.length} files selected`;
        else text = value.split( '\\' ).pop();
		if(text) {
			setUpdateFiles(e.target.files)
			setUpdateInput(text)
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


    const insertSingleFile = async(file, update_start) => {
        return await woqlClient.insertCSV(file, insertCommitMsg, null, null).then((results) => {
			let rep = {status: TERMINUS_SUCCESS, message: "Successfully uploaded files"}
            setReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
    }

	const handleInsert = (e) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
        for (var i = 0; i < insertFiles.length; i++) {
            insertSingleFile(insertFiles[i], update_start)
        }
	}

	const viewCsv = async (e) => {
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
			setbindings(jsonRes)
		})
	}

    const updateCsv = async(file, update_start) => {
        return await woqlClient.updateCSV(file, updateCommitMsg, null, null).then((results) => {
			let rep = {status: TERMINUS_SUCCESS, message: "Successfully updated files"}
            setReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
    }

    const handleUpdate = (e) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
        for (var i = 0; i < updateFiles.length; i++) {
            updateCsv(updateFiles[i], update_start)
        }
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
						data-multiple-caption={insertInput}
						onChange={loadInsertFiles}
						accept=".csv,.json"/>

					<label for="file-7"><span>{insertInput}</span> <strong>Add Data</strong></label>
					</Col>
				{insertFiles.length && <>
					<Col md={5}>
						<input class="commit-log-input" type="text"
                            placeholder="Enter message for commit log" width="40"
                            onChange={(e) => setInsertCommitMsg(e.target.value)}/>
					</Col>
					<Col md={3}>
						<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={handleInsert}>Upload Data</button>
					</Col>
				</>}
			</Row>

			<Row className="generic-message-holder">
                {report &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>

			<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={viewCsv}>View Csv</button>

            {bindings &&<CSVLink
              data={bindings}
              onClick={() => {
                console.log("You click the link");
            }}>Download me</CSVLink>}

			{bindings && <WOQLTable bindings={bindings}/>}

            <Row className="upload-data-align">
				<Col md={4}>
					<input type="file"
						name="file-8[]"
						id="file-8"
						class="inputfile inputfile-6"
						data-multiple-caption={updateInput}
						onChange={loadUpdateFiles}
						accept=".csv,.json"/>

					<label for="file-8"><span>{updateInput}</span> <strong>Update Data</strong></label>
					</Col>
				{updateFiles.length && <>
					<Col md={5}>
						<input class="commit-log-input" type="text"
                            placeholder="Enter message for commit log" width="40"
                            onChange={(e) => setUpdateCommitMsg(e.target.value)}/>
					</Col>
					<Col md={3}>
						<button className="tdb__button__base tdb__button__base--bgreen upload-file" onClick={handleUpdate}>Update Data</button>
					</Col>
				</>}
			</Row>

			{/*<DataViewer file={insertFiles}/>*/}
		</div>

		</>
	)
}
