/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {GRANT_FORM} from '../Server/constants.server'
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

export const GrantRole = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        uiri: '',
        roleid: '',
    }

    const [loading, setLoading] = useState()

    function grant(deets) {
        if (deets.uiri && deets.roleid) {
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.setSystemDb()
            let rid = ( (deets.roleid.indexOf(":") == -1) ? "doc:" + deets.roleid : deets.roleid )
            let uid = ( (deets.uiri.indexOf(":") == -1) ? "doc:" + deets.uiri : deets.uiri )
            TerminusClient.WOQL.lib()
                .grant_role(uid, rid)
                .execute(tClient)
                .then((result) => {
                    setReport({status: TERMINUS_SUCCESS, message: 'Successfully Granted'})
                })
                .catch((err) => {
                    setReport({
                        message: 'Failed to Grant Capability',
                        status: TERMINUS_ERROR,
                        error: err,
                    })
                })
                .finally(() => setLoading(false))
        }
    }

    let buttons = GRANT_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={grant}
                layout={[2]}
                fields={GRANT_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
