import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {BuiltInPrefixes, CustomPrefixes} from '../Tables/Prefixes'
import {TAB_SCREEN_CSS, TOOLBAR_CSS, PREFIXES, CREATE_PREFIX_BUTTON, GRAPH_FILTER_CSS} from './constants.schema'
import Loading from '../../components/Reports/Loading'
import {DBContextObj} from '../../components/Query/DBContext'
import {Col, Row, Button} from "reactstrap"
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from "../../constants/identifiers"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {legalURLID} from "../../components/Query/CollaborateAPI"
import Select from "react-select";
import { AiFillCloseCircle} from 'react-icons/ai';
import { RiDeleteBin5Line } from 'react-icons/ri';

export const PrefixManager = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [loading, setLoading] = useState(false)
    const [subpage, setSubpage] = useState("list")
    const [prefix, setPrefix] = useState()
    const {prefixes, updateBranches} = DBContextObj()
    const [report, setReport] = useState()

    let WOQL = TerminusClient.WOQL

    function submitCreate(prefix, uri, commit) {
        commit = (commit ? commit : `Created prefix ${prefix} for IRI ${uri} from console schema/prefixes`)
        setReport()
        setLoading(true)
        let start = Date.now()
        woqlClient.query(WOQL.lib().create_prefix(prefix, uri), commit)
        .then(() => {
            unsetEditing()
            let message = `Created prefix ${prefix} for IRI ${uri}`
            setReport({message: message, status: TERMINUS_SUCCESS, time: Date.now() - start})
            updateBranches()
        })
        .catch((e) => {
            let message = `Failed to created prefix ${prefix} for IRI ${uri}`
            setReport({message: message, error: e, status: TERMINUS_ERROR, time: Date.now() - start})
        })
        .finally(() => setLoading(false))
    }

    function submitDelete(){
        let commit = `Deleted prefix ${prefix} from console schema/prefixes`
        setReport()
        setLoading(true)
        let start = Date.now()
        woqlClient.query(WOQL.lib().delete_prefix(prefix), commit)
        .then(() => {
            unsetEditing()
            let message = `Deleted prefix ${prefix}`
            setReport({message: message, status: TERMINUS_SUCCESS, time: Date.now() - start})
            updateBranches()
        })
        .catch((e) => {
            let message = `Failed to delete prefix ${prefix}`
            setReport({message: message, error: e, status: TERMINUS_ERROR, time: Date.now() - start})
        })
        .finally(() => setLoading(false))
    }

    function submitUpdate(iri, commit){
        commit = (commit ? commit : `Updated prefix ${prefix}, set to ${iri} from console schema/prefixes`)
        setReport()
        setLoading(true)
        let start = Date.now()
        woqlClient.query(WOQL.lib().update_prefix(prefix, iri), commit)
        .then(() => {
            unsetEditing()
            let message = `Updated prefix ${prefix} with IRI ${iri}`
            setReport({message: message, status: TERMINUS_SUCCESS, time: Date.now() - start})
            updateBranches()
        })
        .catch((e) => {
            let message = `Failed to update prefix ${prefix} for IRI ${iri}`
            setReport({message: message, error: e, status: TERMINUS_ERROR, time: Date.now() - start})
        })
        .finally(() => setLoading(false))
    }

    function setUpdating(val) {
        setReport()
        setPrefix(val)
        if(val){
            setSubpage("edit")
        }
        else {
            setSubpage("list")            
        }
    }

    function setCreating(){
        setReport()
        setSubpage("create")
    }

    function unsetEditing() {
        setReport()
        setSubpage("list")
    }

    let context= woqlClient.connection.getJSONContext()
    let builtins = Object.keys(TerminusClient.UTILS.standard_urls)
    let builtin_rows = []
    for (var pr in context) {
        if (builtins.indexOf(pr) !== -1) builtin_rows.push({prefix: pr, url: context[pr]})
    }

    return (
        <div className={TAB_SCREEN_CSS}>
            {(!prefixes || loading) && <Loading />}
            {prefixes && (<>
                <Row className={TOOLBAR_CSS.container}>
                    {subpage == "list" && 
                        <ListSubpage 
                            prefixes={prefixes} 
                            onCreate={setCreating} 
                            onEdit={setUpdating}
                        />
                    }
                    {subpage == "create" && 
                        <CreateSubpage 
                            prefixes={prefixes} 
                            onCancel={unsetEditing} 
                            onSubmit={submitCreate} 
                        />
                    }
                    {subpage == "edit" && 
                        <EditSubpage 
                            prefix={prefix} 
                            prefixes={prefixes} 
                            onCancel={unsetEditing} 
                            onSubmit={submitUpdate} 
                            onDelete={submitDelete}
                        />
                    }
                </Row>
                <Row className="generic-message-holder">
                    {report && 
                        <TerminusDBSpeaks report={report} />
                    }
                </Row>
                <span className="prefixes-listing">
                    <CustomPrefixes prefixes={prefixes} />
                    <div className="builtin-prefixes">
                        <h3 className="builtin-prefixes-header">Built-in Prefixes</h3>
                        <BuiltInPrefixes prefixes={builtin_rows} />
                    </div>
                </span>
            </>)
        }
        </div>
    )
}


