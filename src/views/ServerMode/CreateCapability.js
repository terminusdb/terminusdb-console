/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {CREATE_CAP_FORM} from '../Server/constants.server'
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

export const CreateCapability = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        capid: '',
        label: '',
        resources: '',
        permissions: '',
        description: '',
    }

    const [loading, setLoading] = useState()

    function parseBox(ip) {
        let bits = ip.split(',')
        let cleaned = []
        bits.map((item) => {
            let str = item.trim()
            if (str.length > 4) cleaned.push(str)
        })
        return cleaned
    }

    function createCap(deets) {
        let perms = parseBox(deets.permissions)
        let res = parseBox(deets.resources)
        if (perms.length && res.length) {
            setLoading(true)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.setSystemDb()
            TerminusClient.WOQL.lib()
                .add_capability(deets.capid, perms, res, deets.label, deets.description)
                .execute(tClient)
                .then((result) => {
                    setReport({status: TERMINUS_SUCCESS, message: 'Successfully Created Access'})
                })
                .catch((err) => {
                    setReport({
                        message: 'Failed to Create Access',
                        status: TERMINUS_ERROR,
                        error: err,
                    })
                })
                .finally(() => setLoading(false))
        }
    }

    let buttons = CREATE_CAP_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={createCap}
                layout={[2, 2, 1]}
                fields={CREATE_CAP_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
