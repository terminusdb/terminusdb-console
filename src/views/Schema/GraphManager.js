import React, {useState, useEffect} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import Loading from '../../components/Reports/Loading'
import {CreateGraph} from './CreateGraph'
import {
    CREATE_GRAPH_FORM,
    TAB_SCREEN_CSS,
    GRAPHS_INFO_MSG,
    GRAPHS_CREATE_INFO,
} from './constants.schema'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {GraphList} from '../Tables/GraphList'
import {DBContextObj} from '../../components/Query/DBContext'
import {SCHEMA_GRAPHS_ROUTE} from '../../constants/routes'
import {SchemaToolbar} from './SchemaToolbar'

export const GraphManager = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {graphs} = DBContextObj()
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    let initMsg = GRAPHS_INFO_MSG ? {status: TERMINUS_INFO, message: GRAPHS_INFO_MSG} : null
    let initCreate = GRAPHS_CREATE_INFO
        ? {status: TERMINUS_INFO, message: GRAPHS_CREATE_INFO}
        : null
    const [report, setReport] = useState(initMsg)

    /*
    function submitDelete(type, id, commit){
        if(type && id){
            setLoading(true)
            commit = (commit ? commit : "") + CREATE_GRAPH_FORM.graphDeletedLocation
            woqlClient.deleteGraph(type, id, commit)
            .then(() => {
                setLoading(false)
                alert("Need to rebuild the graph filter and delete the graph from the list")
            })
            .catch((e) => {
                setLoading(false)
                setUpdateError({message: message, error: e, status: TERMINUS_ERROR, time: t})
            })
        }
    }
    */

    function submitCreate({gid: newID, gtype: newType, commit: commit}) {
        if (newID && newType) {
            setReport()
            commit =
                (commit ? commit : '') +
                ' ' +
                newType +
                '/' +
                newID +
                ' ' +
                CREATE_GRAPH_FORM.graphCreatedLocation
            setLoading(true)
            let start = Date.now()
            woqlClient
                .createGraph(newType, newID, commit)
                .then(() => {
                    props.onUpdate()
                    setCreating(false)
                    let message =
                        CREATE_GRAPH_FORM.createSuccess + ' (' + newType + '/' + newID + ')'
                    let t = Date.now() - start
                    setReport({message: message, status: TERMINUS_SUCCESS, time: t})
                })
                .catch((e) => {
                    let t = Date.now() - start
                    let message = CREATE_GRAPH_FORM.createFailure
                    setReport({message: message, error: e, status: TERMINUS_ERROR, time: t})
                })
                .finally(() => setLoading(false))
        }
    }

    function setEditing() {
        setReport(initCreate)
        setCreating(true)
    }

    function unsetEditing() {
        setReport(initMsg)
        setCreating(false)
    }

    return (
        <div className={TAB_SCREEN_CSS}>
            {!graphs && <Loading type={TERMINUS_COMPONENT} />}
            {graphs && (
                <SchemaToolbar
                    report={report}
                    page={SCHEMA_GRAPHS_ROUTE}
                    onAction={setEditing}
                    onCancel={unsetEditing}
                    editmode={creating}
                />
            )}
            {!creating && graphs && <GraphList graphs={Object.values(graphs)} />}
            {creating && (
                <CreateGraph visible={creating} onCreate={submitCreate} onCancel={unsetEditing} />
            )}
        </div>
    )
}
