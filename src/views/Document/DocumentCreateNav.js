import React, {useState, useEffect} from 'react'
import {BsBook, BsBookHalf} from "react-icons/bs"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {TypeStats} from "./TypeStats"
import {Row, Col, Button} from "react-bootstrap" //replaced
import {FileLoader} from "./FileLoader"
import {getTypeMetadata} from "./DocumentList"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_DOCUMENT_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER, GO_BACK,
    SUBMIT_INPUT_LABEL, DOCUMENT_VIEW_TITLE, TABLE_VIEW_TITLE, LINKS_VIEW_TITLE, JSON_VIEW_TITLE} from "./constants.document"
import {BiLink, BiFile, BiTable} from "react-icons/bi"
import {VscJson} from "react-icons/vsc"
import {RiDeleteBin5Line} from "react-icons/ri"
import { AiFillCloseCircle, AiFillEdit} from 'react-icons/ai';
import {BiArrowBack, BiBorderNone} from "react-icons/bi"
import TerminusClient from '@terminusdb/terminusdb-client'


export const DocumentCreateNav = ({types, doctype, meta, onClose, docView, setView}) => {
	return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
				<Col>
					<div className="tdb__model__hright">
						<Row style={{width:"100%"}}>
							{<Col md={2}>
                                <DocumentViewIcons setDocView={setView} docView={docView}/>
							</Col>}
							<Col md={9}>
                                <DocumentViewTitle types={types} doctype={doctype} meta={meta}/>
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

export const DocumentGoBackIcon = ({onClose}) => {
    return <span onClick={onClose} style={{fontSize: "2em"}}>
        <span className="d-nav-icons" title={GO_BACK}>
            <BiArrowBack className="db_info_icon_spacing"/>
        </span>
    </span>
}

export const DocumentViewIcons = ({docView, setDocView, edit}) => {
    let show_fancy = false
    const onFrame = () => setDocView("frame")
    const onTable = () => setDocView("table")
    const onJson = () => setDocView("json")
    return <span style={{fontSize: "2em"}}>
        {show_fancy && 
            <span onClick={onFrame} className="d-nav-icons" title={DOCUMENT_VIEW_TITLE}>
                <BiFile className={"db_info_icon_spacing" + (docView == "frame" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
            </span>
        }
        <span onClick={onTable} className="d-nav-icons" title={TABLE_VIEW_TITLE}>
            <BiTable className={"db_info_icon_spacing" + (docView == "table" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
        </span>
        <span onClick={onJson} className="d-nav-icons" title={JSON_VIEW_TITLE}>
            <VscJson className={"db_info_icon_spacing" + (docView == "json" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
        </span>
    </span>
}



export const DocumentViewTitle = ({types, doctype, meta}) => {
    if(types && doctype){
        meta = meta || getTypeMetadata(types, TerminusClient.UTILS.unshorten(doctype))
        let tyname = ((meta && meta.label) ? meta.label : TerminusClient.UTILS.shorten(doctype))
        let title = `${TerminusClient.UTILS.shorten(doctype)}`
        function isDoc(a){
            return TerminusClient.UTILS.unshorten(a) == TerminusClient.UTILS.unshorten("system:Document") 
        }
        return <h3 className="db_info db_info d-nav-text" title={title}>
            {isDoc(meta.id) && 
                <span> Choose Document Type to Create </span>
            }
            {!isDoc(meta.id) && 
                <span> Create New {tyname} </span>
            }
            {meta.abstract && (!isDoc(meta.id)) && 
             <span>
                <span className="d-nav-icons">
                    <BiBorderNone />
                </span>
               Abstract Type - Choose Sub-Type to Create</span>
            }
        </h3>
    }
    let p = (doctype ? TerminusClient.UTILS.shorten(doctype) : "")
    return <h3 className="db_info db_info d-nav-text">Create New {p}</h3>
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
