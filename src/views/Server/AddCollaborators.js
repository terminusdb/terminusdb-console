/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {ADD_COLLABORATORS_FORM} from './constants.server'
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

export const AddCollaborators = ({db, organization, dblist }) => {
    const {bffClient} = WOQLClientObj()
    const [report, setReport] = useState()
    let values = {
        manage: '',
        read: '',
        write: '',
        users: '',
    }

    const [loading, setLoading] = useState()

    let nfields = []
    ADD_COLLABORATORS_FORM.fields.map((item) => {
        if(item.id == "database"){
            item.inputElement.options = getDBOptions()
        }
        nfields.push(item)
    })

    function getDBOptions(){
        let opts = []
        for(var i = 0; i<dblist.length; i++){
            let ent = {
                value: dblist[i].organization + "/" + dblist[i].id,
                label: dblist[i].label + " (" + dblist[i].organization + "/" + dblist[i].id + ")"
            }
            opts.push(ent)
        }
        return opts
    }

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
        let users = parseBox(deets.users)
        let resource = deets.database
        let db = resource.split("/")[1]
        let org = resource.split("/")[0]
        let invitation = deets.invitation
        if(users.length == 1) users = users[0]
        let doc = {agent_names: users, database_name: db, organization_name: org, actions: [deets.permission], invitation: invitation}
        return doc
    }

    function createCollaborators(deets) {
        if (deets.users) {
            setLoading(true)
            let udoc = _form_document(deets)
            bffClient.updateRoles(udoc)
            .then((result) => {
                let msg = ""
                if(result.collaborators && result.collaborators.length || result.invites && result.invites.length){
                    msg += "Successfully added collaborators:"
                    msg += result.collaborators ? result.collaborators.length + " Existing Users Added " : ""
                    msg += result.invites ? result.invites.length + " New Users Invited" : ""
                    setReport({status: TERMINUS_SUCCESS, message: msg})
                }
                else {
                    msg = "No valid collaborators were supplied - no change"
                    setReport({status: TERMINUS_WARNING, message: msg})
                }
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
    if (loading) return <Loading />
    return (
        <>
            {report && <TerminusDBSpeaks report={report} />}
            <TCForm
                onSubmit={createCollaborators}
                layout={[2, 1, 1]}
                fields={nfields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
