import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {Row, Col, Button} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {JSONEditor} from "./JSONEditor"
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_DOCUMENT_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER,
    SUBMIT_INPUT_LABEL} from "./constants.document"
import {ControlledTable} from '../Tables/ControlledTable'
import {DocumentCreateNav} from "./DocumentCreateNav"

export const DocumentCreate = ({doctype, close, prefixes, types, selectDocument}) => {
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [docView, setDocView] = useState("json")
    const [content, setContent] = useState(getStarterContent(doctype))
    const { woqlClient} = WOQLClientObj()

    function getStarterContent(dt){
        return JSON.stringify({
            "@type": dt,
            "@id": "doc:NEW_ID",
            "rdfs:label": {"@value": "Document Name", "@type": "xsd:string"}
        }, false, 2)
    }

    function getContents(cnt) {
        setUpdatedJSON(cnt)
    }

    function parseOutput(json){
        try {
            let mj = JSON.parse(json)
            if(!mj['@context']) mj['@context'] = prefixes
            return mj
        }
        catch(e){
            return false
        }
    }

    function createDocument(commit){
        let WOQL = TerminusClient.WOQL
        let json = parseOutput(updatedJSON)
        if(json){
            commit = commit || "New " + json['@type'] + " " + json['@id'] + " created from console document page"
            let q = WOQL.update_object(json)
            woqlClient.query(q, commit)
            .then(() => {
                if(selectDocument){
                    close()
                    selectDocument(json['@id'], json['@type'])
                }
            })
        }
    }

    return <>
        <DocumentCreateNav 
            docView={docView}
            setView={setDocView}
            types={types}
            doctype={doctype}
            onClose={close}
        />

        <main className="console__page__container console__page__container--width">
            {content &&
                <JSONEditor
                    dataProvider={content}
                    edit={true}
                    onChange={getContents}
                    prefixes={prefixes}
                />
            }
            {content &&            
                <CreateToolbar
                    types={types}
                    type={doctype}
                    onCancel={close}
                    onCreate={createDocument}
                />
            }
        </main>
    </>
}

export const CreateToolbar = ({types, type, onCancel, onCreate, report}) => {
    const [commit, setCommit] = useState()
    let msg = "Create New " + type + " Document"

    function updateCommit(e) {
        if (e.target.value != commit) {
            setCommit(e.target.value)
        }
    }

    function extractInput() {
        return onCreate(commit)
    }

    function getSubmitButtons() {
        return [
            <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={onCancel}>
                {CANCEL_EDIT_BUTTON}
            </Button>,
            <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput}>
                {UPDATE_JSON_BUTTON}
            </Button>,
        ]
    }

    let but = getSubmitButtons()

    function getEditModeBar() {
        return (
            <Row className={TOOLBAR_CSS.updateContainer}>
                <Col md={1} className={TOOLBAR_CSS.commitLabelCol}>
                    {SUBMIT_INPUT_LABEL}
                </Col>
                <Col md={8} className={TOOLBAR_CSS.commitMsgCol}>
                    <input
                        className={TOOLBAR_CSS.commitInput}
                        onChange={updateCommit}
                        placeholder={COMMIT_PLACEHOLDER}
                    />
                </Col>
                <Col md={3} className={TOOLBAR_CSS.submitButtonsCol}>
                    {but}
                </Col>
            </Row>
        )
    }

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
