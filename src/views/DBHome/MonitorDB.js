import React, {useEffect, useState} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {Row, Col} from 'reactstrap'
import {DetailsCard} from './DetailsCard'
import * as icons from '../../constants/faicons'
import TerminusClient from '@terminusdb/terminusdb-client'
import {LatestUpdates} from '../Tables/LatestUpdates'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'

import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts, DATETIME_DATE, DATETIME_COMPLETE} from '../../constants/dates'
import {LATEST_UPDATES_LENGTH} from './constants.dbhome'

export const MonitorDB = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {graphs, branch, branches, DBInfo, ref, consoleTime, repos, scale} = DBContextObj()

    const [commitCount, setCommitCount] = useState()
    const [latest, setLatest] = useState()

    let WOQL = TerminusClient.WOQL
    let ts = consoleTime || Date.now() / 1000

    let latest_woql = false

    //load commit Count
    useEffect(() => {
        let w = WOQL.using('_commits').triple('v:A', 'type', 'ref:ValidCommit')
        woqlClient.query(w).then((result) => {
            if (result.bindings) setCommitCount(result.bindings.length)
        })
    }, [])

    //load commit Count
    useEffect(() => {
        let vals = consoleTime ? WOQL.not().greater('v:Time', String(consoleTime)) : false
        let q = WOQL.lib().commits()
        if (vals) q.and(vals)
        latest_woql = WOQL.limit(LATEST_UPDATES_LENGTH)
            .select('v:Time', 'v:Author', 'v:Message')
            .order_by('v:Time desc', q)
        woqlClient.query(latest_woql).then((result) => {
            if (result.bindings) setLatest(result.bindings)
        })
    }, [consoleTime])

    const db_uri = woqlClient.connectionConfig.cloneableURL()

    function getCommitInfo() {
        let str = ''
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

    let ri = getRepoInfo()

    return (
        <div>
            <hr className="my-space-50" />
            <hr className="my-space-50" />
            <hr className="my-space-50" />

            <Row>
                <Col md={3} className="mb-3 dd-c">
                    <DetailsCard
                        title={woqlClient.db()}
                        main={getCurrentDBName()}
                        subTitle={
                            ' ' + (DBInfo ? showCreateTime(DBInfo.created, DBInfo.author) : '...')
                        }
                        info={getCurrentDbDescr()}
                    />
                </Col>

                <Col md={3} className="mb-3 dd-c">
                    <DetailsCard
                        icon={icons.COMMIT}
                        title="Commits"
                        main={commitCount}
                        subTitle={
                            branches || graphs ? getBranchGraphCount(branches, graphs) : '...'
                        }
                        info={getCommitInfo()}
                    />
                </Col>

                <Col md={3} className="mb-3 dd-c">
                    <DetailsCard
                        icon={icons.USERS}
                        title="User"
                        main=" 1 "
                        subTitle="Desktop Client"
                        info="Desktop users can add collaborators to their databases through TerminusDB hub"
                    />
                </Col>

                <Col md={3} className="mb-3 dd-c">
                    <DetailsCard
                        icon={icons.ORIGIN}
                        title={ri.title}
                        main={ri.type}
                        info={ri.info}
                        subTitle={ri.sub}
                    />
                </Col>
            </Row>
            {latest && <LatestUpdates latests={latest} query={latest_woql} />}
        </div>
    )
}

//<LatestUpdates />
