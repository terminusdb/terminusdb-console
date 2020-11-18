import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {Row, Col, Button} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {JSONEditor} from "./JSONEditor"
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_JSON_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER,
    SUBMIT_INPUT_LABEL} from "./constants.document"
import {ControlledTable} from '../Tables/ControlledTable'
import {FrameViewer} from "./FrameViewer"
import {DocumentViewNav} from "./DocumentViewNav"

export const DocumentView = ({docid, doctype, types, selectDocument, close}) => {
    const [edit, setEdit] = useState(false)
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [currentContext, setCurrentContext] = useState(false)
    const [jsonld, setJsonld] = useState()
    const [content, setContent] = useState()
    const [frame, setFrame] = useState()
    const [docview, setDocView] = useState("frame")
    const [docType, setDocType] = useState(doctype)
    const { woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()
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

    function updateDocument(commit){
        commit = commit || "Document " + docid + " updated from console document view"
        let WOQL = TerminusClient.WOQL
        let json = parseOutput(updatedJSON)
        if(json){
            let q = WOQL.update_object(json)
            woqlClient.query(q, commit)
            .then(() => {
                updateQuery(docQuery())
                setContent("")
                setJsonld()
                unsetEditMode()
            })
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
            setDocView("json")
        }
        setEdit(!edit)
    }

    let frameconf = TerminusClient.View.document()
    var property_style = "display: block; padding: 0.3em 1em;"
	var box_style = "padding: 8px; border: 1px solid #afafaf; background-color: #efefef;"
	var label_style = "display: inline-block; min-width: 100px; font-weight: 600; color: #446ba0;";
	var value_style = "font-weight: 400; color: #002856;";
	frameconf.show_all("SimpleFrameViewer");
	frameconf.object().style(box_style);
	frameconf.object().headerFeatures("id").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style, label: "Database ID", removePrefixes: true});
	frameconf.object().headerFeatures("type").style(property_style).args({headerStyle: label_style + " padding-right: 10px;", bodyStyle: value_style})
	frameconf.object().features("value").style(property_style);
	frameconf.property().features("label").style(label_style);
	frameconf.property().features("label", "value");
	frameconf.property().property("terminus:id").hidden(true);
	frameconf.data().features("value").style(value_style);

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
            {content && docview == "json" &&
                <JSONEditor
                    dataProvider={content}
                    edit={edit}
                    onChange={getContents}
                    prefixes={prefixes}
                />
            }
            {content && edit && docview == "json" &&
                <ViewToolbar
                    editmode={edit}
                    docid={docid}
                    toggle={toggleEdit}
                    types={types}
                    type={doctype}
                    onCancel={cancel}
                    onUpdate={updateDocument}
                />
            }
            {content && frame && docview == "frame" && 
                <FrameViewer
                    doc={jsonld}
                    view={frameconf}
                    classframe={frame}
                    edit={edit}
                />
            }
            {!edit && docview == "link" &&
                <DocumentLinks docid={docid} selectDocument={selectDocument} />
            }
        </main>
    </>
}


export const DocumentLinks = ({docid, types, type, onCancel,  selectDocument}) => {
    let WOQL = TerminusClient.WOQL
    let outs = WOQL.triple(docid, "v:Property", "v:Target").triple("v:Target", "type", "v:Type").sub("system:Document", "v:Type")
    let ins = WOQL.triple("v:Source", "v:Property", docid).triple("v:Source", "type", "v:Type").sub("system:Document", "v:Type")
    const chooseOut = function(cell){
        selectDocument(cell.row.original['Target'])
    }
    const chooseIn = function(cell){
        selectDocument(cell.row.original['Source'])
    }

    const outtab= TerminusClient.View.table();
    outtab.column("Target").click(chooseOut)
    const intab = TerminusClient.View.table();
    intab.column_order("Source", "Type", "Property")
    intab.column("Source").click(chooseIn)
    return (<Row>
        <Col>
            <div className="sub-headings latest-update-heading">Incoming Links</div>
            <ControlledTable query={ins} view={intab} limit={20}/>
        </Col>
        <Col>
            <div className="sub-headings latest-update-heading">Outgoing Links</div>
            <ControlledTable query={outs} view={outtab} limit={20}/>
        </Col>
    </Row>)
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
                    {EDIT_JSON_BUTTON}
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


