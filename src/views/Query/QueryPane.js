import React, { useState } from "react";
import { Col, Button, Collapse, ButtonGroup,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { queryControls } from "../../variables/formLabels"
require('codemirror/lib/codemirror.css');
require('codemirror/theme/mdn-like.css');
require('codemirror/mode/javascript/javascript.js');
import {Controlled as CodeMirror} from 'react-codemirror2';
import { CARET_LEFT, CARET_RIGHT } from '../../labels/iconLabels'
import { AddIcon } from "../../components/LoadFontAwesome"
const TerminusClient = require('@terminusdb/terminus-client');
import { isObject } from "../../utils/helperFunctions";
import { schemaLib, dataLib, documentLib, libs } from "../../variables/queryLibrary"
import { getQuery } from "../../utils/queryList"
import { formatQuery } from "./CodeFormatter"
import { WOQL_JS, WOQL_JSON, WOQL_PY} from '../../labels/queryFormats'
import { RunQueriesHook } from '../../hooks/RunQueriesHook'
import { RENDER_TYPE_TABLE, RENDER_TYPE_GRAPH } from "../../labels/renderTypeLabels";
import { QueryResults } from "./QueryResults"
import { Resizable } from "re-resizable";

export const QueryPane = (props) => {
    const [query, setQuery] = useState('');
    const [woqlObj, setWOQLObj] = useState({});
    const [mode, setMode] = useState(WOQL_JS);
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const [qOptions, setqOptions] = useState({mode: 'javascript',
        noHScroll: false,
        theme: 'mdn-like',
        lineNumbers: true});

    const handleQuery = (ev) => {
        setWOQLObj(query);
    }

    const getDataProvider = () => {
            const [dataResponse, loading] = RunQueriesHook(woqlObj);
            return dataResponse.result;
    }


    // drop down menus
    const QueryLibDropDown = (props) => {
        const control = props.control || [];
        const menu = [];
        const handleQuery = (action) => {
            let q = getQuery(action, {});
            setWOQLObj(q); // set woql object
            let fq = formatQuery(q, mode);
            setQuery(fq);
        }
        control.map((items) => {
            menu.push(<DropdownItem onClick={() =>
                {handleQuery(items.queryName)}}>{items.text}</DropdownItem>)
        })
        return(<DropdownMenu> {menu} </DropdownMenu>)
    }

    const handleWOQL = () => {
        setMode(WOQL_JS);
        let fq = formatQuery(woqlObj, WOQL_JS)
        setQuery(fq);
    }

    const handleJSONLD = () => {
        setMode(WOQL_JSON);
        let fq = formatQuery(woqlObj, WOQL_JSON)
        setQuery(fq);
    }

    const handleJSONPY = () => {
        setMode(WOQL_PY);
        console.log('do something ... ')
    }

    // drop down menu
    const dropDowns = [];
    libs.map((items) => {
        dropDowns.push(
            <UncontrolledDropdown>
              <DropdownToggle caret>
                {items.text}
              </DropdownToggle>
              <QueryLibDropDown control={ items.control } query={ query }/>
            </UncontrolledDropdown>
        )
    })

    const QueryFormatButtonGroups = (props) => {
        return (
            <ButtonGroup>
              <Button className = { queryControls.woql.className }
                onClick = { handleWOQL }>
                { queryControls.woql.text }</Button>
              <Button className = { queryControls.jsonld.className }
                 onClick = { handleJSONLD }>
                { queryControls.jsonld.text }</Button>
              <Button className = { queryControls.jsonpy.className }
                 onClick = { handleJSONPY }>
                { queryControls.jsonpy.text }</Button>
           </ButtonGroup>
        )
    }
    const style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "solid 1px #ddd",
      background: "transparent"
    };
    const [qpWidth, setQPWidth] = useState(800);
    const [qpheight, setQPHeight] = useState(500);

    const [rpWidth, setRPWidth] = useState(1000);
    const [rpheight, setRPHeight] = useState(500);


    return (
        <span className="d-fl qp-cont">
            <>{/*<Resizable
              style={style}
              size={{ qpWidth, qpheight }}
              enable={ {top:false, right:true, bottom:false, left:true,
                  topRight:false, bottomRight:false, bottomLeft:false, topLeft:false} }
              onResizeStop={(e, direction, ref, d) => {
                setQPWidth(qpWidth + d.width);
                setQPHeight(qpheight + d.height);
            }}>*/}
                  <Col className="col-md-6">
                      <span className="d-ddps d-fl">{dropDowns}</span>
                      <hr className="my-space-50"/>
                      <hr className='my-3-clr'/>
                      <div className = "q-e">
                          <QueryFormatButtonGroups/>
                          <CodeMirror value={query}
                                options={qOptions}
                                onBeforeChange={(editor, data, value) => {
                                  setQuery(value);
                                }}
                                onChange={(editor, data, value) => {
                                  setQuery(value);
                                }}
                              />
                           <button
                              className = { queryControls.runQuery.className }
                              type =  { queryControls.runQuery.type }
                              onClick = { handleQuery }>
                              { queryControls.runQuery.text }
                          </button>
                          <hr className='my-space-100'/>
                          <hr className='my-3'/>
                          <hr className='my-space-50'/>
                      </div>
                   </Col>
            {/*</Resizable>*/}</>
            <>{/*<Resizable
              style={style}
              size={{ rpWidth, rpheight }}
              enable={ {top:false, right:true, bottom:false, left:true,
                  topRight:false, bottomRight:false, bottomLeft:false, topLeft:false} }
              onResizeStop={(e, direction, ref, d) => {
                setRPWidth(rpWidth + d.width);
                setRPHeight(rpheight + d.height);
            }}>*/}
                  <Col className="col-md-6 q-Re">
                       <QueryResults
                         results={getDataProvider()}/>
                  </Col>

                  {/*<QueryPane qObject = {}
                    qConfig = {}
                    rObject = {}
                    rConfig = {}
                    rpConfig = {}/>*/}

            {/*</Resizable>*/}</>
         </span>
    )
}
