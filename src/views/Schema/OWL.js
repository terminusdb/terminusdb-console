import React, { useState, useEffect } from 'react';
import { OWLEditor } from "./OWLEditor";
import Loading from "../../components/Reports/Loading";
import { FAILED_LOADING_OWL, TAB_SCREEN_CSS, OWL_INFO_MSG, UPDATE_TURTLE_ERROR, UPDATE_TURTLE_SUCCESS, DEFAULT_TURTLE_UPDATE_MSG } from "./constants.schema"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { SchemaToolbar } from './SchemaToolbar';
import { SCHEMA_OWL_ROUTE } from '../../constants/routes';
import { DBContextObj } from "../../components/Query/DBContext"
import { TERMINUS_ERROR, TERMINUS_INFO, TERMINUS_COMPONENT, TERMINUS_SUCCESS } from '../../constants/identifiers';
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks';


export const OWL = (props) => {
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState()
    const [updatedTurtle, setUpdatedTurtle] = useState()
    const [dataProvider, setDataProvider] = useState()
    const {woqlClient} = WOQLClientObj();
    const [loading, setLoading] = useState()

    let initMsg = (OWL_INFO_MSG ? {status: TERMINUS_INFO, message: OWL_INFO_MSG} : null) 
    const [report, setReport] = useState(initMsg)
    const [failure, setFailure] = useState()

    const { graphs, ref, branch } = DBContextObj()    

    useEffect(() => {
        if(props.graph && graphs){
            let fid = props.graph.type + "/" + props.graph.id
            if(graphs[fid]) setFilter(props.graph)
            else {
                for(var key in graphs){
                    if(graphs[key].type == props.graph.type){
                        setFilter({type: props.graph.type, id: graphs[key].id})
                        continue
                    }
                }
            }
        }
    }, [props.graph, graphs])

    useEffect(() => {
        if(filter){
            setLoading(true)
            woqlClient.getTriples(filter.type, filter.id)
            .then((cresults) => {
                let res = cresults || getEmptyTurtle()
                setDataProvider(res);
                setUpdatedTurtle(res)
            })
            .catch((e) => {
                let rep = {status: TERMINUS_ERROR, error: e}
                let f = FAILED_LOADING_OWL
                setFailure({failure: f, report: rep})
            })
            .finally(() => setLoading(false))
        }
    }, [branch, ref, filter])

    function updateSchema(commit){
        let ts = Date.now()
        let cmsg = (commit ? commit : DEFAULT_TURTLE_UPDATE_MSG + " [" + props.graph.type + "," + props.graph.id + "]") 
        setLoading(true)
        woqlClient.updateTriples(filter.type, filter.id, updatedTurtle, cmsg)
        .then(() => {
            setEdit(false)
            setDataProvider(updatedTurtle);
            setReport({status: TERMINUS_SUCCESS, message: UPDATE_TURTLE_SUCCESS, time: Date.now() - ts})
        })
        .catch((e) => {
            setReport({status: TERMINUS_ERROR, message: UPDATE_TURTLE_ERROR, error: e, time: Date.now() - ts})
        })
        .finally(() => setLoading(false))
    }

    function setEditMode(){
        setReport()
        setEdit(true)
    }

    function unsetEditMode(){
        setReport(initMsg)
        setEdit(false)
    }

    function getContents(cnt){
        if(report && report.status != TERMINUS_INFO){
            setReport()
        }
        setUpdatedTurtle(cnt)
    }

    function tryUpdateSchema(cmg){
        setReport()
        updateSchema(cmg)
    }

    function getEmptyTurtle(){
        let ctxt = woqlClient.connection.getJSONContext()
        let ttlprefixes  = "";
        for(var prefix in ctxt){
            if(prefix != "_") ttlprefixes += `@prefix ${prefix}: <${ctxt[prefix]}> .` + "\n"
        }
        return ttlprefixes
    }

    return (
        <div className = {TAB_SCREEN_CSS}>
            {!failure && 
                <SchemaToolbar 
                    report={report} 
                    editmode={edit} 
                    page={SCHEMA_OWL_ROUTE} 
                    graph={filter} 
                    onChangeGraph={props.onChangeGraph} 
                    onAction={setEditMode} 
                    onCancel={unsetEditMode} 
                    onUpdate={tryUpdateSchema}
                />
            }
            {(loading) &&  
                <Loading type={TERMINUS_COMPONENT}/>
            }
            {failure && 
                <TerminusDBSpeaks failure={failure.failure} report={failure.report} />
            }
            {!(loading || failure) &&  
                <OWLEditor dataProvider = {dataProvider} edit = {edit} onChange = {getContents} />
            }
        </div>
    )
}
