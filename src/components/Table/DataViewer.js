import React, {useState} from 'react'
import {Row, Col } from "react-bootstrap" //replaced
import Select from "react-select";
import {AiFillEdit, AiOutlineUser, AiOutlineBlock, AiOutlineFolderView, AiOutlineSave,
	AiOutlineFileAdd} from 'react-icons/ai'

const LastUpdated = (props) => {
	const lastUpdated = props.lastUpdated || false

	return (
		<span className='hub-inputbar extracted-file-info'>
            <AiFillEdit className="hub-bar-spacing" color="#0055bb"/> <strong>Last Updated</strong> {lastUpdated}
        </span>
	)
}

const Created = (props) => {
	const created = props.created || false
	return (
		<span className='hub-inputbar extracted-file-info'>
            <AiOutlineUser className="hub-bar-spacing" color="#0055bb"/> <strong>Created</strong> {created}
        </span>
	)
}

const Size = (props) => {
	const size = props.size || false
	return (
		<span className='hub-inputbar extracted-file-info'>
            <AiOutlineBlock className="hub-bar-spacing" color="#0055bb"/> <strong>Size</strong> {size}
        </span>
	)
}

const ViewInfo = (props) => {
	return (
		<span className='hub-inputbar extracted-file-info'>
            <AiOutlineFolderView className="hub-bar-spacing" color="#0055bb"/> Displaying <strong> 5 Columns </strong> and <strong> 540 Rows</strong>
        </span>
	)
}

const RemoveFile = () => {
	return (
		<span className='hub-inputbar extracted-file-info delete-file'>
            Delete this file
        </span>
	)
}

const FileInfo = (props) => {
	const info = props.info || {lastUpdated: '20 mins ago', created: 'Kitty Jose', size: '2045 kb' }

	return (
        <>
            <Row>
                <LastUpdated lastUpdated={info.lastUpdated}/>
            </Row>
			<Row>
                <Created created={info.created}/>
            </Row>
			<Row>
                <Size size={info.size}/>
            </Row>
			<Row>
                <ViewInfo/>
            </Row>
			<Row>
                <RemoveFile/>
            </Row>
        </>
    )
}

const HeaderInfo = (props) => {
	const headers = props.headers || ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5']
	const header=[], editHeader=[];
	const [edit, setEdit]=useState(false);

	const handleEdit = () => {
		setEdit(true)
	}

	const handleSave = () => {
		setEdit(false)
	}

	const handleCancel = () => {
		setEdit(false)
	}

	headers.map((item) => {
		header.push(<Row key={item} className="header-row">
			<Col md={7}>
				{item}
			</Col>
			<Col md={5}>
				<strong>Type:</strong> String
			</Col>
		</Row>)
	})
    const options = [{value: 'integer', label: 'integer'},
		{value: 'float', label: 'float'},
		{value: 'decimal', label: 'decimal'},
		{value: 'dateTime', label: 'dateTime'},
		{value: 'string', label: 'string'},]

	headers.map((item) => {
		editHeader.push(<Row key={item} className="header-row">
			<Col md={6}>
				<input value={item} className="file-header-values"/>
			</Col>
			<Col md={6}>
				<span style={{display: "flex"}}>
					<strong>Type:</strong>
					<Select
			            placeholder = "String"
			            className = "tcf-select"
			            options = {options}
			            defaultValue= "String"
			        />
				</span>
			</Col>
		</Row>)
	})

	return (<Row className="hub-toolbar">
		{!edit && <>
			<span title="Edit header value" className="header-edit-icon header-controls" onClick={handleEdit}>
				Edit
			</span>
			{header}
		</>}
		{edit && <>
			<span title="Save header value" className="header-control-panel">
				<span className="header-controls header-edit-icon" onClick={handleSave}>Save</span>
				<span className="header-controls header-edit-icon" onClick={handleCancel}>Cancel</span>
			</span>
			{editHeader}
		</>}
	</Row>)
}

export const DataViewer = (props) => {
	const file = props.file || false

	return (<><Row className="extacted-file">
		<Col md={8} className="data-snippet">
			<Row key="rr" className="">
				<span className='database-listing-header-row'>
					<AiOutlineFileAdd style={{fontSize: '20px'}} color="#0055bb"/>
					<span key='a' className="database-header-title remote-info-label">Snippet of {file}</span>
				</span>
			</Row>
		</Col>
		<Col md={4}>
			<Row key="rr" className="file-info-containers">
				<div className="remote-info-align database-create-header">
					<span className='database-listing-header-row'>
						<span key='a' className="database-header-title remote-info-label">About file - {file}</span>
					</span>
				</div>
				<div className="database-remote-info-row">
					<FileInfo info={props.info}/>
				</div>
			</Row>
			<Row key="rf" className="file-info-containers clone-widget-title">
				<div className="remote-info-align database-create-header">
					<span className='database-listing-header-row'>
						<span key='a' className="database-header-title remote-info-label">Extracted Table Headers</span>
					</span>
				</div>
				<div className="database-remote-info-row">
					<HeaderInfo/>
				</div>
			</Row>
		</Col>
	</Row>
	</>)
}
