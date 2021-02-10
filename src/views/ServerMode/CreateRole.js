/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {CREATE_ROLE_FORM} from '../Server/constants.server'
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

export const CreateRole = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        roleid: '',
        label: '',
        description: '',
    }

    const [loading, setLoading] = useState()

    function addRole(deets) {
        setLoading(true)
        let tClient = woqlClient.copy() //do not change internal client state
        tClient.setSystemDb()
        let rid = ( (deets.roleid.indexOf(":") == -1) ? "doc:" + deets.roleid : deets.roleid )
        let woql = TerminusClient.WOQL.lib().add_role(rid, deets.label, deets.description)
        woql.execute(tClient)
            .then(() => setReport({status: TERMINUS_SUCCESS, message: 'Successfully Created Role'}) )
            .catch((err) => {
                setReport({
                    message: 'Failed to Create Role',
                    status: TERMINUS_ERROR,
                    error: err,
                })
            })
            .finally(() => setLoading(false))
    }

    let buttons = CREATE_ROLE_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={addRole}
                layout={[2, 1]}
                fields={CREATE_ROLE_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