const ListSubpage = ({prefixes, onCreate, onEdit, message}) => {
    if(!prefixes) return null
    let cols = []
    let initmsg = "Prefixes define how your database's IRIs can be addressed in shorthand forms"
    const [umsg, setUmsg] = useState(message || initmsg)

    function doEdit(tval){
        setUmsg(initmsg)
        if(onEdit) onEdit(tval.value)
    }

    function doCreate(tval){
        setUmsg(initmsg)
        if(onCreate) onCreate()
    }

    let popts = prefixes.map((item) => {
        return {label: item["Prefix"]["@value"], value: item["Prefix"]["@value"]}
    })
    cols.push(
        <Col key='m1' md={8} className="schema-toolbar-title">
            {umsg}
        </Col>
    )
    cols.push(
        <Col  key='m2' md={2} className={TOOLBAR_CSS.graphCol}>
            <span className="schema-toolbar-prefixes-holder">
                <Select 
                    className = {GRAPH_FILTER_CSS}
                    placeholder = "Select Prefix to Update"
                    onChange = {doEdit}
                    options = {popts}
                />
            </span>
        </Col>
    )
    cols.push(
        <Col  key='m3' md={2} className={TOOLBAR_CSS.createCol}>
            <Button className={TOOLBAR_CSS.createGraphButton} onClick={doCreate}>
                {CREATE_PREFIX_BUTTON}
            </Button>
        </Col>
    )
    return cols  
}

