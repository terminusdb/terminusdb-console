import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {FAILED_LOADING_USERS} from './constants.server'
import {TERMINUS_COMPONENT, TERMINUS_ERROR} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {UserList} from '../Tables/UserList'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'

export const Users = (props) => {
    const {woqlClient} = WOQLClientObj()

    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [users, setUsers] = useState()

    const woql = TerminusClient.WOQL.lib().users()
    woql.context(woqlClient.connection.getSystemContext())

    useEffect(() => {
        setLoading(true)
        let tClient = woqlClient.copy() //do not change internal client state
        tClient.set_system_db()
        woql.execute(tClient)
            .then((result) => {
                if (result && result.bindings) setUsers(result.bindings)
            })
            .catch((e) => {
                setReport({status: TERMINUS_ERROR, message: FAILED_LOADING_USERS, error: e})
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="">
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {report && <TerminusDBSpeaks report={report} />}
            {users && <UserList query={woql} users={users} />}
        </div>
    )
}
