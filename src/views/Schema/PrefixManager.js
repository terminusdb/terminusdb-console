import React, { useState, useEffect } from 'react';
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import TerminusClient from "@terminusdb/terminusdb-client"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { BuiltInPrefixes, CustomPrefixes } from "../Tables/Prefixes"
import { TAB_SCREEN_CSS, PREFIXES, CREATE_PREFIX_FORM } from './constants.schema';
import { TERMINUS_INFO } from '../../constants/identifiers';
import { SchemaToolbar } from './SchemaToolbar';
import Loading from "../../components/Reports/Loading";
import { SCHEMA_PREFIXES_ROUTE } from '../../constants/routes';

export const GraphManager = (props) => {
    const {woqlClient} = WOQLClientObj()
    //const {graphs} = DBContextObj();
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    let initMsg = (PREFIXES.info ? {status: TERMINUS_INFO, message: PREFIXES.info} : null)
    let initCreate = (PREFIXES.createInfo ? {status: TERMINUS_INFO, message: PREFIXES.createInfo} : null)
    const [report, setReport] = useState(initMsg)

    let q = TerminusClient.WOQL.using("_commits")
        .select("v:Prefix", "v:URI")
        .triple("ref:default_prefixes", "ref:prefix_pair", "v:PIRI")
        .triple("v:PIRI", "ref:prefix_uri", "v:URI")
        .triple("v:PIRI", "ref:prefix", "v:Prefix")

    function newPrefixQuery(pref, uri){
        let q = TerminusClient.WOQL.using("_commits")
            .idgen("doc:PrefixPair", pref, "v:PID")
            .add_triple("ref:default_prefixes", "ref:prefix_pair", "v:PID")
            .insert("v:PID", "ref:PrefixPair")
            .property("ref:prefix", prefix)
            .property("ref:prefix_uri", uri)
        return q
    }

    const [updateQuery, qreport, prefixes, woql, qloading] = WOQLQueryContainerHook(woqlClient, q)
       
    let ctxt = woqlClient.connection.getJSONContext()
    for(var pr in ctxt){
        if(builtins.indexOf(pr) !== -1)
            builtin_rows.push({prefix: pr, url: ctxt[pr]})
    }

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

    function submitCreate({prefix: prefix, uri: uri, commit: commit}){
        if(prefix && uri){
            setReport()
            commit = (commit ? commit : "") + " " + newType + "/" + newID + " " + CREATE_PREFIX_FORM.prefixCreatedLocation
            setLoading(true)
            let start = Date.now()
            woqlClient.query(newPrefixQuery(pref, uri), commit)
            .then(() => {
                props.onUpdate()
                setCreating(false)
                let message = CREATE_PREFIX_FORM.createSuccess + " (" + newType + "/" + newID + ")"
                let t =  (Date.now() - start )
                setReport({message: message, status: TERMINUS_SUCCESS, time: t})
            })
            .catch((e) => {
                let t =  (Date.now() - start )
                let message = CREATE_PREFIX_FORM.createFailure
                setReport({message: message, error: e, status: TERMINUS_ERROR, time: t})
            })
            .finally(() => setLoading(false))
        }
    }

    function setEditing(){
        setReport(initCreate)
        setCreating(true)
    }

    function unsetEditing(){
        setReport(initMsg)
        setCreating(false)
    }

    return (
        <div className = {TAB_SCREEN_CSS}>
            {!graphs &&
                <Loading type={TERMINUS_COMPONENT} />
            }
            {prefixes &&
                <SchemaToolbar
                    report={report}
                    page={SCHEMA_PREFIXES_ROUTE}
                    onAction={setEditing}
                    onCancel={unsetEditing}
                    editmode={creating}
                />
            }
            {!creating && prefixes &&
                <CustomPrefixes prefixes={prefixes}/>
            }
            {!creating &&
                <div className={PREFIXES.builtinSectionCSS}>
                    <h3 className={PREFIXES.builtinHeaderCSS}>PREFIXES.builtinHeader</h3> 
                    <BuiltInPrefixes prefixes={builtin_rows}/>
                </div>
            }
            {creating &&
                <CreatePrefix visible={creating} onCreate={submitCreate} onCancel={unsetEditing} />
            }
    </div>
    )
}






