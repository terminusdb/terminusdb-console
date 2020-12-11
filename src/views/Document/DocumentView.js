import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {Row, Col, Button} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {JSONEditor} from "./JSONEditor"
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_DOCUMENT_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER, DOCUMENT_OUTGOING_LINK_TITLE,
    SUBMIT_INPUT_LABEL, GO_BACK, DOCUMENT_INCOMING_LINK_TITLE} from "./constants.document"
import {ControlledTable} from '../Tables/ControlledTable'
//import {FrameViewer} from "./FrameViewer"
import { FrameViewer } from '@terminusdb/terminusdb-react-components';
import {constructError} from "../../components/Reports/utils.vio"


import {DocumentViewNav} from "./DocumentViewNav"
import {BiArrowBack, BiSave} from "react-icons/bi"
import {MdCallMissed, MdCallMissedOutgoing} from "react-icons/md"
import { TERMINUS_ERROR, TERMINUS_SUCCESS } from '../../constants/identifiers'
import {ControlledGraph} from "../Tables/ControlledGraph"

export const DocumentView = ({docid, doctype, types, selectDocument, close}) => {
    const [edit, setEdit] = useState(false)
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [currentContext, setCurrentContext] = useState(false)
    const [jsonld, setJsonld] = useState()
    const [content, setContent] = useState()
    const [frame, setFrame] = useState()
    const [docview, setDocView] = useState("table")
    const [docType, setDocType] = useState(doctype)
    const [dataframe, setDataframe] = useState()
    const [loading, setLoading] = useState(true)
    const [sreport, setReport] = useState()
    const [ecommit, setECommit] = useState()
    const [errors, setErrors] = useState()
    const [extract, setExtract] = useState(0)
    const [extractedJSON, setExtractedJSON] = useState()

    const { woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes, updateBranches} = DBContextObj()
    let WOQL = TerminusClient.WOQL

    const docQuery = () => {
        return WOQL.read_object(docid, "v:Object")
    }

    const deleteDocument = (cmsg) => {
        cmsg = (typeof cmsg == "string" && cmsg ? cmsg : "Deleted document " + docid + " with console document manager")
        woqlClient.query(WOQL.delete_object(docid), cmsg).then(() => close())
    }


    useEffect(() => {
        setFrame()
        if(docType){
            getClassFrame()
        }

    }, [docType])

    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    const getClassFrame = () => {
        woqlClient.getClassFrame(docType).then((cf) => setFrame(cf))
    }

    useEffect(() => {
        if(qresult){
            let vb = (qresult && qresult.bindings && qresult.bindings[0] && qresult.bindings[0]['Object'] ? qresult.bindings[0]['Object'] : false)
            setJsonld(vb)
        }
    }, [qresult])

    useEffect(() => {
        if(jsonld){
            setCurrentContext(jsonld['@context'])
            if(jsonld["@type"]) setDocType(jsonld["@type"])
        }
        if(jsonld && !showContext){
            let nc = {}
            for(var k in jsonld){
                if(k != "@context") nc[k] = jsonld[k]
            }
            setContent(JSON.stringify(nc, false, 2))
        }
        else if(jsonld) {
            setContent(JSON.stringify(jsonld, false, 2))
        }
    }, [jsonld])

    useEffect(() => {
        if(frame && jsonld){
            setLoading(false)
            let df = loadFrameViewer()
            setDataframe(df)
        }
    }, [frame, jsonld, edit, docview])

    function loadNewDocument(id){
        setJsonld()
        setContent()
        setFrame()
        setDocType(doctype)
        setDataframe()
        selectDocument(id)

    }

    function loadFrameViewer(){
        let frameconf = TerminusClient.View.document()
        var property_style = "display: block; padding: 0.3em 1em;"
        var box_style = "padding: 8px; border: 1px solid #afafaf; background-color: #efefef;"
        var label_style = "display: inline-block; min-width: 100px; font-weight: 600; color: #446ba0;";
        var value_style = "font-weight: 400; color: #002856;";
        frameconf.show_all(docview == "frame" ? "fancy" : "table");
        frameconf.object().style(box_style);
        frameconf.object().headerFeatures("id").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style, label: "Database ID", removePrefixes: true});
        frameconf.object().headerFeatures("type").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style})
        frameconf.object().features("value").style(property_style);
        frameconf.property().features("label").style(label_style);
        frameconf.property().features("label", "value");
        frameconf.property().property("terminus:id").hidden(true);
        frameconf.data().features("value").style(value_style);
        frameconf.selectDocument = loadNewDocument
        return frameconf
    }

    useEffect(() => {
        updateQuery(docQuery())
    }, [docid])


    function setEditMode() {
        //setReport()
        setEdit(true)
    }

    function unsetEditMode() {
        //setReport()
        setEdit(false)
    }

    function getContents(cnt) {
        //if (report && report.status != TERMINUS_INFO) {
        //    setReport()
        //}
        setUpdatedJSON(cnt)
    }


    function cancel(){
        close()
    }

    const extractDocument = (c) => {
        setExtract(extract + 1)
        setECommit(c)
    }

    function getExtract(a){
        setExtractedJSON(a)
    }

    useEffect(() => {
        if(extract && extractedJSON){
            updateDocument(ecommit, extractedJSON)
        }
    }, [extract, extractedJSON])

    function updateDocument(commit, json){
        commit = commit || "Document " + docid + " updated from console document view"
        let WOQL = TerminusClient.WOQL
        if(docview == "json"){
            json = parseOutput(updatedJSON)
        }
        //else {
            //json = dataframe.extract()
            //console.log("Extracted", json)
        //}
        if(json){
            setLoading(true)
            let q = WOQL.update_object(json)
            woqlClient.query(q, commit, true)
            .then(() => {
                updateQuery(docQuery())
                setContent("")
                updateBranches()
                setReport({status: TERMINUS_SUCCESS, message: "Successfully updated " + docid})
                unsetEditMode()
            })
            .catch((e) => {
                if(e.data) {
                    let ejson=constructError(e)
                    setErrors(ejson)
                }
                setReport({status: TERMINUS_ERROR, error: e, message: "Violations detected in document"})
            })
            .finally(() => setLoading(false))
        }
    }

    function parseOutput(json){
        try {
            let mj = JSON.parse(json)
            if(!showContext){
                mj['@context'] = currentContext
            }
            return mj
        }
        catch(e){
            return false
        }
    }

    function toggleEdit(){
        if(!edit){
            if(docview == "link"){
                setDocView("json")
            }
        }
        setEdit(!edit)
    }


    return <>
        <DocumentViewNav
            edit={edit}
            onDelete={deleteDocument}
            toggleEdit={toggleEdit}
            docView={docview}
            setView={setDocView}
            types={types}
            docid={docid}
            jsonld={jsonld}
            onClose={close}
        />
        <main className="console__page__container console__page__container--width">
            {(sreport && sreport.status && !edit) &&
                <Row className="generic-message-holder">
                    <TerminusDBSpeaks report={sreport} />
                </Row>
            }
            {content && docview == "json" &&
                <JSONEditor
                    dataProvider={content}
                    edit={edit}
                    onChange={getContents}
                    prefixes={prefixes}
                />
            }
            {dataframe && (docview == "frame" || docview == "table") &&
                <FrameViewer 
                    classframe={frame}
                    doc={jsonld}
                    mode={(edit ? "edit" : "view")} 
                    view={dataframe} 
                    type={(docview=="frame" ? "fancy": "table")} 
                    client={woqlClient}
                    onExtract={getExtract}
                    errors={errors}
                    extract={extract} 
                />
            }
            {edit && sreport && sreport.status &&
                <Row className="generic-message-holder">
                    <TerminusDBSpeaks report={sreport} />
                </Row>
            }
            {edit && ((content && docview == "json") || (frame && jsonld && (docview == "frame" || docview == "table"))) &&
                <ViewToolbar
                    editmode={edit}
                    docid={docid}
                    toggle={toggleEdit}
                    types={types}
                    type={doctype}
                    onCancel={cancel}
                    onUpdate={(docview=="json" ? updateDocument : extractDocument)}
                />
            }
            {loading &&
                <Loading />
            }
            {docview == "link" &&
                <DocumentLinks docid={docid} selectDocument={selectDocument} />
            }
        </main>
    </>
}


