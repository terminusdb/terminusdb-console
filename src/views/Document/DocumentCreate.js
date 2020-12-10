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
import {getTypeMetadata} from "./DocumentList"
import {DOCTYPE_CSV} from '../../components/CSVPane/constants.csv'

export const DocumentCreate = ({doctype, close, prefixes, types, selectDocument, setDocType}) => {
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [docView, setDocView] = useState("table")
    const [frame, setFrame] = useState()
    const [dataframe, setDataframe] = useState()
    const [content, setContent] = useState(getStarterContent(doctype))
    const [loading, setLoading] = useState(true)
    const [sreport, setReport] = useState(true)
    const { woqlClient} = WOQLClientObj()

    const {updateBranches, branch, ref} = DBContextObj()

    function xclose(){
        console.log("frame", dataframe.frame.document)
    }

    useEffect(() => {
        setFrame()
        if(doctype && doctype != TerminusClient.UTILS.unshorten("system:Document")){
            getClassFrame()
        }

    }, [doctype])

    useEffect(() => {
        if(frame){
            setLoading(false)
            let df = loadFrameViewer(frame)
            setDataframe(df)
        }
    }, [frame, docView, branch, ref])


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
        console.log("f", dataframe.frame.document.properties)
        alert("1")
        let WOQL = TerminusClient.WOQL
        let json
        if(docView == "json") json = parseOutput(updatedJSON)
        else if(dataframe) {
            json = dataframe.extract()
            console.log("f2", dataframe.frame.document.properties)
            alert("2")
        }
        if(json){
            commit = commit || json['@type'] + " " + json['@id'] + " created from console document page"
            let q = WOQL.update_object(json)
            console.log("f3", dataframe.frame.document.properties)
            alert("3")
            
            setLoading(true)
            woqlClient.query(q, commit, true)
            .then(() => {
                updateBranches()
                setReport({status: TERMINUS_SUCCESS, message: "Created new " + json['@type'] + " " + json['@id']})
                if(selectDocument){
                    close()
                    selectDocument(json['@id'], json['@type'])
                }
            })
            .catch((e) => {
                if(e.data && e.data['api:message'] && dataframe){
                    let ps = dataframe
                    ps.setFrameErrors(e.data)
                    setDataframe(ps)
                }
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
        frameconf.show_all(docView == "frame" ? "fancy" : "table");
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


    function smdt(dt){
        setDocType(dt)
    }

    let meta = ((TerminusClient.UTILS.unshorten(doctype) == TerminusClient.UTILS.unshorten("system:Document")) 
        ? {abstract: true, label: "Document", id: "system:Document", description: "A document type"} 
        : getTypeMetadata(types, TerminusClient.UTILS.unshorten(doctype)) || {})

    return <>
        <DocumentCreateNav 
            docView={docView}
            setView={setDocView}
            types={types}
            meta={meta}
            doctype={doctype}
            onClose={close}
        />
        <main className="console__page__container console__page__container--width">
            {meta.abstract && 
                <DocumentChoices types={types} meta={meta} doctype={doctype} setType={smdt} />
            }
            {(!meta.abstract) && dataframe && (docView == "table" || docView == "frame") &&
                <>{dataframe.render()}</>
            }
            {(!meta.abstract) && loading && 
                <Loading />
            }
            {(!meta.abstract) && content && (docView == "json") && 
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
            {(!meta.abstract) && (docView == "json" || (frame && (docView=="table" || docView == "frame"))) &&             
                <CreateToolbar
                    types={types}
                    type={doctype}
                    onCancel={xclose}
                    onCreate={createDocument}
                />
            }
        </main>
    </>
}

export const DocumentChoices = ({types, doctype, meta, setType}) => {
    if(!doctype) return null
    const [stypes, setSubTypes] = useState()
    let WOQL = TerminusClient.WOQL
    const {woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()
    const docQuery = () => {
        return WOQL.and(
            WOQL.lib().classes(),
            WOQL.sub(doctype, "v:Class ID")
        )
    }
    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    useEffect( () => {
        if(doctype){
            setSubTypes()
            updateQuery(docQuery())
        }
    }, [doctype])

    useEffect(() => {
        if(qresult){
            setSubTypes(qresult.bindings)
        }
    }, [qresult])

    function typeOptions(){
        let to = []
        for(var i = 0; i<types.length; i++){
            if(types[i]['Class ID'] != doctype){
                let lab = (types[i]['Class Name'] && types[i]['Class Name']['@value'] ? types[i]['Class Name']['@value'] : types[i]['Class ID'])
                to.push({label: lab, value: types[i]['Class ID']})
            }
        }
        return to
    }

    function changeFilter(sid){
        return function() {
            if(setType) setType(sid)
        }
    }

    function getTypeSelector(){
        let ts = []
        for(var i = 0; i<stypes.length; i++){
            let sid = stypes[i]['Class ID']
            if(sid != DOCTYPE_CSV){
                ts.push(<span style={{cursor: "pointer"}} onClick={changeFilter(sid)}>
                    <DocumentChoice type={sid} types={types}/>
                </span>)        
            }
        }
        return ts
    }
    let choices_style = { margin: "10px auto", width: "90%"}
    if(stypes && stypes.length > 0){
        return <span style={choices_style}>{getTypeSelector()}</span>
    }
    return null
}

export const DocumentChoice = ({types, type}) => {
    let meta = getTypeMetadata(types, TerminusClient.UTILS.unshorten(type))
    if(!meta) return null
    let pane_style = {
        display: "inline-block",
        width: "200px",
        padding: "10px",
        height: "200px",
        borderRadius: "8px",
        verticalAlign: "top",
    }
    let hdr_style = {
        display: "inline-block",
        textAlign: "center",
        fontSize: "1.2m",    
        width: "180px"
    }
    let body_style = {
        display: "inline-block",
        height: "120px",
        overflow: "hidden",
        color: "#444",
        fontSize: "0.9em"
    }
    if(meta.abstract){
        hdr_style.color = "rgba(255, 178, 102, 0.7)"
    }
    let icons = (meta.abstract ? { color: "rgb(255, 178, 102)"} : {color: "rgba(255, 178, 102, 0.7)"})
    icons.display = "inline-block"
    icons.textAlign = "center"
    icons.width = "180px"
    icons.fontSize = "2.5em"
    let desc = meta.description || "~"
    return <span className="create-document-widget" style={pane_style}><i style={icons} className="custom-img-entities"></i>
    <strong style={hdr_style}>{meta.label} </strong> <span style={body_style}>{desc}</span></span>
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
