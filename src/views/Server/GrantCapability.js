/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {GRANT_CAP_FORM} from './constants.server'
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

export const GrantCapability = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        capid: '',
        roleid: '',
    }

    const [loading, setLoading] = useState()

    function grant(deets) {
        if (deets.roleid && deets.capid) {
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.set_system_db()
            let capid = ( (deets.capid.indexOf(":") == -1) ? "doc:" + deets.capid : deets.capid )
            let roleid = ( (deets.roleid.indexOf(":") == -1) ? "doc:" + deets.roleid : deets.roleid )

            TerminusClient.WOQL.lib()
                .grant_capability(roleid, capid)
                .execute(tClient)
                .then((result) => {
                    setReport({status: TERMINUS_SUCCESS, message: 'Successfully Granted Access'})
                })
                .catch((err) => {
                    setReport({
                        message: 'Failed to Grant Access',
                        status: TERMINUS_ERROR,
                        error: err,
                    })
                })
                .finally(() => setLoading(false))
        }
    }

    let buttons = GRANT_CAP_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={grant}
                layout={[2]}
                fields={GRANT_CAP_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
