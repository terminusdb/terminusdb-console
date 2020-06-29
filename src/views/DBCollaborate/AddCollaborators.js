/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {ADD_COLLABORATORS_FORM} from './constants.dbcollaborate'
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
import { DB_DETAILS_FORM } from '../CreateDB/constants.createdb'

export const AddCollaborators = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        manage: '',
        read: '',
        write: '',
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

    function _form_document(deets) {
        let actions = []
        let roles = {}
        if(deets.read){
            actions.push('system:clone')
            actions.push('system:fetch')
            actions.push('system:pull')
        }
        if(deets.write){
            actions.push('system:clone')
            actions.push('system:push')
        }
        if(deets.manage){
            actions.push('system:manage_capabilities')
        }
        
        roles['@type'] = 'system:Role'
        roles['system:capability'] = {
            '@type': 'system:Capability',
            'system:action': actions,
            'system:capability_scope': {'@type': 'xsd:string', '@value': woqlClient.db()}
        }
        let users = parseBox(deets.users)
        if(users.length == 1) users = users[0]
        let doc = {users: users, roles: roles}
        return doc
    }

    function createCollaborators(deets) {
        if (deets.users) {
            setLoading(true)
            let udoc = _form_document(deets)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.set_system_db()
            if(props.client){
                tClient = props.client
            }
            tClient.updateRoles(udoc.users, woqlClient.db(), udoc.roles, woqlClient.organization())
            .then((result) => {
                setReport({status: TERMINUS_SUCCESS, message: 'Successfully Created Collaborators'})
            })
            .catch((err) => {
                setReport({
                    message: 'Failed to create collaborators',
                    status: TERMINUS_ERROR,
                    error: err,
                })
            })
            .finally(() => setLoading(false))
        }
    }

    let buttons = ADD_COLLABORATORS_FORM.buttons
    buttons.onCancel = props.onCancel
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={createCollaborators}
                layout={[3, 1]}
                fields={ADD_COLLABORATORS_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
