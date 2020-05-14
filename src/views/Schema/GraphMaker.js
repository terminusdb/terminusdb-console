import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from "reactstrap"
import RenderTable from "../../components/Table/RenderTable"
import { WOQLClientObj } from "../../init/woql-client-instance";
import Loading from "../../components/Loading";
import { createGraphText } from "../../variables/formLabels"
import { CreateGraph } from "./CreateGraph"

export const GraphMaker = (props) => {
    const {woqlClient} = WOQLClientObj();
    const canDeleteGraph = woqlClient.db() != "terminus" //need to be got from client
    const canCreateGraph =  woqlClient.db() != "terminus" //need to ge got from client
    const [dataProvider, setDataProvider] = useState(graphToTable(props.graphs))
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(false)

    function getDeleteButton(type, id){
        return (<Button onClick={function(){submitDelete(type, id)}}>Delete</Button>)
    }

    function submitDelete(type, id){
        if(type && id){
            setLoading(true)
            woqlClient.deleteGraph(type, id, "Graph Deleted with Command in Console")
            .then(() => {
                setLoading(false)
                alert("Need to rebuild the graph filter and delete the graph from the list")
            })
            .catch((e) => {
                setLoading(false)
                //setError(e)
            })        
        }
        alert("Deleting " + type + id)
    }

    function submitCreate(newID, newType){
        if(newID && newType){
            setLoading(true)
            woqlClient.createGraph(newType, newID, "Graph Created with Command in Console")
            .then(() => {
                setLoading(false)
                alert("Need to rebuild the graph filter and add the graph to the list")
            })
            .catch((e) => {
                setLoading(false)
                //setError(e)
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

    function formatColumns(graphs){
        let columnList = [
            {name: "Graph Type", selector: "type"},    
            {name: "ID",  selector: "gid"},    
            {name: "Size", selector: "size"},    
        ]
        if(canDeleteGraph) {
            columnList.push({name: "Delete", selector: "delete"})
        }
        return columnList
    }

    function graphToTable(graphs){
        return {columnData:formatData(graphs), columnConf:formatColumns(graphs)}
    }

    return (
        <Container>
            {(loading || !dataProvider) && 
                <Loading />
            }
            {(!loading && canCreateGraph && !creating) && 
                <Row>
                    <button onClick={showCreate} className={createGraphText.createButtonClassName}>
                        {createGraphText.createButtonText}
                    </button>
                </Row>
            }
            {creating && 
                <CreateGraph onCancel={() => setCreating(false)} onCreate={submitCreate} />
            }
            {!(creating && dataProvider) && 
                <RenderTable dataProvider = {dataProvider}/>
            }
        </Container>
    )
}

