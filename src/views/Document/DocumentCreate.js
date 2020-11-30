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
import { FrameViewer } from '@terminusdb/terminusdb-react-components';
import { TERMINUS_ERROR, TERMINUS_FAILURE, TERMINUS_SUCCESS } from '../../constants/identifiers'


export const DocumentCreate = ({doctype, close, prefixes, types, selectDocument}) => {
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [docView, setDocView] = useState("table")
    const [frame, setFrame] = useState()
    const [dataframe, setDataframe] = useState()
    const [content, setContent] = useState(getStarterContent(doctype))
    const [loading, setLoading] = useState(true)
    const [sreport, setReport] = useState(true)
    const { woqlClient} = WOQLClientObj()

    const {updateBranches} = DBContextObj()


    useEffect(() => {
        setFrame()
        if(doctype){
            getClassFrame()
        }

    }, [doctype])

    useEffect(() => {
        if(frame){
            setLoading(false)
            let df = loadFrameViewer(frame)
            setDataframe(df)
        }
    }, [frame])


    const getClassFrame = () => {
        woqlClient.getClassFrame(doctype).then((cf) => setFrame(cf))
    }


    function getStarterContent(dt){
        let st = {
            "@type": dt,
            "@id": "",
            "rdfs:label": {"@value": "Document Name", "@type": "xsd:string"}
        }
        return JSON.stringify(st, false, 2)
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
        let json
        if(docView == "json") json = parseOutput(updatedJSON)
        else if(dataframe) {
            json = dataframe.extract()
            console.log("extracted", json)
        }
        if(json){
            commit = commit || json['@type'] + " " + json['@id'] + " created from console document page"
            let q = WOQL.update_object(json)
            setLoading(true)
            woqlClient.query(q, commit)
            .then(() => {
                updateBranches()
                setReport({status: TERMINUS_SUCCESS, message: "Created new " + json['@type'] + " " + json['@id']})
                if(selectDocument){
                    close()
                    selectDocument(json['@id'], json['@type'])
                }
            })
            .catch((e) => {
                setReport({status: TERMINUS_ERROR, error: e, message: "Violations detected in new " + json['@type'] + " " + json['@id']})                
            })
            .finally(() => setLoading(false))
        }
    }

    function loadFrameViewer(frame){
        let frameconf = TerminusClient.View.document()
        var property_style = "display: block; padding: 0.3em 1em;"
        var box_style = "padding: 8px; border: 1px solid #afafaf; background-color: #efefef;"
        var label_style = "display: inline-block; min-width: 100px; font-weight: 600; color: #446ba0;";
        var value_style = "font-weight: 400; color: #002856;";
        frameconf.show_all("table");
        frameconf.show_id = true
        frameconf.object().style(box_style);
        frameconf.object().headerFeatures("id").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style, label: "Database ID", removePrefixes: true});
        frameconf.object().headerFeatures("type").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style})
        frameconf.object().features("value").style(property_style);
        frameconf.property().features("label").style(label_style);
        frameconf.property().features("label", "value");
        frameconf.property().property("terminus:id").hidden(true);
        frameconf.data().features("value").style(value_style);
        let fv = new FrameViewer(frame, false, frameconf, true, woqlClient)
        return fv
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
            {dataframe && docView == "table" &&
                <>{dataframe.render()}</>
            }
            {loading && 
                <Loading />
            }
            {content && (docView == "json") && 
                <JSONEditor
                    dataProvider={content}
                    edit={true}
                    onChange={getContents}
                    prefixes={prefixes}
                />
            }
            {(sreport && sreport.status) &&
                <Row className="generic-message-holder">
                    <TerminusDBSpeaks report={sreport} />
                </Row>
            }
            {(docView == "json" || (frame && (docView=="table"))) &&             
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
