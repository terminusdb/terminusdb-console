import React, {useState, useEffect} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import Loading from '../../components/Reports/Loading'
import {
    TAB_SCREEN_CSS,
    TOOLBAR_CSS,
    GRAPH_FILTER_CSS,
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
import {Col, Row, Button} from "reactstrap"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {legalURLID} from "../../components/Query/CollaborateAPI"
import Select from "react-select";
import { AiFillCloseCircle} from 'react-icons/ai';
import { RiDeleteBin5Line } from 'react-icons/ri';
import TerminusClient from '@terminusdb/terminusdb-client'
import {formatBytes} from "../Server/DBList"


export const GraphManager = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {graphs, updateGraphs, ref, branch} = DBContextObj()
    const [loading, setLoading] = useState(false)
    const [subpage, setSubpage] = useState("list")
    const [report, setReport] = useState()
    const [graphListings, setGraphListings] = useState()

    useEffect(() => {
        if(graphs){
            gQuery(graphs)
        }
    }, [graphs])

    function submitDelete(id, type, commit){
        commit = (commit ? commit : `Deleted ${type} graph ${id} from console >> schema >> graphs`)
        setLoading(true)
        let start = Date.now()
        woqlClient.deleteGraph(type, id, commit)
        .then(() => {
            unsetEditing()
            let message = `Deleted ${type} graph ${id}`
            setReport({message: message, status: TERMINUS_SUCCESS, time: Date.now() - start})
            updateGraphs()
        })
        .catch((e) => {
            let message = `Failed to delete ${type} graph ${id}`
            setReport({message: message, error: e, status: TERMINUS_ERROR, time: Date.now() - start})
        })   
        .finally(() => setLoading(false))
    }

    function submitCreate(newID, newType, commit) {
        commit = (commit ? commit : `Created ${newType} graph ${newID} console >> schema >> graphs`)
        setLoading(true)
        let start = Date.now()
        woqlClient.createGraph(newType, newID, commit)
        .then(() => {
            unsetEditing()
            let message = `Created ${newType} graph ${newID}`
            setReport({message: message, status: TERMINUS_SUCCESS, time: Date.now() - start})
            updateGraphs()
        })
        .catch((e) => {
            let message = `Failed to create ${newType} graph ${newID}`
            setReport({message: message, error: e, status: TERMINUS_ERROR, time: Date.now() - start})
        })   
        .finally(() => setLoading(false))
    }

    function setCreating(){
        setReport()
        setSubpage("create")
    }

    function unsetEditing() {
        setReport()
        setSubpage("list")
    }

    function gQuery(graphs) {
        let WOQL = TerminusClient.WOQL
        let qbase = (ref ? woqlClient.resource("ref", ref) : woqlClient.resource("branch", branch))
        let q = WOQL.query()
        let i = 0
        for(var k in graphs){
            let gq = qbase + "/" + k
            q.and(
                WOQL.size(gq, "v:S_" + i).triple_count(gq, "v:T_" + i)
            )
            i++
        }
        if(i > 1){
            woqlClient.query(q)
            .then((res) => {
                let ngs = []
                if(res.bindings && res.bindings[0]){
                    let gres = res.bindings[0]
                    let j = 0
                    for(var k in graphs){
                        let ng = {}
                        ng.Type = graphs[k].type
                        ng.ID = graphs[k].id
                        let s = gres["S_" + j]
                        let t =  gres["T_" + j]
                        if(s){
                            ng["Size"] = formatBytes(s['@value'])
                        }
                        if(t){
                            ng["Triples"] = t['@value']
                        }
                        ngs.push(ng)
                        j++
                    }
                }
                else {
                    ngs = Object.values(graphs)
                }
                setGraphListings(ngs)
            })
            .catch((e) => {
                let rep = { status: TERMINUS_ERROR, message: "Failed to load graph sizes", error: e}
                setReport(rep)
                setGraphListings(Object.values(graphs))
            })
        }
        else {
            setGraphListings([{Type: "instance", "ID": "main", "Size": "0 Bytes", "Triples": "0"}])
        }
    }



    return (
        <div className={TAB_SCREEN_CSS}>
            {!graphs && <Loading />}
            {graphs && <>
                <Row className={TOOLBAR_CSS.container}>
                    {subpage == "list" && 
                        <ListSubpage 
                            graphs={graphs} 
                            onCreate={setCreating} 
                            onDelete={submitDelete}
                        />
                    }
                    {subpage == "create" && 
                        <CreateSubpage 
                            graphs={graphs} 
                            onCancel={unsetEditing} 
                            onSubmit={submitCreate} 
                        />
                    }            
                </Row>
                <Row className="generic-message-holder">
                    {report && 
                        <TerminusDBSpeaks report={report} />
                    }
                </Row>
                <span className="graphs-listing">
                    {graphListings && 
                        <GraphList graphs={graphListings} />
                    }
                </span>  
            </>}
        </div>            
    )
}



