/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {REVOKE_FORM} from './constants.server'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {
    ACCESS_FAILURE,
    TERMINUS_COMPONENT,
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TCForm} from '../../components/Form/FormComponents'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'

export const RevokeRole = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        uid: '',
        roleid: '',
    }

    const [loading, setLoading] = useState()

    function revoke(deets) {
        if (deets.uid && deets.roleid) {
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.setSystemDb()
            let rid = ( (deets.roleid.indexOf(":") == -1) ? "doc:" + deets.roleid : deets.roleid )
            let uid = ( (deets.uid.indexOf(":") == -1) ? "doc:" + deets.uid : deets.uid )
            TerminusClient.WOQL.lib()
                .revoke_role(uid, rid)
                .execute(tClient)
                .then((result) => {
                    setReport({status: TERMINUS_SUCCESS, message: 'Successfully Revoked'})
                })
                .catch((err) => {
                    setReport({
                        message: 'Failed to Revoke Capability',
                        status: TERMINUS_ERROR,
                        error: err,
                    })
                })
                .finally(() => setLoading(false))
        }
    }

    let buttons = REVOKE_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={revoke}
                layout={[2]}
                fields={REVOKE_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