export const DocumentLinks = ({docid, types, type, onCancel,  selectDocument}) => {
    let WOQL = TerminusClient.WOQL
    let outs = WOQL.triple(docid, "v:Property", "v:Target").triple("v:Target", "type", "v:Type").sub("system:Document", "v:Type")
    let ins = WOQL.triple("v:Source", "v:Property", docid).triple("v:Source", "type", "v:Type").sub("system:Document", "v:Type")


    let linksql = WOQL.and(
        WOQL.eq("v:Node", docid),
        WOQL.opt().limit(1).triple(docid, "label", "v:Node Label"),
        WOQL.or(
            WOQL.and(
                WOQL.triple(docid, "v:Property", "v:Target").triple("v:Target", "type", "v:Type").sub("system:Document", "v:Type"),
                WOQL.opt().limit(1).triple("v:Target", "label", "v:Link Name"),
                WOQL.opt().limit(1).quad("v:Property", "label", "v:Property Name", "schema"),
                WOQL.opt().limit(1).quad("v:Type", "label", "v:Type Name", "schema")
            ),
            WOQL.and(
                WOQL.triple("v:Source", "v:Property", docid).triple("v:Source", "type", "v:Type").sub("system:Document", "v:Type"),
                WOQL.opt().limit(1).triple("v:Source", "label", "v:Link Name"),
                WOQL.opt().limit(1).quad("v:Property", "label", "v:Property Name", "schema"),
                WOQL.opt().limit(1).quad("v:Type", "label", "v:Type Name", "schema")
            )
        )
    )

    const chooseOut = function(row){
        selectDocument(row.original['Target'])
    }
    const chooseIn = function(row){
        selectDocument(row.original['Source'])
    }

    const outtab= TerminusClient.View.table();
    outtab.row().click(chooseOut)
    outtab.pager("remote")
    outtab.pagesize(10)

    const intab = TerminusClient.View.table();
    intab.column_order("Source", "Type", "Property")
    intab.row().click(chooseIn)
    intab.pager("remote")
    intab.pagesize(10)

    const graphConfig= TerminusClient.View.graph();
    graphConfig.show_force(true)
    graphConfig.edges(["Node", "Target"], ["Source", "Node"]);
    graphConfig.edge("Node", "Target").size(2).text("Property Name").arrow({width: 60, height: 30})
         .icon({label: true, color: [109,98,100], size: 0.8})
    graphConfig.edge("Source", "Node").size(2).text("Property Name").arrow({width: 60, height: 30})
         .icon({label: true, color: [109,98,100], size: 0.8})
    graphConfig.node("Node").size(45).collisionRadius(150).text("Node Label").color([150,233,151]).icon({label: true, color: [50,50,80]})
    graphConfig.node("Source", "Target").collisionRadius(120).size(40).text("Link Name").color([255,178,102]).icon({label: true, color: [80,60,40]})
    if(!docid) return null
    return (<>
    <Row>
        <Col>
            <ControlledGraph query={linksql} view={graphConfig} />
        </Col>
    </Row>
    <Row>
        <Col>
            <span style={{fontSize: "2em"}}>
                <span title={DOCUMENT_INCOMING_LINK_TITLE}>
                     <MdCallMissedOutgoing color="#787878"/>
                    <span className="sub-headings d-sub-headings">Incoming Links</span>
                </span>
            </span>
            <ControlledTable query={ins} view={intab} limit={10}/>
        </Col>
        <Col>
            <span style={{fontSize: "2em"}}>
                <span title={DOCUMENT_OUTGOING_LINK_TITLE}>
                    <MdCallMissed color="#787878"/>
                    <span className="sub-headings d-sub-headings">Outgoing Links</span>
                </span>
            </span>
            <ControlledTable query={outs} view={outtab} limit={10}/>
        </Col>
    </Row>
    </>)
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
        buts.push(<Button key="Close" className={TOOLBAR_CSS.editOWLButton} onClick={onCancel}>
                Close
            </Button>)
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
            </Button>
        ]
    }

    let cr = getCreateForPage()
    let but = getSubmitButtons()

    function getEditModeBar() {
        return (
            <div className="nav__main__wrap">
                <Row>
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
                </Row>
            </div>
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
        <div className="nav__main__wrap">
			<div className="tdb__model__header">
                <Col md={2}></Col>
                <Col md={8}>
                    <Row className={TOOLBAR_CSS.container}>
                        <Col md={8} className="schema-toolbar-title">
                            <span className="db-card-credit subheader-spacing">
                                <BsBookHalf className="db_info_icon_spacing"/>
                                <span className="db_info">
                                    <span className="tdb__dblist__info--blue d-icons-text" title={msg}>
                                        <b>Document </b> {msg}
                                    </span>
                                </span>
                            </span>
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
                </Col>
                <Col md={2}></Col>
            </div>
        </div>
    </>)
}
