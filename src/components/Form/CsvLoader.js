import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {readString} from 'react-papaparse';
import {WOQLClientObj} from '../../init/woql-client-instance'
import {MdSlideshow} from 'react-icons/md'
import {TiDeleteOutline} from 'react-icons/ti'
import {BiUpload} from 'react-icons/bi'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'

export const CsvLoader = (props) => {

	const csvs = props.csvs || []
	const setCsvs=props.setCsvs
	const [preview, setPreview] = useState({show:false, fileName:false, data:[]})
	let fileReader, headerReader, focusFile={};
	const [commitMsg, setCommitMsg] = useState("Adding csvs ...")
	const page=props.page || 'document'

	const [report, setReport] = useState()
    const [loading, setLoading] = useState(false)

	const {woqlClient} = WOQLClientObj()

	const viewPreview = (e) => {
		const fileName = e.target.id
	    handleFileRead(fileName)
	}

	const removeCsv = (e) => {
		setCsvs(csvs.filter(item => item.name !== e.target.id));
		csvs.map( item => {
			if(item.name == fileName){
				setPreview({show: false, fileName:false, data:[]})
			}
		})
	}

	const handleFileRead = (selectedFile) => {
		const file = csvs.filter(item => item.name == selectedFile)
		focusFile.fileName=selectedFile
		fileReader = new FileReader();
		fileReader.onloadend = convertToJson;
		fileReader.readAsText(file[0]);
	}

	const convertToJson = (e) => {
	    const content = fileReader.result;
		const parsedContent = readString(content, {quotes: false,
						  quoteChar: '"',
						  escapeChar: '"',
						  delimiter: ",",
						  header: true,
						  newline: "{",
						  skipEmptyLines: false,
						  columns: null
						})
		focusFile.data=parsedContent.data
		setPreview({show: true, fileName: focusFile.fileName, data: focusFile.data});
	};

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const singleUploads = (e) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		const fileName = e.target.id, file = []
		csvs.map( item => {
			if(item.name == fileName){
				file.push(item)
				return woqlClient.insertCSV(file , commitMsg, null, null)
					.then((results) => {
						let rep = {status: TERMINUS_SUCCESS, message: "Successfully uploaded files "+fileName}
			            setReport(rep)
				})
				.catch((err) => process_error(err, update_start, "Failed to upload file"))
		        .finally(() => setLoading(false))
			}
		})
	}

	return ( <div>

		<Row className="generic-message-holder">
			{report &&
				<TerminusDBSpeaks report={report} />
			}
		</Row>

		{csvs.map( item =>
			<Row style={{width: "100%"}} key={item} className="csv-rows">
				<Col md={3}> {item.name} </Col>
				<Col md={2}>
					<span id={item.name} onClick={viewPreview} className="db-card-credit csv-act">
		            	<MdSlideshow id={item.name} color="#0055bb" className='db_info_icon_spacing csv_icon_spacing '/>
		            	<span className="db_info" id={item.name}> Preview Csv</span>
		        	</span>
				</Col>
				<Col md={2}>
					<span id={item.name} onClick={removeCsv} className="db-card-credit csv-act">
						<TiDeleteOutline id={item.name} color="#721c24" className='db_info_icon_spacing csv_icon_spacing '/>
						<span className="db_info" id={item.name}> Remove Csv</span>
					</span>
				</Col>
				<Col md={5}>
					{(page == 'document') && <Row>
						<Col md={8}>
							<input class="commit-log-input" type="text"
								placeholder="Enter message for commit log" width="40"
								onChange={(e) => setCommitMsg(e.target.value)}/>
						</Col>
						<Col md={4}>
							<span id={item.name} onClick={singleUploads} className="db-card-credit csv-act">
								<BiUpload id={item.name} color="#0055bb" className='db_info_icon_spacing csv_icon_spacing '/>
								<span className="db_info" id={item.name}> Upload Csv</span>
							</span>
						</Col>
					</Row>}
				</Col>
			</Row>
		)}

		{preview.show && <>
			<Row className='csv-preview-header' key="re">
				<Col md={10}>
					<MdSlideshow color="#0055bb" className="csv-preview-icon db_info_icon_spacing"/>
						Showing preview of file  <strong>{preview.fileName} </strong>
				</Col>
				<Col md={2}>
					<span onClick={()=> setPreview({show: false, fileName:false, data:[]})}
						className="db-card-credit csv-act">
						<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing '/>
						<span className="db_info"> Close Preview</span>
					</span>
				</Col>
			</Row>
			<ResultViewer type ="table" bindings= {preview.data}/>
		</>}
	    </div>
	)
}
