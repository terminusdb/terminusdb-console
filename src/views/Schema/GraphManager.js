import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from "reactstrap"
import { WOQLClientObj } from "../../init/woql-client-instance";
import Loading from "../../components/Reports/Loading";
import { CreateGraph } from "./CreateGraph"
import { CREATE_GRAPH_FORM} from "./constants.schema"
import { DELETE_ICON_CSS } from "./constants.schema"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_INFO} from "../../constants/identifiers"
import {DELETE_ICON} from "../../constants/images"
import {APIUpdateReport} from "../../components/Reports/APIUpdateReport"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import {GraphList} from "../Tables/GraphList"

export const GraphManager = (props) => {
    const {woqlClient} = WOQLClientObj();
    const canDeleteGraph = woqlClient.db() != "terminus" //need to be got from client
    const canCreateGraph =  woqlClient.db() != "terminus" //need to ge got from client
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState()
    const [updateError, setUpdateError] = useState()

    function getDeleteButton(type, id){
        return (
            <img 
                className={DELETE_ICON_CSS}
                src={DELETE_ICON} 
                onClick={function(){submitDelete(type, id)}}
             />
        )
    }

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

    function submitCreate({gid: newID, gtype: newType, commit: commit}){
        if(newID && newType){
            setUpdateError(false)
            setUpdateSuccess(false)
            commit = (commit ? commit : "") + " " + newType + "/" + newID + " " + CREATE_GRAPH_FORM.graphCreatedLocation
            setLoading(true)
            let start = Date.now()
            woqlClient.createGraph(newType, newID, commit)
            .then(() => {
                setLoading(false)
                props.onUpdate()
                setCreating(false)
                let message = CREATE_GRAPH_FORM.createSuccess + " (" + newType + "/" + newID + ")"
                let t =  (Date.now() - start )
                setUpdateSuccess({message: message, status: TERMINUS_SUCCESS, time: t})
            })
            .catch((e) => {
                setLoading(false)
                let t =  (Date.now() - start )
                let message = CREATE_GRAPH_FORM.createFailure
                setUpdateError({message: message, error: e, status: TERMINUS_ERROR, time: t})
            })
        }  
    }

    function showCreate(){
        setCreating(true)
    }

    function formatData(graphs){
        let rows = []
        for(var type in graphs){
            for(var i = 0; i<graphs[type].length; i++){
                let row = {
                    type: type,
                    size: "?",
                    key: i,
                    gid: graphs[type][i],
                }
                if(canDeleteGraph){
                    row.delete = getDeleteButton(row.type, row.gid)
                }
                else if(canCreateGraph){
                    row.delete = "aa"
                }
                rows.push(row)
            }
        }
        return rows
    }

    function setEditing(){
        setCreating(true)
        setUpdateSuccess(false)
    }

    return (
        <Container>
            {(loading) && 
                <Loading />
            }
            {canCreateGraph && 
                <CreateGraph report={updateError} visible={creating} onCreate={submitCreate} onEdit={setEditing} onCancel={() => setCreating(false)} />
            }
            {updateSuccess && 
                <APIUpdateReport message={updateSuccess.message} status={updateSuccess.status} time={updateSuccess.time}/>
            }
            {(!creating && props.graphs) && 
                <ResultViewer type = "table" bindings= {props.graphs}/>
            }
        </Container>
    )
}

