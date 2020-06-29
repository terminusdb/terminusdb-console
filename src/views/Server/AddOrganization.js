/* eslint-disable prettier/prettier */
/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {ADD_ORGANIZATION_FORM} from './constants.server'
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

export const AddOrganization = () => {
    const {woqlClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        oid: '',
        display: '',
        notes: '',
        children: '',
        databases: '',
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

    function _form_document(deets) {
        let doc = {}
        doc['@type'] = 'system:Organization'
        doc['system:resource_name'] = { "@type": "xsd:string", "@value": deets.oid}
        if(deets.display) doc['rdfs:label'] = { "@type": "xsd:string", "@value": deets.display}
        if(deets.notes) doc['rdfs:comment'] = { "@type": "xsd:string", "@value": deets.notes}
        let kids = parseBox(deets.children)
        if(kids && kids.length) {
            doc['organization_child'] = kids
            //doc['organization_child'] = kids.map((item) => {
            //    return {'@type': 'system:Organization', '@id': item}
            //})
        }
        let dbs = parseBox(deets.databases)
        if(dbs && dbs.length){
            doc['organization_database'] = dbs
            //dbs.map((item) => {
            //    return {'@type': 'system:Database', '@id': item}
            //})
        } 
        return doc
    }


    function createOrganization(deets) {
        if (deets.oid) {
            setLoading(true)
            let odoc = _form_document(deets)
            let tClient = woqlClient.copy() //do not change internal client state
            tClient.set_system_db()
            tClient.createOrganization(deets.oid, odoc)
            .then((result) => {
                setReport({status: TERMINUS_SUCCESS, message: 'Successfully Created New Organization'})
            })
            .catch((err) => {
                setReport({
                    message: 'Failed to create organization',
                    status: TERMINUS_ERROR,
                    error: err,
                })
            })
            .finally(() => setLoading(false))
        }
    }

    let buttons = ADD_ORGANIZATION_FORM.buttons
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={createOrganization}
                layout={[2, 2, 1]}
                fields={ADD_ORGANIZATION_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
