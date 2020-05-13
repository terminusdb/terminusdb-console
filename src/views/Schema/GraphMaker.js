import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from "reactstrap"
import RenderTable from "../../Components/Table/RenderTable"
import Select from "react-select";
import { WOQLClientObj } from "../../init/woql-client-instance";
import Loading from "../../components/Loading";

export const GraphMaker = (props) => {
    const {woqlClient} = WOQLClientObj();
    const canDeleteGraph = woqlClient.db() != "terminus" //need to be got from client
    const canCreateGraph =  woqlClient.db() != "terminus" //need to ge got from client
    const [dataProvider, setDataProvider] = useState(graphToTable(props.graphs))
    const [newID, setNewID] = useState("")
    const [newType, setNewType] = useState()
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

    function submitCreate(){
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

    function changeGraphType(SelValue){
        setNewType(SelValue.value)
    }

    function changeGraphID(SelValue){
        setNewID(SelValue.target.value)
    }


    function getCreateButton(){
        return (<Button onClick={submitCreate}>Create</Button>)
    }

    function getCreateTypes(){
        return (<Select placeholder = "Graph Type"
            className = "brSeltr"
            selected = {newType}
            onChange = {changeGraphType}
            options = {[
                {label: "Data", value: "instance"}, 
                {label: "Schema Rules",  value: "schema"}, 
                {label: "Inference Rules", value: "inference"}]}
        />)        
    }

    function getCreateIDInput(){
        return (<input placeholder="new graph id" onChange={changeGraphID} />)
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
        let x = {columnData:formatData(graphs), columnConf:formatColumns(graphs)};
        return x
    }

    return (
        <Container>
            {(loading || !dataProvider) && 
                <Loading />
            }
            {dataProvider && 
                <RenderTable dataProvider = {dataProvider}/>
            }
            {canCreateGraph && 
                <Container>
                    <Row>
                        <Col>
                            {getCreateTypes()},
                        </Col>
                        <Col>
                            {getCreateIDInput()},
                        </Col>
                        <Col>
                            {getCreateButton()},
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    )
}

