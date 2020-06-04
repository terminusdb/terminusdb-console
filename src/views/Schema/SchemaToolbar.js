import React, {useState} from 'react';
import { TOOLBAR_CSS, EDIT_OWL_BUTTON, CANCEL_OWL_BUTTON, UPDATE_OWL_BUTTON, COMMIT_PLACEHOLDER, SUBMIT_INPUT_LABEL, CREATE_GRAPH_BUTTON } from "./constants.schema"
import { GraphFilter } from "./GraphFilter"
import { Row, Col, Button } from "reactstrap"
import { SCHEMA_OWL_ROUTE, SCHEMA_GRAPHS_ROUTE } from '../../constants/routes';
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks';
import { DBContextObj } from "../../components/Query/DBContext"
import { WOQLClientObj } from "../../init/woql-client-instance";

export const SchemaToolbar = ({editmode, report, page, graph, onChangeGraph, onAction, onCancel, onUpdate}) => {

    const { consoleTime } = DBContextObj()

    const {woqlClient} = WOQLClientObj()

    const [commit, setCommit] = useState()

    function updateCommit(e){
        if(e.target.value != commit){
            setCommit(e.target.value)
        }
    }

    function getCreateForPage(p){
        if(p == SCHEMA_OWL_ROUTE && !consoleTime){
            return (
                <Button className={TOOLBAR_CSS.editOWLButton} onClick={onAction} >
                    {EDIT_OWL_BUTTON}
                </Button>
            )
        }
        else if(p == SCHEMA_GRAPHS_ROUTE && !consoleTime && woqlClient.db() != "terminus"){
            return (
                <Button className={TOOLBAR_CSS.createGraphButton} onClick={onAction} >
                    {CREATE_GRAPH_BUTTON}
                </Button>
            )
        }
        return null
    }

    function extractInput(){
        return onUpdate(commit)
    }

    function getSubmitButtons(p){
        if(p == SCHEMA_OWL_ROUTE){
            return [
                <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={onCancel} >
                    {CANCEL_OWL_BUTTON}
                </Button>,
                <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput} >
                    {UPDATE_OWL_BUTTON}
                </Button>
            ]
        }
        return null
    }



    let gf = GraphFilter(page, graph, onChangeGraph)
    let cr = getCreateForPage(page)
    let but = getSubmitButtons(page)


    function getEditModeBar(p){
        if(p == SCHEMA_GRAPHS_ROUTE){
            return (
                <Row className={TOOLBAR_CSS.container} >
                    <Col md={12} className={TOOLBAR_CSS.messageCol}>
                        {report &&
                            <span className={TOOLBAR_CSS.messageContainer} >
                                <TerminusDBSpeaks report={report} />
                            </span>
                        }
                    </Col>
                </Row>
            )
        }
        let mwidth = (but ? 8 : 11)
        return (
            <Row className={TOOLBAR_CSS.updateContainer} >
                <Col md={1} className={TOOLBAR_CSS.commitLabelCol}>
                    {SUBMIT_INPUT_LABEL}
                </Col>
                <Col md={mwidth} className={TOOLBAR_CSS.commitMsgCol}>
                    <input className={TOOLBAR_CSS.commitInput} onChange={updateCommit} placeholder={COMMIT_PLACEHOLDER} />
                </Col>
                {but &&
                    <Col md={3} className={TOOLBAR_CSS.submitButtonsCol}>
                        {but}
                    </Col>
                }
            </Row>
        )
    }

    if(editmode){
        let bar = getEditModeBar(page)
        if(page != SCHEMA_GRAPHS_ROUTE && report){
            return (<>
                {bar}
                <Row className={TOOLBAR_CSS.updateReportContainer} >
                    <span className={TOOLBAR_CSS.messageContainer} >
                        <TerminusDBSpeaks report={report} />
                    </span>
                </Row>
            </>)
        }
        return bar
    }

    let mwidth = 12
    if(gf) mwidth = mwidth-3
    if(cr) mwidth = mwidth-2
    
    return (
        <Row className={TOOLBAR_CSS.container} >
            <Col md={mwidth} className={TOOLBAR_CSS.messageCol}>
                {report &&
                    <span className={TOOLBAR_CSS.messageContainer} >
                        <TerminusDBSpeaks report={report} />
                    </span>
                }
            </Col>
            {cr &&
                <Col md={2} className={TOOLBAR_CSS.createCol}>
                    {cr}
                </Col>
            }
            {gf &&
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                    {gf}
                </Col>
            }
        </Row>
    )
}