const ListSubpage = ({graphs, onCreate, onDelete, message}) => {
    if(!graphs) return null
    let cols = []
    let initmsg = "Graphs are containers for instance data and schema and inference rules"
    const [umsg, setUmsg] = useState(message || initmsg)
    const [del, setDel] = useState()

    function changeDel(tval){
        setUmsg(initmsg)
        setDel(tval.value)
    }

    function doCreate(tval){
        setUmsg(initmsg)
        if(onCreate) onCreate()
    }

    function doDelete(){
        setUmsg(initmsg)
        if(onDelete) {
            let parts = del.split("/")
            onDelete(parts[1], parts[0])
        }
    }

    let dopts = []
    for(var k in graphs){
        if(k != "instance/main"){
            dopts.push({label: graphs[k].type + " " + graphs[k].id, value: k})
        }            
    }
   
    cols.push(
        <Col key='m1' md={7} className="schema-toolbar-title">
            {umsg}
        </Col>
    )
    cols.push(
        <Col  key='m2' md={3} className={TOOLBAR_CSS.graphCol}>
            <span className="schema-toolbar-prefixes-holder">
                {(dopts && dopts.length > 0) &&
                    <Select 
                        className = {GRAPH_FILTER_CSS}
                        placeholder = "Select Graph to Delete"
                        onChange = {changeDel}
                        options = {dopts}
                    />
                }
            </span>
            {del && 
                <span className="schema-toolbar-delete-holder" title={"Delete " + del}>
                    <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete' onClick={doDelete} />
                </span>
            }
        </Col>
    )
    cols.push(
        <Col  key='m3' md={2} className={TOOLBAR_CSS.createCol}>
            <Button className={TOOLBAR_CSS.createGraphButton} onClick={doCreate}>
                Create Graph
            </Button>
        </Col>
    )
    return cols  
}


const CreateSubpage = ({graphs, onSubmit, onCancel}) => {
    if(!graphs) return null
    const [gid, setGid] = useState("")
    const [type, setType] = useState("")
    const [umsg, setUmsg] = useState("")

    function doSubmit(){
        let foul = trySubmit()
        if(foul){
            setUmsg(foul)
        }
    }

    function _has_gid(graphs, gid, type){
        if(gid && type && graphs[type + "/" + gid]) return true
        return false;
    }

    function trySubmit(){
        if(!gid){
            return "You must supply an ID for the graph"
        }
        if(!type){
            return "You must choose the graph type to create"
        }
        if(!legalURLID(gid)){
            return "Graph IDs must consist only of a-z 0-9 _ "
        }            
        if(gid.length > 20){
            return "Graph IDs cannot be longer than 20 characters"
        }
        if(_has_gid(graphs, gid, type)){
            return `Graph ${type}/${gid} exists - choose a different ID`
        }
        onSubmit(gid, type)
    }

    function changeGID(t){
        if(t && t.target) {
            setUmsg("")
            setGid(t.target.value)
        }
    }

    function changeType(t){
        if(t){
            setUmsg("")
            setType(t.value)
        }
    }

    function checkKeys(event){
        if(event.key === "Enter" && gid && type) doSubmit()
    }

    let cols = []
    let topts = [
        {label: "Instance Data", "value": "instance" },
        {label: "Schema", "value": "schema" },
        {label: "Inference", "value": "inference" }
    ]
    cols.push(
        <Col key='e1' md={10}>
            <span className="schema-toolbar-title">
                Create Graph Type    
            </span>
            <span className="schema-toolbar-prefixes-holder">
                <Select 
                    className = {GRAPH_FILTER_CSS}
                    placeholder = "Select Graph Type"
                    onChange = {changeType}
                    options = {topts}
                />
            </span>
            <span className="schema-toolbar-prefixes-holder">
                <input 
                    type='text'
                    className='schema-toolbar-iri'
                    placeholder="Enter Graph ID"
                    value={gid}
                    onChange={changeGID} 
                    onKeyPress={checkKeys}
                />        
            </span>        
            <span className="schema-toolbar-input-error">                 
                {umsg}
            </span>
        </Col>
    )
    cols.push(
        <Col key='e324' md={2} className={TOOLBAR_CSS.createCol}>
            <Button key="update" className="schema-toolbar-update-prefix" onClick={doSubmit}>
                Create
            </Button>            
            <span title="Cancel Update" className="schema-toolbar-cancel-holder">
                <AiFillCloseCircle  className="schema-toolbar-cancel-icon" onClick={onCancel} />
            </span>
        </Col>
    )
    return cols
}