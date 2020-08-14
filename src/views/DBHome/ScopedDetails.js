import React, {useEffect, useState} from 'react'
import {Row, Col} from 'reactstrap'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_DATE, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'
import {LatestUpdates} from '../Tables/LatestUpdates'
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCopy,
    AiOutlineCloudSync, AiOutlineCloudDownload, AiOutlineFork, AiFillCheckCircle,AiFillEdit,
    AiOutlineBlock, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiFillBuild, AiOutlineBuild,
    AiOutlineGlobal, AiOutlineInbox, AiOutlineBranches, AiOutlineBook, AiOutlineDelete, AiFillDatabase} from 'react-icons/ai';
import { parseTwoDigitYear } from 'moment'

export const ScopedDetails = () => {

    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref, graphs, consoleTime} = DBContextObj()
    const [latest, setLatest] = useState()
    

    function load_context(b, r){
        let WOQL = TerminusClient.WOQL
        let woql = WOQL.query();
        let commit_id = "v:Active ID"
        if(r){
            commit_id = r
        }
        let [commit_iri, cpath, tail_iri] = WOQL.vars("ciri", "cpath", "tiri")
        

        let q = WOQL.using("_commits").triple(commit_iri, "ref:commit_id", commit_id)
            .path(commit_iri, "ref:commit_parent+", tail_iri, cpath)
        if(r){
            woql.and(WOQL.count("v:Commits", q))
        }
        else {
            woql.and(
                WOQL.count("v:Commits").and(
                    WOQL.lib().active_commit_id(b, false, "Active ID"),
                    q
                )
            )
        }

        //no need for graph queries - comes in from graphs / asset_overview

        //schema queries
        let class_query = WOQL.quad("v:AnyClass", "type", "owl:Class", "schema")
        let prop_query = WOQL.or(
            WOQL.quad("v:AnyProperty", "type", "owl:ObjectProperty", "schema"),
            WOQL.quad("v:AnyProperty", "type", "owl:DatatypeProperty", "schema")
        )

        let docs_query = WOQL.triple("v:AnyDocument", "type", "v:AnyType")
            .sub("system:Document", "v:AnyType")

        let nq = WOQL.and(
            getSizeQuery(),
            WOQL.opt().count("v:Classes", class_query),
            WOQL.opt().count("v:Properties", prop_query),
            WOQL.opt().count("v:Documents", docs_query),
            WOQL.limit(1).select("Commit ID", "Author", "Message", "Time", WOQL.lib().commits(WOQL.eq("v:Commit ID", commit_id))),
            woql
        )

        woqlClient.query(nq).then((result) => {
            if (result.bindings) setLatest(result.bindings)
        })
        .catch((e) => {
            //alert(ref + " = " + branch + " " + commit_id)
            console.log(e)
        })
    }

    function getSizeQuery(){
        let WOQL = TerminusClient.WOQL
        //let q = WOQL.query()
        let qbase = (ref ? woqlClient.resource("ref", ref) : woqlClient.resource("branch", branch))
       // alert(qbase)
        let q = WOQL.opt().and(
            WOQL.size(qbase, "v:Size").triple_count(qbase, "v:Triples")
        )
        return q
    }

    function getContextTitle(){
        if(ref){
            return "Viewing Database at " + printts(consoleTime, DATETIME_COMPLETE) + " Commit ID: " + ref 
        }
        if(branches && Object.keys(branches).length > 1) {
            return "Viewing Branch " + branch
        }
        else return "Database Contents"
    }

    //number of commits 
    //size of graph(s)
    //number / types of graphs
    //classes / properties / size
    //documents / instance data / swan
    //load commit Count
    useEffect(() => {
        if(branch && graphs){
            load_context(branch, ref)
        }
    }, [branch, ref, branches, graphs])

    if(!latest) return null
    return (
        <Col>
            <Row>
                {getContextTitle(latest)}
            </Row>
            <Row>
                <div className="database-context-row">
                    <ContextCredits meta={latest[0]} graphs={graphs} branches={branches}/>
                </div>
            </Row>           
        </Col>
    )
}



export const ContextCredits = ({meta, graphs, branches}) => {
    let res = []
    res.push(<DBSize key='dbt' meta={meta} />)
    res.push(<DBTriples key='dxt' meta={meta} />)
    res.push(<DBCommits key='cmts' meta={meta} />)
    res.push(<DBGraphs  key='abc' meta={meta} graphs={graphs} />)
    res.push(<DBSchema key='ab' meta={meta} />)
    res.push(<DBDocs key='dbc' meta={meta} />)
    res.push(<DBLastCommit key='dbv' meta={meta} branches={branches} />)
    return res
}

export const DBCommits = ({meta}) => {
    if(meta['Commits']){
        let ct = meta['Commits']['@value'] + " commits"
         return (
            <span>
                <AiFillBuild className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
         )  
    }
    return null
}


export const DBSize = ({meta}) => {
    if(meta['Size']){
         let ct = formatBytes(meta['Size']['@value'])
         return (
            <span>
                <AiFillBuild className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
         )  
    }
    return null
}

export const DBTriples = ({meta, user}) => {
    if(meta['Triples']){
        let ct = meta['Triples']['@value'] + " triples"
        return (
        <span>
            <AiOutlineBuild className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </span>
        )  
    }
    return null
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const DBDocs= ({meta}) => {
    if(meta['Documents']){
        let ct = meta['Documents']['@value'] 
        if(ct == 1) ct += " document"
        else ct += " documents"
        return (
            <span>
                <AiOutlineBuild className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
        )  
    }
    return null
}

export const DBGraphs = ({meta, graphs}) => {
    let str
    
    if(graphs) {
        let inf = 0; 
        let sch = 0;
        let ins = 0;
        str = Object.keys(graphs).length + " graphs: "
        for(var k in graphs){
            if(graphs[k].type == "schema") sch++
            else if(graphs[k].type == "inference") inf++
            else if(graphs[k].type == "instance") ins++
        }
        if(sch > 0){
            str += sch + " schema "
        }
        if(ins > 0){
            str += ins + " instance "
        }
        if(inf > 0){
            str += inf + " inference "
        }
    }
    else {
        str = "schema free database - single graph"
    }
    return (
        <span>
            <AiFillInfoCircle className="db_info_icon_spacing"/>
            <span className="db_info">{str}</span>
        </span>
    )
}

export const DBSchema = ({meta}) => {
    let parts = []
    if(meta['Classes']){
        let ct = meta['Classes']['@value'] 
        if(ct == 1) ct += " class"
        else ct += " classes"
        parts.push(
            <span>
                <AiOutlineBuild className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
        )  
    }
    if(meta['Properties']){
        let ct = meta['Properties']['@value'] 
        if(ct == 1) ct += " property"
        else ct += " properties"
        parts.push(
            <span>
                <AiOutlineBuild className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
        )  
    }
    return parts
}

export const DBLastCommit = ({meta, branches}) => {
    if(Object.keys(branches).length > 1){
        let ct = "Last commit"
        if(meta['Author']) ct += " by " + meta['Author']["@value"]
        if(meta['Time']) ct += " at " + printts(meta['Time']["@value"], DATETIME_COMPLETE)
        if(meta['Message']) ct += ' "' + meta['Message']["@value"] + '"'
        return (
            <span>
                <AiFillEdit className="db_info_icon_spacing"/>
                <span className="db_info">{ct}</span>
            </span>
        )
    
    }
    else return null
}

