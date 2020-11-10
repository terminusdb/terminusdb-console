import React, {useEffect, useState} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {LatestUpdates} from '../Tables/LatestUpdates'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'

export const CommitLog = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref, consoleTime, prefixes} = DBContextObj()
    const [latest, setLatest] = useState()

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

    function load_commit_log(b, r){
        let WOQL = TerminusClient.WOQL
        let q = WOQL.query()
        if(r){
            q = WOQL.lib().commit_history(r, LATEST_UPDATES_LENGTH)
        }
        else {
            q = WOQL.and(
                    WOQL.lib().active_commit_id(b, false, "Active ID"),
                    WOQL.lib().commit_history("v:Active ID", LATEST_UPDATES_LENGTH)
                )
        }
        let woql = WOQL.select("v:Author", "v:Commit ID", "v:Message", "v:Time", q)
        woqlClient.query(woql).then((result) => {
            if (result.bindings) setLatest(result)
        })
    }

    useEffect(() => {
        if(branch){
            load_commit_log(branch, ref)
        }
    }, [branch, ref, branches])

    if(!latest) return null
    return (<LatestUpdates result={latest} title={getLatestTitle()} prefixes={prefixes}/>)
}
