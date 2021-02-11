/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {ADD_USER_FORM} from '../Server/constants.server'
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

export const AddUser = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        uid: '',
        password: '',
        commitlog: '',
        display: '',
        notes: '',
    }

    const [loading, setLoading] = useState()

    function _form_document(deets) {
        let doc = {
            "agent_name" : deets.uid,
            "password" : deets.password,
            "user_identifier" : deets.commitlog,
            "comment" : deets.notes 
         }
        //doc['@type'] = 'system:User'
        //doc['system:agent_name'] = { "@type": "xsd:string", "@value": deets.uid}
        //if(deets.password) doc['system:password'] = { "@type": "xsd:string", "@value": deets.password}
        //if(deets.display) doc['rdfs:label'] = { "@type": "xsd:string", "@value": deets.display}
        //if(deets.notes) doc['rdfs:comment'] = { "@type": "xsd:string", "@value": deets.notes}
        //if(deets.commitlog) doc['system:user_identifier'] = { "@type": "xsd:string", "@value": deets.commitlog} 
        return doc
    }

    function createUser(deets) {
        if (deets.uid && deets.password && deets.commitlog) {
            setLoading(true)
            let udoc = _form_document(deets)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.setSystemDb()
            tClient.createUser(deets.uid, udoc)
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

    let buttons = ADD_USER_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={createUser}
                layout={[2, 2, 1]}
                fields={ADD_USER_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
