/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {
    COMMIT_LOG_FORM,
    SETUP_FORM,
    COMMIT_LOG_EXPLANATION_CSS,
    JUST_COMMIT_LOG_EXPLANATION,
    ADMIN_organization_NOTES,
    FAILED_CREATING_ADMIN,
    CREATED_ADMIN_MESSAGE,
} from './constants.server'
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

export const AddUserCommitLogID = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        commitlog: '',
    }

    const [loading, setLoading] = useState()

    let WOQL = TerminusClient.WOQL

    function addCommitLogID(deets) {
        if (deets.commitlog) {
            let q = WOQL.when(
                WOQL.triple('v:User IRI', 'terminus:agent_name', woqlClient.user_organization()),
            ).add_triple('v:User IRI', 'terminus:commit_log_id', deets.commitlog)
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.db('system')
            q.execute(tClient)
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

    function afterCreate(rep) {
        woqlClient.connect().then((result) => {
            goServerHome(rep)
        })
    }

    let buttons = COMMIT_LOG_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && report.error && <TerminusDBSpeaks report={report} />}
            <div className={COMMIT_LOG_EXPLANATION_CSS}>{JUST_COMMIT_LOG_EXPLANATION}</div>
            <TCForm
                onSubmit={addCommitLogID}
                layout={[3, 1]}
                fields={COMMIT_LOG_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
