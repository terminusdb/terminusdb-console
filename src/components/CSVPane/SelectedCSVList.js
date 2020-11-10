import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "reactstrap"
import {WOQLClientObj} from '../../init/woql-client-instance'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {AiOutlineFolderView, AiOutlineExclamationCircle} from "react-icons/ai"
import {MdSlideshow} from "react-icons/md"
import {BiUpload} from "react-icons/bi"
import {TiDeleteOutline} from "react-icons/ti"
import {convertStringsToJson} from '../../utils/helperFunctions';
import {DOCUMENT_VIEW, DEFAULT_COMMIT_MSG} from "./constants.csv"
import {readLines, isObject} from "../../utils/helperFunctions"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'


export const SelectedCSVList = ({csvs, page, setLoading, preview, setPreview, setCsvs, availableCsvs}) => {
	let currentFile={}, availableCsvList=[]
	const [commitMsg, setCommitMsg]=useState(DEFAULT_COMMIT_MSG)
	const [report, setReport]=useState(false)
	const {woqlClient}=WOQLClientObj()

	const viewPreview=(e)=>{
		let maxlines=6, buff=[] // read 6 lines
		const fileName = e.target.id
		currentFile.fileName=fileName
		const file = csvs.filter(item => item.name == fileName)
	    readLines(file[0], maxlines, function(line) {
			buff+=line
	    }, function onComplete() {
			convertToJson(buff)
	    });
	}

	const convertToJson = (content) => {
		let limitedData = []
		const jsonRes=convertStringsToJson(content)
		for(var item in jsonRes) {
			limitedData.push(jsonRes[item])
		}
		setLoading(false)
		setPreview({show: true, fileName: currentFile.fileName, data: limitedData});
	};


	const removeCsv=(e)=>{
		const fileName = e.target.id
		setCsvs(csvs.filter(item => item.name !== fileName));
		if(preview.fileName==fileName)
			setPreview({show: false, fileName:false, data:[]})
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
		return woqlClient.insertCSV(csvs , commitMsg, null, null).then((results) => {
            setReport({status: TERMINUS_SUCCESS, message: "Successfully uploaded files "})
			setCsvs([]);
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
	}

	const duplicateActions=()=>{
		return <div>this is duplicate</div>
	}

	const List=()=>{
		return (csvs.map( item => <>
					<Row style={{width: "100%"}} className={action.CSV_ROWS}>
						<Col md={8}>
							<AiOutlineFolderView color={"#0055bb"} className="db_info_branch_icon"/>
							<span className="csv-item-title">{item.name}</span>
						</Col>
						<Col md={2}>
							<span id={item.name} onClick={viewPreview} className="db-card-credit csv-act">
								<MdSlideshow id={item.name} color="#0055bb" className={action.CONTROLS_ICONS}/>
								<span className={action.CONTROLS_TEXT} id={item.name}>{action.PREVIEW}</span>
							</span>
						</Col>
						<Col md={2}>
							<span id={item.name} onClick={removeCsv} className={action.CONTROLS_SPAN_CSS}>
								<TiDeleteOutline id={item.name} color="#721c24" className={action.CONTROLS_ICONS}/>
								<span className={action.CONTROLS_TEXT} id={item.name}>{action.REMOVE}</span>
							</span>
						</Col>
					</Row>
					{(page==DOCUMENT_VIEW) && availableCsvs.map(acv => <>
						{acv==item.name && <Row>
							<span id={item.name} className={action.DUPLICATE_SPAN_CSS}>
								<AiOutlineExclamationCircle id={item.name} color="#856404" className={action.CONTROLS_ICONS}/>
								<span className={action.CONTROLS_TEXT}>This CSV was already added</span>
							</span>
						</Row>}
					</>)}
				</>))
	}

	return(<>
			<Row className="generic-message-holder">
				{report && <TerminusDBSpeaks report={report}/>}
			</Row>
			<List/>
			{(page==DOCUMENT_VIEW) && <Row className="upload-row">
				<Col md={6}>
				</Col>
				<Col md={4}>
					<input class="commit-log-input" type="text" placeholder="Enter message for commit log" width="40"
						onChange={(e) => setCommitMsg(e.target.value)}/>
				</Col>
				<Col md={2}>
					<button onClick={handleUpload} class="tdb__button__base tdb__button__base--bgreen upload-csv-btn">
						{action.UPLOAD}
					</button>
				</Col>
			</Row>}
		</>
	)
}
