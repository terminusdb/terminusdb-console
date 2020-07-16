import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {FAILED_LOADING_USERS} from './constants.server'
import {TERMINUS_COMPONENT, TERMINUS_ERROR} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {UserCapabilityList} from '../Tables/UserCapabilityList'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'

export const UserRoles = (props) => {
    const {woqlClient} = WOQLClientObj()

    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [bindings, setBindings] = useState()

    const woql = TerminusClient.WOQL.lib().user_roles()
    woql.context(woqlClient.connection.getSystemContext())

    useEffect(() => {
        setLoading(true)
        let tClient = woqlClient.copy() //do not change internal client state
        tClient.set_system_db()
        woql.execute(tClient)
            .then((result) => {
                if (result && result.bindings) setBindings(result.bindings)
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
            {bindings && <UserCapabilityList query={woql} capabilities={bindings} />}
        </div>
    )
}
