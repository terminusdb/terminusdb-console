import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "reactstrap"
import {WOQLClientObj} from '../../init/woql-client-instance'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {AiFillBuild, AiOutlineEdit} from "react-icons/ai"
import {BsFileEarmarkPlus} from "react-icons/bs"
import {MdSlideshow} from "react-icons/md"
import {BiUpload} from "react-icons/bi"
import {TiDeleteOutline} from "react-icons/ti"
import {convertStringsToJson} from '../../utils/helperFunctions';
import {DOCUMENT_VIEW, DEFAULT_COMMIT_MSG, CREATE_DB_VIEW} from "./constants.csv"
import {readLines, isObject, isArray} from "../../utils/helperFunctions"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {ManageDuplicateCsv} from "./ManageDuplicateCSV"
import {formatBytes} from "../../utils/format"
import Select from 'react-select'
import {formatFileDate, DATETIME_DB_UPDATED} from '../../constants/dates'
import {DBContextObj} from '../../components/Query/DBContext'

export const SelectedCSVList = ({csvs, page, setLoading, preview, setPreview, setCsvs, availableCsvs, updateSelectedSingleFile}) => {
	let currentFile={}, availableCsvList=[]
	const [commitMsg, setCommitMsg]=useState(DEFAULT_COMMIT_MSG)
	const [report, setReport]=useState(false)
	const {woqlClient}=WOQLClientObj()
	const {updateBranches} = (DBContextObj() !== undefined) ? DBContextObj() : false

	const convertToJson = (content) => {
		let limitedData = []
		const jsonRes=convertStringsToJson(content)
		for(var item in jsonRes) {
			limitedData.push(jsonRes[item])
		}
		setLoading(false)
		setPreview({show: true, fileName: currentFile.fileName, data: limitedData, page: page, selectedCSV:false});
	};


	function process_error(err, update_start, message){
		setLoading(false)
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const handleUpload=(e) => {
		let update_start = Date.now(), upFormatted=[]
        update_start = update_start || Date.now()
		setLoading(true)
		let updateFiles=csvs.filter(item => { // filter csvs for update
			let act=item.action.split(" ")
			if(act[0]==action.UPDATE){
				upFormatted.push({fileToBeUpdated:item.fileToUpdate, updateWith:item})
				return true
			}
			else false
		})
		let insertFiles=csvs.filter(item => item.action === action.CREATE_NEW) // filter csvs for create
		if(isArray(upFormatted)){
			woqlClient.updateCSV(upFormatted , commitMsg, null, null).then((results) => {
                updateBranches()
				setReport({status: TERMINUS_SUCCESS, message: "Successfully updated files "})
				setPreview({show: false, fileName:false, data:[], selectedCSV: false})
				setCsvs([]);
			})
			.catch((err) => process_error(err, update_start, "Failed to update file"))
			//.finally(() => setLoading(false))
		}
		if(isArray(insertFiles)){
			woqlClient.insertCSV(insertFiles , commitMsg, null, null).then((results) => {
                updateBranches()
                setReport({status: TERMINUS_SUCCESS, message: "Successfully added files "})
				setPreview({show: false, fileName:false, data:[], selectedCSV: false})
				setCsvs([]);
			})
			.catch((err) => process_error(err, update_start, "Failed to add file"))
			.finally(() => setLoading(false))
		}
	}





	const getSelectOptions=(id)=>{
		let opts=[{value: action.CREATE_NEW, label: action.CREATE_NEW, id: id}]
		availableCsvs.map(names=>{
			let updateOpt=action.UPDATE+" "+names
			opts.push({value: updateOpt, label: updateOpt, id: id, fileToUpdate:names})
		})
		return opts
	}

	const FileName=({item})=>{
		return <span className="selected-csv-span selected-csv-name-span">
			<BsFileEarmarkPlus color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{item.name}</span>
		</span>
	}

	const FileSize=({item})=>{
		return <span className="selected-csv-span">
			<AiFillBuild color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{formatBytes(item.size)}</span>
		</span>
	}

	const FileLastModified=({item})=>{
		return <span className="selected-csv-span">
			<AiOutlineEdit color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{formatFileDate(item.lastModified)}</span>
		</span>
	}

	const customStyles = {
	  control: base => ({
		...base,
		height: "30px"
	  }),
	  valueContainer: (base) => ({
		...base,
		height: "30px"
	  })
	};

	const SelectActions=({item, page, availableCsvs})=>{
		const changeAction=(e)=>{
			csvs.map(item=>{
				if(item.name==e.id){
					item.action=e.value
					item.fileToUpdate=e.fileToUpdate
				}
			})
		}
		return <>
			{(page==DOCUMENT_VIEW) && (isArray(availableCsvs)) && <span className="selected-csv-span selected-csv-select-span">
				<Select placeholder={"Choose an action"}
					className={action.CONTROLS_TEXT}
					defaultValue={{value: item.action, label: item.action}}
					onChange = {changeAction}
					styles={customStyles}
					options = {getSelectOptions(item.name)}
				/>
			</span>}
		</>
	}

	const SelectForSingleUpdateFile=({item, page})=>{
		return <>
			{(page==DOCUMENT_VIEW) && <span className="selected-csv-span selected-csv-select-span">
				<Select placeholder={"Choose an action"}
					className={action.CONTROLS_TEXT}
					defaultValue={{value: item.action, label: item.action}}
					styles={customStyles}
				/>
			</span>}
		</>
	}

	const FilePreview=({item})=>{
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
		return <span id={item.name} onClick={viewPreview} className="db-card-credit csv-act">
			<MdSlideshow id={item.name} color="#0055bb" className={action.CONTROLS_ICONS}/>
			<span className={action.CONTROLS_TEXT} id={item.name}>{action.PREVIEW}</span>
		</span>
	}

	const FileRemove=({item})=>{

		const removeCsv=(e)=>{
			const fileName = e.target.id
			setCsvs(csvs.filter(item => item.name !== fileName));
			if(preview.fileName==fileName)
				setPreview({show: false, fileName:false, data:[], selectedCSV:false})
		}

		return <span className="selected-csv-span">
			<span id={item.name} onClick={removeCsv} className={action.CONTROLS_SPAN_CSS}>
				<TiDeleteOutline id={item.name} color="#721c24" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT} id={item.name}>{action.REMOVE}</span>
			</span>
		</span>
	}

	const List=()=>{
		return (csvs.map( item => <div key={"d_"+item.name+"_"+item.lastModified}>
					<Row style={{width: "100%"}} className={action.CSV_ROWS} key={"Row_"+item.name+"_"+item.lastModified}>
						<FileName item={item}/>
						<FileSize item={item}/>
						<FileLastModified item={item}/>
						<SelectActions item={item} availableCsvs={availableCsvs} page={page}/>
						{(updateSelectedSingleFile) && <SelectForSingleUpdateFile page={page} item={item}/>}
						{(page==CREATE_DB_VIEW) && <span className="selected-csv-span"></span>}
						{(page==DOCUMENT_VIEW) && (isArray(availableCsvs)) && <>
							<span className="selected-csv-span">
								<div className={action.CONTROLS_TEXT + " flatText"}>{action.CREATE_NEW}</div>
							</span>
						</>}
						<span className="selected-csv-span">
							{(!updateSelectedSingleFile) && <FilePreview item={item}/>}
						</span>
						<FileRemove item={item}/>
					</Row>
					{(page==DOCUMENT_VIEW) && (isArray(availableCsvs)) && availableCsvs.map(acv => <>
						{acv==item.name && <div key={"d_existMsg_"+item.name+"_"+item.lastModified}>
							<ManageDuplicateCsv fileName={item.name}/>
						</div>}
					</>)}
					{(page==DOCUMENT_VIEW) && <span className="selected-csvs-sections" key={"span_"+item.name+item.lastModified}> </span>}
				</div>))
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
					<input className="commit-log-input" type="text" placeholder="Enter message for commit log" width="40"
						onChange={(e) => setCommitMsg(e.target.value)}/>
				</Col>
				<Col md={2}>
					<button onClick={(e) => handleUpload(e)} className={action.CSV_MAIN_ACTION_CSS}>
						{action.UPLOAD}
					</button>
				</Col>
			</Row>}
		</>
	)
}
