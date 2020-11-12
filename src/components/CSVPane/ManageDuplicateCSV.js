import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "reactstrap"
import {WOQLClientObj} from '../../init/woql-client-instance'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {AiOutlineExclamationCircle, AiOutlineArrowUp, AiOutlinePlus} from "react-icons/ai"
import {DEFAULT_COMMIT_MSG} from "./constants.csv"

export const ManageDuplicateCsv=({fileName, setLoading, csvs, setCsvs})=>{
	const [commitMsg, setCommitMsg]=useState(DEFAULT_COMMIT_MSG)
	const [report, setReport]=useState(false)
	const {woqlClient}=WOQLClientObj()


	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const handleSingleUpdate=(e)=>{
		let update_start=Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		csvs.map(item=>{
			if(fileName==item.name) {
				return woqlClient.updateCSV([item] , commitMsg, null, null).then((results) => {
		            setReport({status: TERMINUS_SUCCESS, message: "Successfully uploaded files "})
					const list=csvs.filter(item => item.name !== fileName)
					setCsvs(list)
				})
				.catch((err) => process_error(err, update_start, "Failed to upload file"))
		        .finally(() => setLoading(false))
			}
		})
	}

	const handleSingleInsert=(e) => {
		let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		csvs.map(item=>{
			if(fileName==item.name) {
				return woqlClient.insertCSV([item] , commitMsg, null, null).then((results) => {
		            setReport({status: TERMINUS_SUCCESS, message: "Successfully uploaded files "})
					const list=csvs.filter(item => item.name !== fileName)
					setCsvs(list)
				})
				.catch((err) => process_error(err, update_start, "Failed to upload file"))
		        .finally(() => setLoading(false))
			}
		})
	}


	return (<Row style={{width:"100%"}}>
		<Col md={8}>
			<span id={fileName} className={action.DUPLICATE_SPAN_CSS}>
				<AiOutlineExclamationCircle id={fileName} color="#856404" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT}>This CSV was already added, you can update or create a new Csv</span>
			</span>
		</Col>
		{/*<><Col md={2}>
			<span onClick={handleSingleUpdate} className={action.CONTROLS_SPAN_CSS}>
				<AiOutlineArrowUp color="#0055bb" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT}>{action.UPDATE}</span>
			</span>
		</Col>
		<Col md={2}>
			<span onClick={handleSingleInsert} className={action.CONTROLS_SPAN_CSS}>
				<AiOutlinePlus color="#0055bb" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT}>{action.CREATE_NEW}</span>
			</span>
		</Col></>*/}
	</Row>)
}
