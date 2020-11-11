import React, {useEffect, useState} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {ControlledTable} from '../Tables/ControlledTable'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'
import {Row, Col} from "reactstrap"

export const CommitLog = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref, consoleTime, prefixes} = DBContextObj()
    const [query, setQuery] = useState()

    let limit = LATEST_UPDATES_LENGTH

    function getLatestTitle(){
        let tstr = ""
        if(ref){
            tstr += "Updates before " + printts(consoleTime, DATETIME_COMPLETE) 
        }
        if(branches) {
            let bstr = ""
            if(Object.keys(branches).length > 1){
                bstr = " on " + branch + " branch"
            }
            if(tstr && bstr){
                return tstr + bstr
            }
            else if(tstr) return tstr
            else return "Latest Updates" + bstr
        }

    }

    function get_query(b, r){
        let WOQL = TerminusClient.WOQL
        let q = WOQL.query()
        if(r){
            q = WOQL.lib().commit_history(r)
        }
        else {
            q = WOQL.and(
                WOQL.lib().active_commit_id(b, false, "Active ID"),
                WOQL.lib().commit_history("v:Active ID")
            )
        }
        let woql = WOQL.select("v:Author", "v:Commit ID", "v:Message", "v:Time", q)
        return woql;
        woqlClient.query(woql).then((result) => {
            if (result.bindings) setLatest(result)
        })
    }

    useEffect(() => {
        if(branch){
            setQuery(get_query(branch, ref))
        }
    }, [branch, ref, branches])
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Time", "Author", "Commit ID", "Message")
    tabConfig.column("Time").width(180)
    tabConfig.column("Message").width(300)
    tabConfig.pager("remote")
    tabConfig.pagesize(limit)
    if(!query) return null
    return (<Row className="update-list">
        <div className="sub-headings latest-update-heading">{getLatestTitle()}</div>
        <div style={{width: "100%"}}>
            <ControlledTable hook="auto" limit={limit} query={query} view={tabConfig} prefixes={prefixes} /> 
        </div>
    </Row>)
}

