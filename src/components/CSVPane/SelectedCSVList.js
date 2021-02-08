import React, {useState, useEffect} from 'react'
import * as action from "./constants.csv"
import {Row, Col} from "react-bootstrap" //replaced
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {AiFillBuild, AiOutlineEdit} from "react-icons/ai"
import {BsFileEarmarkPlus} from "react-icons/bs"
import {MdSlideshow} from "react-icons/md"
import {BiUpload} from "react-icons/bi"
import {TiDeleteOutline} from "react-icons/ti"
import {convertStringsToJson} from '../../utils/helperFunctions';
import {DOCUMENT_VIEW, DEFAULT_COMMIT_MSG, CREATE_DB_VIEW, DOCTYPE_CSV, SELECT_CUSTOM_STYLES,
	CSV_FILE_TYPE, JSON_FILE_TYPE} from "./constants.csv"
import {readLines, isObject, isArray} from "../../utils/helperFunctions"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {ManageDuplicateCsv, ShowNewIDInput} from "./ManageDuplicateCSV"
import Select from 'react-select'
import {DBContextObj} from '../../components/Query/DBContext'
import {checkIfDocTypeExists, extractFileInfo} from "./utils.csv"

export const SelectedCSVList = ({csvs, page, setLoading, preview, setPreview, setCsvs, availableCsvs, availableDocs}) => {
	let currentFile={}, availableCsvList=[]
	const [commitMsg, setCommitMsg]=useState(DEFAULT_COMMIT_MSG)
	const [selectedFiles, setSelectedFiles]=useState([])
	const [report, setReport]=useState(false)
	const {woqlClient}=WOQLClientObj()
	const {updateBranches} = (DBContextObj() !== undefined) ? DBContextObj() : false

	const FileName=({item})=>{
		return <span className="selected-csv-span selected-csv-name-span">
			<BsFileEarmarkPlus color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{item}</span>
		</span>
	}

	const FileSize=({item})=>{
		return <span className="selected-csv-span">
			<AiFillBuild color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{item}</span>
		</span>
	}

	const FileLastModified=({item})=>{
		return <span className="selected-csv-span">
			<AiOutlineEdit color={"#0055bb"} className="db_info_branch_icon"/>
			<span className="csv-item-title">{item}</span>
		</span>
	}

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


	const convertToJson = (content) => {
		let limitedData = []
		const jsonRes=convertStringsToJson(content)
		for(var item in jsonRes) {
			limitedData.push(jsonRes[item])
		}
		setLoading(false)
		setPreview({show: true, fileType:currentFile.fileType, fileName: currentFile.fileName, data: limitedData, page: page, selectedCSV:false});
	};

	const FilePreview=({item})=>{
		const viewPreview=(e)=>{
			var maxlines=6, buff=[] // read 6 lines
			if(item.fileType==JSON_FILE_TYPE) maxlines=undefined
			const fileName = e.target.id
			currentFile.fileName=fileName
			currentFile.fileType=item.fileType
			const file = csvs.filter(item => item.name == fileName)
		    readLines(file[0], maxlines, function(line) {
				buff+=line
		    }, function onComplete() {
				if(item.fileType==JSON_FILE_TYPE)
					setPreview({show: true, fileType:currentFile.fileType, fileName: currentFile.fileName, data: buff, page: page, selectedCSV:false});
				else convertToJson(buff)
		    });
		}
		return <span className="selected-csv-span">
			<span id={item.name} onClick={viewPreview} className="db-card-credit csv-act">
				<MdSlideshow id={item.name} color="#0055bb" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT} id={item.name}>{action.PREVIEW}</span>
			</span>
		</span>
	}

	const FileRemove=({item})=>{

		const removeFile=(e)=>{
			const fileName = e.target.id
			setCsvs(csvs.filter(item => item.name !== fileName));
			setSelectedFiles([])
			if((item.fileType==CSV_FILE_TYPE) && (item.file.name==fileName))
				setNewIDField({})
			if((item.fileType==CSV_FILE_TYPE) && (preview.fileName==fileName))
				setPreview({show: false, fileName:false, data:[], selectedCSV:false})
		}

		return <span className="selected-csv-span">
			<span id={item.name} onClick={removeFile} className={action.CONTROLS_SPAN_CSS}>
				<TiDeleteOutline id={item.name} color="#721c24" className={action.CONTROLS_ICONS}/>
				<span className={action.CONTROLS_TEXT} id={item.name}>{action.REMOVE}</span>
			</span>
		</span>
	}

	const HeaderBar=()=>{

		function closeHeader(){
			setCsvs([])
		}

		return <Row className='csv-preview-header' key="hr">
			<Col md={8}>
				<span className="preview-bar-title"><strong>Selected files</strong></span>
			</Col>
			<Col md={4}>
				<span onClick={closeHeader}
					className="db-card-credit csv-act" style={{float: "right"}}>
					<TiDeleteOutline color="#721c24" className='db_info_icon_spacing csv_icon_spacing'/>
					<span className="db_info">Close</span>
				</span>
			</Col>
		</Row>
	}

	const getSelectOptions=(item)=>{
		let id=item.name, opts=[]
		if(item.fileType==CSV_FILE_TYPE){
			//opts=[{value: action.CREATE_NEW, label: action.CREATE_NEW, id: id}]
			availableCsvs.map(names=>{
				let updateOpt=action.UPDATE+" "+names
				opts.push({value: updateOpt, label: updateOpt, id: id, fileToUpdate:names})
			})
			return opts
		}
		else return opts;
	}

	const SelectAction=({item, page})=>{
		let defaultValue={}
		if(item.fileType==CSV_FILE_TYPE)
			defaultValue={value: item.action, label: item.action}
		else if(item.fileType==JSON_FILE_TYPE)
			defaultValue={value: item.extracted.select.value, label: item.extracted.select.label}

		const changeAction=(e)=>{
			selectedFiles.map(item=>{
				if(item.name==e.id){
					setNewIDField({})
					if((item.fileType==CSV_FILE_TYPE) && (e.value==action.CREATE_NEW)){ //if user chose create new for already existing csv in db
						let act=item.action.split(" ")
						if(act[0]==action.UPDATE){
							setNewIDField(item)
							item.test=true
						}
					}
					item.action=e.value
					item.fileToUpdate=e.fileToUpdate
				}
			})
		}

		//console.log('selectedFiles', selectedFiles)

		return <>
			{(page==DOCUMENT_VIEW) && (item.action!==action.CREATE_NEW) && <span className="selected-csv-span selected-csv-select-span">
				<Select placeholder={"Choose an action"}
					className={action.CONTROLS_TEXT}
					defaultValue={defaultValue}
					onChange = {changeAction}
					styles={SELECT_CUSTOM_STYLES}
					options = {getSelectOptions(item)}
				/>
			</span>}
			{(item.action==action.CREATE_NEW) && <span className="selected-csv-span selected-csv-select-span">
				<div className={action.CONTROLS_TEXT + " flatText"}>{action.CREATE_NEW}</div>
			</span>}
		</>
	}

	const handleUpload=async(e) => {
		let update_start = Date.now(), upFormatted=[]
        update_start = update_start || Date.now()
		setLoading(true)
		let jsonFiles=selectedFiles.filter(item => item.fileType === JSON_FILE_TYPE)
		let csvFiles=selectedFiles.filter(item => item.fileType === CSV_FILE_TYPE)
		let updateFiles=csvFiles.filter(item => { // filter csvs for update
			let act=item.action.split(" ")
			if(act[0]==action.UPDATE){
				upFormatted.push({fileToBeUpdated:item.file.fileToUpdate, updateWith:item.file})
				return true
			}
			else false
		})
		let insertFiles=csvFiles.filter(item => item.action === action.CREATE_NEW) // filter csvs for create
		if(isArray(upFormatted)){
			await woqlClient.updateCSV(upFormatted , commitMsg, null, null).then((results) => {
                updateBranches()
				setReport({status: TERMINUS_SUCCESS, message: "Successfully updated files "})
				setPreview({show: false, fileName:false, data:[], selectedCSV: false})
				setCsvs([]);
			})
			.catch((err) => process_error(err, update_start, "Failed to update file"))
			.finally(() => {
				if(!isArray(insertFiles)) setLoading(false)
			})
		}
		if(isArray(insertFiles)){
			let fls=[]
			//insertFiles.map(it=>{fls.push({newFileName:it.newFileName, file:it.file})})
			insertFiles.map(it=>{fls.push(it.file)})
			await woqlClient.insertCSV(fls, commitMsg, null, null).then((results) => {
                updateBranches()
                setReport({status: TERMINUS_SUCCESS, message: "Successfully added files "})
				setPreview({show: false, fileName:false, data:[], selectedCSV: false})
				setCsvs([]);
			})
			.catch((err) => process_error(err, update_start, "Failed to add file"))
			.finally(() => setLoading(false))
		}
		if(isArray(jsonFiles)){ // json files
			updateDocs(jsonFiles)
		}
	}

	const methodThatReturnsAPromise=async(file)=>{
		let json=file.extracted.data
		let WOQL=TerminusClient.WOQL
		let commit = commit || json['@type'] + " " + json['@id'] + " updated from console document page"
		let q = WOQL.update_object(json)
		setLoading(true)
		return await woqlClient.query(q, commit, true)
		.then((res) => {
			updateBranches()
			setReport({status: TERMINUS_SUCCESS, message: "Updated " + json['@id']})
			setPreview({show: false, fileName:false, data:[], selectedCSV: false})
		})
		.catch((e) => {
			setReport({status: TERMINUS_ERROR, error: e, message: "Violations detected in new " + json['@type'] + " " + json['@id']})
		})
		.finally(() => setLoading(false))
	}

	const updateDocs = async(jFiles) => {
		jFiles.reduce( async (previousPromise, nextFile) => {
		    await previousPromise;
			let json=nextFile.extracted.data
			let WOQL=TerminusClient.WOQL
			let commit = commit || json['@type'] + " " + json['@id'] + " updated from console document page"
			let q = WOQL.update_object(json)
			setLoading(true)
		    return woqlClient.query(q, commit, true)
			.then((res) => {
				updateBranches()
				setReport({status: TERMINUS_SUCCESS, message: "Updated " + json['@id']})
				setPreview({show: false, fileName:false, data:[], selectedCSV: false})
				setCsvs([])
			})
			.catch((e) => {
				setReport({status: TERMINUS_ERROR, error: e, message: "Violations detected in new " + json['@type'] + " " + json['@id']})
			})
			.finally(() => setLoading(false))
		}, Promise.resolve());
	}

	const handleFileChosen = async (file) => {
	  return new Promise((resolve, reject) => {
	    let fileReader = new FileReader();
	    fileReader.onload = () => {
	      resolve(fileReader.result);
		  var updateText
		  const content = fileReader.result;
		  if(content==null) return
		  let pj=JSON.parse(content)
		  if(checkIfDocTypeExists(pj, availableDocs)){
			  updateText=action.UPDATE+" "+pj["@id"]
			  file.action=action.UPDATE
		  }
		  else updateText=action.CREATE_NEW
		  let fJson=extractFileInfo(file)
		  fJson.extracted={select: {value: updateText, label: updateText}, data: pj}
		  setSelectedFiles(arr => [...arr, fJson])

	    };
	    fileReader.onerror = reject;
	    fileReader.readAsText(file);
	  });
	}

	const readAllFiles = async (AllFiles) => {
	  const results = await Promise.all(AllFiles.map(async (file) => {
	    const fileContents = await handleFileChosen(file);
	    return fileContents;
	  }));
	  return results;
	}

	const setFileAttributes=(file)=>{
		let fJson=extractFileInfo(file)
		fJson.file=file
		setSelectedFiles(arr => [...arr, fJson])
	}

	useEffect(() => {
		let jsonFiles=[]
		csvs.map(item=>{
			if(item.fileType==CSV_FILE_TYPE){
				setFileAttributes(item)
			}
			else if (item.fileType==JSON_FILE_TYPE){
				jsonFiles.push(item)
			}
		})
		readAllFiles(jsonFiles)
    }, [csvs])


	const List=()=>{
		return (isArray(selectedFiles) && selectedFiles.map( item => <div key={"d_"+item.name+"_"+item.lastModified}>
					<Row style={{width: "100%"}} className={action.CSV_ROWS} key={"Row_"+item.name+"_"+item.lastModified}>
						<FileName item={item.name}/>
						<FileSize item={item.size}/>
						<FileLastModified item={item.lastModified}/>
						<SelectAction item={item} page={page}/>
						<FilePreview item={item}/>
						<FileRemove item={item}/>
					</Row>
					{(page==DOCUMENT_VIEW) && (isArray(availableCsvs)) && availableCsvs.map(acv => <>
						{acv==item.name && <div key={"d_existMsg_"+item.name+"_"+item.lastModified}>
							<div><ManageDuplicateCsv fileName={item.name}/></div>
							{/*<div class="new-csv-inp-id">{item.test && <ShowNewIDInput newIDField={newIDField}/>}</div>*/}
						</div>}
					</>)}
					{(page==DOCUMENT_VIEW) && <span className="selected-csvs-sections" key={"span_"+item.name+item.lastModified}> </span>}
				</div>))
	}

	return(<>
			<HeaderBar/>
			<Row className="generic-message-holder"  key="mr">
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
