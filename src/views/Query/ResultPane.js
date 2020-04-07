import React, { useState, useEffect } from "react";
import { GraphComponent } from '@terminusdb/terminus-react-graph';
import { Col, Button } from "reactstrap";
import TerminusClient from '@terminusdb/terminus-client';
import { queryControls } from "../../variables/formLabels"
import RenderTable from "../../components/RenderTable"
import { TABLE, PROJECT_DIAGRAM } from '../../labels/iconLabels'
import { AddIcon } from "../../components/LoadFontAwesome"
import { isObject } from "../../utils/helperFunctions";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import { RENDER_TYPE_TABLE, RENDER_TYPE_GRAPH } from "../../labels/renderTypeLabels";
import { parseText } from './CodeFormatter'
import { WOQL, WOQL_JSON, WOQL_PY } from '../../labels/queryFormats'

export const ResultPane = (props) => {
    const view = props.view || RENDER_TYPE_TABLE;
    const results = props.results || {};
    const [viewer, setViewer] = useState(false);
    const [count, setCount] = useState(0);
    const [reload, setReload] = useState(false);
    const conf = TerminusClient.View;

    const [rule, setRule] = useState('');

    const [rOptions, setROptions] = useState({mode: 'javascript',
        theme: 'mdn-like',
        lineNumbers: true});


    const getGraphObjectViewer = (r) => {
        const graphConfig = conf.graph();
        graphConfig.height(600).width(600)
        let v = graphConfig.create(null);
        if(isObject(r)) v.config = r;
        v.setResult(results);
        setViewer(v);
    }

    const handleView = () => {
        const parsed = parseText(rule, WOQL);
        getGraphObjectViewer(parsed);
    }


    useEffect(() => {
        switch(view){
            case RENDER_TYPE_GRAPH:
                if(isObject(results)){
                    getGraphObjectViewer();
                    setCount(results.bindings.length);
                }
                break;
            case RENDER_TYPE_TABLE:
                if(isObject(props.results)){
                    const tableConfig = conf.table();
                    tableConfig.setPage(1);
                    let v = tableConfig.create(null);
                    v.setResult(props.results);
                    setViewer(v);
                }
                break;
        }
        setReload(Date.now());
    }, [results]);

    return (
         <>
             {/*(view == RENDER_TYPE_TABLE) &&
                 <RenderTable dataProvider = { props.results }/>*/}
             {(props.viewConfig) && <div className="q-Ru">
                 <CodeMirror value={rule}
                       options={rOptions}
                       onBeforeChange={(editor, data, value) => {
                         setRule(value);
                       }}
                       onChange={(editor, data, value) => {
                         setRule(value);
                       }}/>
                 <button
                    className = { queryControls.updateView.className }
                    type =  { queryControls.updateView.type }
                    onClick = {handleView}>
                    { queryControls.updateView.text }
                 </button>
             </div>}
               {(view == RENDER_TYPE_GRAPH) && (reload) &&
                 <GraphComponent config={viewer.config} dataProvider = { viewer }
                        date = {Date.now()}/>}
         </>
    )
}
