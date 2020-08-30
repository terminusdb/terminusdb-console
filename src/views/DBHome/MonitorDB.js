import React, {useEffect, useState} from 'react'
import {Row, Col} from 'reactstrap'
import TerminusClient from '@terminusdb/terminusdb-client'
import {DBFullCard} from './DBFullCard'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {CommitLog} from "./CommitLog"
import {ScopedDetails} from "./ScopedDetails"
import { CloneLocal } from "../CreateDB/CloneDatabase"
import { goDBHome } from '../../components/Router/ConsoleRouter'

export const MonitorDB = (props) => {
    const {woqlClient, refreshDBRecord} = WOQLClientObj()
    const {branches, updateBranches} = DBContextObj()

    const [cloning, setCloning] = useState()
    let dbmeta = woqlClient.get_database() || {}
    const [assetRecord, setAssetRecord] = useState(dbmeta)

    let WOQL = TerminusClient.WOQL

    useEffect(() => {
        if(branches) load_assets()
    }, [branches])


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

    function toggle(){
        setCloning(!cloning)
    }

    function onClone(id, org, doc){
        setCloning(false)
        let oldie = woqlClient.get_database()
        let nu = {
            id: id,
            organization: org,
            label: doc.label,
            comment: doc.comment,
            type: "local_clone"
        }
        nu.remote_record = oldie;
        let dbs = woqlClient.databases()
        dbs.push(nu)
        let ostate = assetRecord
        var nkstate = {}
        for(var k in ostate){
            if(k == "label" || k == "id" || k == "comment") nkstate[k] = nu[k]
            else nkstate[k] = ostate[k]
        }
        refreshDBRecord(id, org).then(() => {
            goDBHome(id, org)
            updateBranches()
            woqlClient.db(id)
            setAssetRecord(woqlClient.get_database())
        })
    }

    if(!branches) return null
    return (
        <div>
            <Row key="rr">
                <DBFullCard meta={assetRecord} onClone={toggle} user={woqlClient.user()}/>
            </Row>
            {cloning && 
                <Row key="rc">
                    <CloneLocal onClone={onClone} meta={assetRecord} onCancel={toggle} woqlClient={woqlClient}/>
                </Row>
            }
            {!cloning && <>
                <Row key="rs">
                    <Col>
                        <ScopedDetails />
                    </Col>                   
                </Row>
                <Row key="rd">
                    <CommitLog />
                </Row>
            </>}
        </div>
    )
}

//<LatestUpdates />
