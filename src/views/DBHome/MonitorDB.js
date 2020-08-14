import React, {useEffect, useState} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {Row, Col} from 'reactstrap'
import {DetailsCard} from './DetailsCard'
import * as icons from '../../constants/faicons'
import TerminusClient from '@terminusdb/terminusdb-client'
import {LatestUpdates} from '../Tables/LatestUpdates'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DBFullCard} from './DBFullCard'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_DATE, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'
import {CommitLog} from "./CommitLog"

export const MonitorDB = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref} = DBContextObj()

    const [commitCount, setCommitCount] = useState()
    const [latest, setLatest] = useState()
    const [assetRecord, setAssetRecord] = useState({})
    
    let WOQL = TerminusClient.WOQL

    //load commit Count
    useEffect(() => {
        if(branch){
           // load_context(branch, ref)
        }
    }, [branch, ref, branches])

    useEffect(() => {
        load_assets()
    }, [])


    function load_assets(){
        let x = woqlClient.resource("db").substring(0, woqlClient.resource("db").length-1)
        WOQL.lib().assets_overview([x], woqlClient).then((res) => {
            setAssetRecord(res[0])
        })
    }



    const db_uri = woqlClient.connectionConfig.cloneableURL()

    function getCommitInfo() {
        let str = ''
        return str
        if (scale) {
            str += 'DB Size: ' + formatBytes(scale.size) + ' ~ Triples: ' + scale.triple_count
        }
        if (latest && latest[0]) {
            let r = latest[0]
            if (scale) {
                str += '\n ~ '
            }
            str +=
                'Last Update (' + r['Author']['@value'] + '): ' + printts(r['Time']['@value']) + ' '
        }
        return str
    }

    function getCurrentDBName() {
        let db = woqlClient.get_database()
        if (db) return db.label
        return 'unknown'
    }
    function getCurrentDbDescr() {
        let db = woqlClient.get_database()
        if (db) return db.description
        return 'unknown database'
    }


    function getRepoInfo() {
        let info = {title: 'Origin', type: '', sub: '', info: ''}
        if (repos) {
            if (repos.remote) {
                info = repos.remote
                info.sub = 'Distributed Database'
                info.info = 'Cloned from ' + info.url
            } else if (repos.local_clone) {
                info = repos.local_clone
                info.sub = 'Clone of Local Database'
                info.info = 'Cloned from ' + info.url
            } else {
                info = repos.local
                info.sub = 'Local Database'
            }
        }
        return info
    }

    function showCreateTime(cre, author) {
        if (cre > 0) return 'Created ' + printts(cre, DATETIME_DATE) + ' by ' + author
        else if (cre == 0) return 'DB Not Initialised'
        else return ''
    }

    function getBranchGraphCount(branches, graphs) {
        let str = ''
        if (branches)
            str +=
                Object.keys(branches).length +
                (Object.keys(branches).length > 1 ? ' Branches ' : ' Branch ')
        if (graphs) {
            if (branches) str += ' ~ '
            str +=
                Object.keys(graphs).length + (Object.keys(graphs).length > 1 ? ' Graphs' : ' Graph')
        }
        return str
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }

    //let ri = getRepoInfo()

    if(!branches) return null
    return ( 
        <div>
            <Row>
                <DBFullCard meta={assetRecord}/>               
            </Row>
            <Row>
                <ScopedDetails />               
            </Row>
            <Row>
                <CommitLog />               
            </Row>            
        </div>
    )
}

export const ScopedDetails = () => {

    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref, graphs} = DBContextObj()
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

    //number of commits 
    //size of graph(s)
    //number / types of graphs
    //classes / properties / size
    //documents / instance data / swan
    //load commit Count
    useEffect(() => {
        if(branch && graphs){
            console.log(graphs)
            load_context(branch, ref)
        }
    }, [branch, ref, branches, graphs])
    if(!latest) return null
    return (<LatestUpdates latests={latest} title=" "/>)
}



//<LatestUpdates />
