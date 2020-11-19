import React, {useState, useEffect} from 'react'
import {BsBook, BsBookHalf} from "react-icons/bs"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {TypeStats} from "./TypeStats"
import {Row, Col, Button} from "reactstrap"
import {FileLoader} from "./FileLoader"
import {getTypeMetadata} from "./DocumentList"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_DOCUMENT_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER, GO_BACK,
    SUBMIT_INPUT_LABEL, DOCUMENT_VIEW_TITLE, TABLE_VIEW_TITLE, LINKS_VIEW_TITLE, JSON_VIEW_TITLE, DELETE_DOCUMENT_BUTTON} from "./constants.document"
import {BiLink, BiFile, BiTable} from "react-icons/bi"
import {VscJson} from "react-icons/vsc"
import {RiDeleteBin5Line} from "react-icons/ri"
import { AiFillCloseCircle, AiFillEdit} from 'react-icons/ai';
import {BiArrowBack} from "react-icons/bi"
import TerminusClient from '@terminusdb/terminusdb-client'


export const DocumentViewNav = ({types, current, docid, doctype, jsonld, edit, onDelete, toggleEdit, onClose, docView, setView}) => {
	return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
				<Col>
					<div className="tdb__model__hright">
						<Row style={{width:"100%"}}>
							<Col md={2}>
                                <DocumentViewIcons setDocView={setView} docView={docView}/>
							</Col>
							<Col md={7}>
                                <DocumentViewTitle types={types} docid={docid} jsonld={jsonld} />
                            </Col>
							<Col md={2}>
                                <DocumentEditIcons edit={edit} onDelete={onDelete} toggleEdit={toggleEdit}/>
                            </Col>
							<Col md={1}>
                                <DocumentGoBackIcon onClose={onClose}/>
                            </Col>
						</Row>
					</div>
				</Col>
			</div>
		</div>
	)
}

export const DocumentViewIcons = ({docView, setDocView, edit}) => {
    const onLink = () => setDocView("link")
    const onFrame = () => setDocView("frame")
    const onTable = () => setDocView("frame")
    const onJson = () => setDocView("json")

    return <span style={{fontSize: "2em"}}>
        <span onClick={onFrame} className="d-nav-icons" title={DOCUMENT_VIEW_TITLE}>
            <BiFile className={"db_info_icon_spacing" + (docView == "frame" ? " document_view_selected" : " document_view_unselected")}/>
        </span>
        <span onClick={onTable} className="d-nav-icons" title={TABLE_VIEW_TITLE}>
            <BiTable className={"db_info_icon_spacing" + (docView == "table" ? " document_view_selected" : " document_view_unselected")}/>
        </span>
        <span onClick={onLink} className="d-nav-icons" title={LINKS_VIEW_TITLE}>
            <BiLink className={"db_info_icon_spacing" + (docView == "link" ? " document_view_selected" : " document_view_unselected")}/>
        </span>
        <span onClick={onJson} className="d-nav-icons" title={JSON_VIEW_TITLE}>
            <VscJson className={"db_info_icon_spacing" + (docView == "json" ? " document_view_selected" : " document_view_unselected")}/>
        </span>
    </span>
}

export const DocumentGoBackIcon = ({onClose}) => {
    return <span style={{fontSize: "2em"}}>
        <span onClick={onClose} className="d-nav-icons" title={GO_BACK}>
            <BiArrowBack className="db_info_icon_spacing"/>
        </span>
    </span>
}

export const DocumentEditIcons = ({onDelete, toggleEdit, edit}) => {
    return <span style={{fontSize: "2em"}}>
        <span onClick={toggleEdit} className="d-nav-icons" title={EDIT_DOCUMENT_BUTTON}>
            <AiFillEdit className="db_info_icon_spacing"/>
        </span>
        <span onClick={onDelete} className="d-nav-icons" title={DELETE_DOCUMENT_BUTTON}>
            <RiDeleteBin5Line color="#721c24" className='db_info_icon_spacing'/>
        </span>
    </span>
}


export const DocumentViewTitle = ({types, docid, jsonld}) => {
    if(jsonld && types){
        let ty = jsonld["@type"]
        let nm = (jsonld["rdfs:label"] && jsonld["rdfs:label"]["@value"] ? jsonld["rdfs:label"]["@value"] : TerminusClient.UTILS.shorten(docid))
        let meta = getTypeMetadata(types, TerminusClient.UTILS.unshorten(ty))
        let tyname = ((meta && meta.label) ? meta.label : TerminusClient.UTILS.shorten(ty))
        let title = `${ty} Document ${docid}`
        return <h3 className="db_info d-nav-text" title={title}>
            <span> {nm} </span> ~ <span> {tyname} </span>
        </h3>
    }
    return <h3 className="db_info">Document {TerminusClient.UTILS.shorten(docid)}</h3>
}


export const ViewToolbar = ({editmode, report, toggle, docid, types, type, onCancel,  onUpdate}) => {
    const {consoleTime} = DBContextObj()
    const [commit, setCommit] = useState()
    let msg = type + " " + docid
    function updateCommit(e) {
        if (e.target.value != commit) {
            setCommit(e.target.value)
        }
    }

    function getCreateForPage(p) {
        let buts = []
        if (!consoleTime) {
            buts.push(<Button key="json" className={TOOLBAR_CSS.editOWLButton} onClick={toggle}>
                    {EDIT_DOCUMENT_BUTTON}
                </Button>)
        }
        return null
    }

    function extractInput() {
        return onUpdate(commit)
    }

    function getSubmitButtons() {
        return [
            <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={toggle}>
                {CANCEL_EDIT_BUTTON}
            </Button>,
            <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput}>
                {UPDATE_JSON_BUTTON}
            </Button>,
        ]
    }

    let cr = getCreateForPage()
    let but = getSubmitButtons()

    function getEditModeBar() {
        return (
            <Row className={TOOLBAR_CSS.updateContainer}>
                <Col md={7} className={TOOLBAR_CSS.commitMsgCol}>
                    <input
                        className={TOOLBAR_CSS.commitInput}
                        onChange={updateCommit}
                        placeholder={COMMIT_PLACEHOLDER}
                    />
                </Col>
                <Col md={5} className={TOOLBAR_CSS.submitButtonsCol}>
                    {but}
                </Col>
            </Row>
        )
    }

    if (editmode) {
        let bar = getEditModeBar()
        if (report) {
            return (
                <>
                    {bar}
                    <Row className={TOOLBAR_CSS.updateReportContainer}>
                        <span className={TOOLBAR_CSS.messageContainer}>
                            <TerminusDBSpeaks report={report} />
                        </span>
                    </Row>
                </>
            )
        }
        return bar
    }

    return (<>
        <Row className={TOOLBAR_CSS.container}>
            <Col md={8} className="schema-toolbar-title">
                {msg}
            </Col>
            <Col md={4} className={TOOLBAR_CSS.createCol}>
                {cr}
            </Col>
        </Row>
        {report &&
            <Row className="generic-message-holder" style={{marginBottom: "1.4em"}}>
                 <TerminusDBSpeaks report={report} />
            </Row>
        }
    </>)
}
