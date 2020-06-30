/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {REMOVE_COLLABORATORS_FORM} from './constants.dbcollaborate'
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

export const RemoveCollaborators = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        users: '',
    }

    const [loading, setLoading] = useState()

    function parseBox(ip) {
        let bits = ip.split(',')
        let cleaned = []
        bits.map((item) => {
            let str = item.trim()
            if (str.length > 1) cleaned.push(str)
        })
        return cleaned
    }

    function removeCollaborators(deets) {
        let users = parseBox(deets.users)
        if (users) {
            if(users.length == 1) users = users[0]
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.set_system_db()
            if(props.client){
                tClient = props.client
            }
            tClient.updateRoles(users, woqlClient.db(), [], woqlClient.organization())
            .then((result) => {
                setReport({status: TERMINUS_SUCCESS, message: 'Successfully Created New User'})
            })
            .catch((err) => {
                setReport({
                    message: 'Failed to create user',
                    status: TERMINUS_ERROR,
                    error: err,
                })
            })
            .finally(() => setLoading(false))
        }
    }

    let buttons = REMOVE_COLLABORATORS_FORM.buttons
    buttons.onCancel = props.onCancel

    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={removeCollaborators}
                layout={[1]}
                fields={REMOVE_COLLABORATORS_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
