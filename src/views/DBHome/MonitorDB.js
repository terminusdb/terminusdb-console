import React, {useEffect, useState} from 'react'
import {Row, Col} from 'reactstrap'
import TerminusClient from '@terminusdb/terminusdb-client'
import {DBFullCard} from './DBFullCard'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_DATE, DATETIME_COMPLETE} from '../../constants/dates'
import {CommitLog} from "./CommitLog"
import {ScopedDetails} from "./ScopedDetails"
import { GiPlainCircle } from 'react-icons/gi';

export const MonitorDB = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {branch, branches, ref} = DBContextObj()

    const [commitCount, setCommitCount] = useState()
    const [latest, setLatest] = useState()
    let dbmeta = woqlClient.get_database() || {}
    const [assetRecord, setAssetRecord] = useState(dbmeta)

    let WOQL = TerminusClient.WOQL

    useEffect(() => {
        load_assets()
    }, [])


    function load_assets(){
        let x = woqlClient.resource("db").substring(0, woqlClient.resource("db").length-1)
        WOQL.lib().assets_overview([x], woqlClient).then((res) => {
            let nstate = res[0]
            let ostate = assetRecord
            var nkstate = {}
            for(var k in ostate){
                nkstate[k] = ostate[k]
            }
            for(var k in nstate){
                nkstate[k] = nstate[k]
            }
            setAssetRecord(nkstate)
        })
    }


    if(!branches) return null
    return (
        <div>
            <Row key="rr">
                <DBFullCard meta={assetRecord} user={woqlClient.user()}/>
            </Row>
            <Row key="rs">
                <ScopedDetails />
            </Row>
            <Row key="rd">
                <CommitLog />
            </Row>
        </div>
    )
}



//<LatestUpdates />
