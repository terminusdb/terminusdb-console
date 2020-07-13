/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {
    SETUP_FORM,
    COMMIT_LOG_EXPLANATION_CSS,
    COMMIT_LOG_EXPLANATION,
    ADMIN_ACCOUNT_NOTES,
    FAILED_CREATING_ADMIN,
    CREATED_ADMIN_MESSAGE,
} from '../Server/constants.server'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {
    ACCESS_FAILURE,
    TERMINUS_COMPONENT,
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TCForm} from '../../components/Form/FormComponents'
import {goServerHome} from '../../components/Router/ConsoleRouter'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'

export const SetUpFirstUser = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        adminid: '',
        password: '',
        display: '',
        commitlog: '',
    }

    const [loading, setLoading] = useState()

    function createAdminUser(deets) {
        if (deets.adminid && deets.password && deets.commitlog) {
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.db('terminus')

            let note = ADMIN_ACCOUNT_NOTES + Date.now()
            TerminusClient.WOQL.lib()
                .add_user(deets.adminid, [deets.commitlog, note, deets.password])
                .execute(tClient)
                .then((result) => {
                    let rep = {status: TERMINUS_SUCCESS, message: CREATED_ADMIN_MESSAGE}
                    afterCreate(deets.adminid, deets.password, rep)
                })
                .catch((err) => {
                    setReport({message: FAILED_CREATING_ADMIN, status: TERMINUS_ERROR, error: err})
                })
                .finally(() => setLoading(false))
        }
    }

    function afterCreate(id, key, rep) {
        woqlClient.connect({user: id, key: key}).then((result) => {
            goServerHome(rep)
        })
    }

    let buttons = SETUP_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && report.error && <TerminusDBSpeaks report={report} />}
            <div className={COMMIT_LOG_EXPLANATION_CSS}>{COMMIT_LOG_EXPLANATION}</div>
            <TCForm
                onSubmit={createAdminUser}
                layout={[3, 1]}
                fields={SETUP_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