const CreateSubpage = ({prefixes, onSubmit, onCancel}) => {
    if(!prefixes) return null
    const [prefix, setPrefix] = useState("")
    const [IRI, setIRI] = useState("")
    const [umsg, setUmsg] = useState("")

  
    function doSubmit(){
        let foul = trySubmit()
        if(foul){
            setUmsg(foul)
        }
    }

    function trySubmit(){
        if(prefix){
            if(!legalURLID(prefix)){
                return "Prefixes must consist only of a-z 0-9 _ "
            }            
            if(prefix.length > 20){
                return "Prefixes cannot be longer than 20 characters"
            }
            if(_has_prefix(prefixes, prefix)){
                return `Prefix ${prefix} has already been defined`
            }
            if(IRI){
                let foul = _illegal_iri(IRI) || _iri_clash(prefixes, IRI)
                if(foul) return foul
                onSubmit(prefix, IRI)
            }
            else {
                return "You must supply an iri"
            }
        }
        else {
            return "You must supply a prefix"
        }
    }

    function changeIRI(t){
        if(t && t.target) {
            setUmsg("")
            setIRI(t.target.value)
        }
    }

    function changePrefix(t){
        if(t && t.target){
            setUmsg("")
            setPrefix(t.target.value)
        }
    }

    function checkKeys(event){
        if(event.key === "Enter" && prefix && IRI) doSubmit()
    }

    let cols = []
    cols.push(
        <Col key='e1' md={10}>
            <span className="schema-toolbar-title">
                Create Prefix      
            </span>
            <span className="schema-toolbar-prefix-holder">
                <input 
                    type='text'
                    className='schema-toolbar-prefix'
                    placeholder="enter prefix"
                    value={prefix}
                    onChange={changePrefix} 
                    onKeyPress={checkKeys}
                />   
            </span>
            <span className="schema-toolbar-iri-holder">
                <input 
                    type='text'
                    className='schema-toolbar-iri'
                    placeholder="Enter IRI to map to prefix"
                    value={IRI}
                    onChange={changeIRI} 
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

const EditSubpage = ({prefixes, prefix, onSubmit, onCancel, onDelete}) => {
    if(!prefixes) return null
    const [IRI, setIRI] = useState(getInitialIRI(prefix, prefixes))
    const [umsg, setUmsg] = useState("")
    let cols = []
    function changeIRI(t){
        if(t && t.target) {
            setUmsg("")
            setIRI(t.target.value)
        }
    }

    function checkKeys(event){
        if(event.key === "Enter") doUpdate()
    }

    function getInitialIRI(prefix, prefixes){
        let p = _has_prefix(prefixes, prefix)
        if(p) return p['IRI']['@value']
        return ""
    }

    function doUpdate(){
        let foul = false
        if(!IRI) foul = "You must provide a valid IRI"
        else foul = _illegal_iri(IRI) || _iri_clash(prefixes, IRI, prefix)
        if(foul){
            setUmsg(foul)
        } 
        else {
            onSubmit(IRI)
        }
    }

    let show_delete = (["scm", "doc"].indexOf(prefix) == -1)

    cols.push(
        <Col key='e1' md={10}>
            <span className="schema-toolbar-title">
                Update Prefix <i>{prefix}</i>      
            </span>
            <span className="schema-toolbar-iri-holder">
                <input 
                    type='text'
                    className='schema-toolbar-iri'
                    placeholder="Enter IRI to map to prefix"
                    value={IRI}
                    onKeyPress={checkKeys}
                    onChange={changeIRI} 
                />        
            </span>        
            {show_delete &&
                <span className="schema-toolbar-delete-holder" title={"Delete " + prefix}>
                    <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete' onClick={onDelete} />
                </span>
            }
            <span className="schema-toolbar-input-error">                 
                {umsg}
            </span>
        </Col>
    )
    cols.push(
        <Col key='e324' md={2} className={TOOLBAR_CSS.createCol}>
            <Button key="update" className="schema-toolbar-update-prefix" onClick={doUpdate}>
                Update
            </Button>            
            <span title="Cancel Update" className="schema-toolbar-cancel-holder">
                <AiFillCloseCircle  className="schema-toolbar-cancel-icon" onClick={onCancel} />
            </span>
        </Col>
    )
    return cols
}   

function _has_prefix(prefixes, pref, iri){
    for(var i = 0; i<prefixes.length; i++){
        let p = prefixes[i]
        if(pref && iri){
            if(p["Prefix"]['@value'] == pref && p["IRI"]['@value'] == iri) return p
        }
        else if(pref){
            if(p["Prefix"]['@value'] == pref) return p
        }
        else if(iri){
            if(p["IRI"]['@value'] == iri) return p
        }
    }
    return false
}

function _iri_clash(prefixes, iri, prefix){
    let iris = prefixes.map((item) => {
        return item["IRI"]['@value']
    })
    iris = iris.concat(Object.keys(TerminusClient.UTILS.standard_urls))
    for(var i = 0; i<iris.length; i++){
        if(prefix && prefixes[i] && prefixes[i]["Prefix"]["@value"] == prefix) continue;
        if(iri.substring(0, iri.length) == iris[i].substring(0, iri.length)){
            return `IRI clashes with existing IRI ${iris[i]}`
        }
        else if(iris[i].substring(0, iris[i].length) == iri.substring(0, iris[i].length)){
            return `IRI clashes with existing IRI ${iris[i]}`
        }
    }
    return false
}

function _illegal_iri(c){
    if(c.length <= 5) return "IRI too short"
    if(c.indexOf("://") < 1) return "IRI must be of form `protocol://`"
    return false
}
