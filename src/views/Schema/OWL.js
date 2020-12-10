import React, {useState, useEffect} from 'react'
import {OWLEditor} from './OWLEditor'
import Loading from '../../components/Reports/Loading'
import {
    TOOLBAR_CSS,
    EDIT_OWL_BUTTON,
    CANCEL_OWL_BUTTON,
    UPDATE_OWL_BUTTON,
    COMMIT_PLACEHOLDER,
    SUBMIT_INPUT_LABEL,
    CREATE_PREFIX_BUTTON,
    CREATE_GRAPH_BUTTON,
    TAB_SCREEN_CSS
} from './constants.schema'
import {GraphFilter} from './GraphFilter'
import {Row, Col, Button} from 'reactstrap'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SCHEMA_OWL_ROUTE} from '../../constants/routes'
import {DBContextObj} from '../../components/Query/DBContext'
import {
    TERMINUS_ERROR,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
    TERMINUS_SUCCESS,
} from '../../constants/identifiers'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {formatBytes} from "../Server/DBList"

export const OWL = (props) => {
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState()
    const [turtle, setTurtle] = useState(false)
    const {woqlClient} = WOQLClientObj()
    const [loading, setLoading] = useState(true)

    const [updatedTurtle, setUpdatedTurtle] = useState()


    const [report, setReport] = useState()
    const [failure, setFailure] = useState()

    const {graphs, ref, branch, updateBranches, prefixes} = DBContextObj()

    useEffect(() => {
        if (props.graph && graphs) {
            let fid = props.graph.type + '/' + props.graph.id
            if (graphs[fid]) setFilter(props.graph)
            else {
                for (var key in graphs) {
                    if (graphs[key].type == props.graph.type) {
                        setFilter({type: props.graph.type, id: graphs[key].id})
                        return
                    }
                }
                if(Object.keys(graphs).length == 0) setFilter(props.graph)
            }
        }
    }, [props.graph, graphs])

    useEffect(() => {
        if(prefixes) setLoading(false)
    }, [prefixes])

    useEffect(() => {
        if (filter) {
            setLoading(true)
            woqlClient.getTriples(filter.type, filter.id)
            .then((cresults) => {
                setTurtle(cresults)
            })
            .catch((e) => {
                let rep = {status: TERMINUS_ERROR, error: e}
                let f = `Failed to load triples for ${filter.type} graph ${filter.id}`
                setFailure({failure: f, report: rep})
            })
            .finally(() => setLoading(false))
        }
    }, [branch, ref, filter])

    function updateSchema(commit) {
        let ts = Date.now()
        commit = commit || `Updated ${filter.type} graph ${filter.id} from console >> schema >> triples`
        setLoading(true)
        woqlClient.updateTriples(filter.type, filter.id, updatedTurtle, commit)
        .then(() => {
            let msg = `Successfully updated ${filter.type} graph ${filter.id}`
            msg += " " + formatBytes(turtle.length) + " in old graph, " + formatBytes(updatedTurtle.length) + " in new"
            setTurtle(updatedTurtle)
            setEdit(false)
            setReport({
                status: TERMINUS_SUCCESS,
                message:  msg,
                time: Date.now() - ts,
            })
            updateBranches()
        })
        .catch((e) => {
            setReport({
                status: TERMINUS_ERROR,
                message: `Failed to update ${filter.type} graph ${filter.id}`,
                error: e,
                time: Date.now() - ts,
            })
        })
        .finally(() => setLoading(false))
    }

    function setEditMode() {
        setReport()
        setEdit(true)
    }

    function unsetEditMode() {
        setReport()
        setEdit(false)
    }

    function getContents(cnt) {
        if (report && report.status != TERMINUS_INFO) {
            setReport()
        }
        setUpdatedTurtle(cnt)
    }

    function tryUpdateSchema(cmg) {
        setReport()
        updateSchema(cmg)
    }

    return (
        <div className={TAB_SCREEN_CSS}>
            {!failure && (
                <SchemaToolbar
                    report={report}
                    turtle={turtle}
                    editmode={edit}
                    page={SCHEMA_OWL_ROUTE}
                    graph={filter}
                    onChangeGraph={props.onChangeGraph}
                    onAction={setEditMode}
                    onCancel={unsetEditMode}
                    onUpdate={tryUpdateSchema}
                />
            )}
            {loading && <Loading     />}
            {failure && <TerminusDBSpeaks failure={failure.failure} report={failure.report} />}
            {(turtle !== false && !loading && prefixes) &&
                <OWLEditor dataProvider={turtle} edit={edit} onChange={getContents} prefixes={prefixes}/>
            }
        </div>
    )
}



export const SchemaToolbar = ({
    editmode,
    report,
    page,
    turtle,
    graph,
    onChangeGraph,
    onAction,
    onCancel,
    onUpdate,
}) => {
    const {consoleTime} = DBContextObj()
    const {woqlClient} = WOQLClientObj()
    const [commit, setCommit] = useState()

    function updateCommit(e) {
        if (e.target.value != commit) {
            setCommit(e.target.value)
        }
    }

    function getCreateForPage(p) {
        if (!consoleTime) {
            return (
                <Button className={TOOLBAR_CSS.editOWLButton} onClick={onAction}>
                    {EDIT_OWL_BUTTON}
                </Button>
            )
        }
        return null
    }

    function extractInput() {
        return onUpdate(commit)
    }

    function getSubmitButtons(p) {
        return [
            <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={onCancel}>
                {CANCEL_OWL_BUTTON}
            </Button>,
            <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput}>
                {UPDATE_OWL_BUTTON}
            </Button>,
        ]
    }

    let gf = GraphFilter(page, graph, onChangeGraph)



    let cr = getCreateForPage(page)
    let but = getSubmitButtons(page)

    function getEditModeBar(p) {
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

    if (editmode) {
        let bar = getEditModeBar(page)
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

    let mwidth = 12
    if (gf) mwidth = mwidth - 3
    if (cr) mwidth = mwidth - 2

    let msg = "View and update graphs in their raw RDF Triple form"

    if(graph){
        msg = `Viewing ${graph.type} graph ${graph.id} in raw triple form`
        if(turtle !== false){
            if(turtle.length){
                msg += " " + formatBytes(turtle.length) + " in turtle encoding"
            }
            else {
                msg += " - graph is empty"
            }
        }
    }

    return (<>
        <Row className={TOOLBAR_CSS.container}>
            <Col md={mwidth} className="schema-toolbar-title">
                {msg}
            </Col>
            {gf && (
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                    {gf}
                </Col>
            )}
            {cr && (
                <Col md={2} className={TOOLBAR_CSS.createCol}>
                    {cr}
                </Col>
            )}
        </Row>
        {report &&
            <Row className="generic-message-holder" style={{marginBottom: "1.4em"}}>
                 <TerminusDBSpeaks report={report} />
            </Row>
        }
    </>)
}
