import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import { WOQLClientObj } from '../../init/woql-client-instance'
import { Organization } from './Organization'
import { APIUpdateReport } from '../../components/Reports/APIUpdateReport'
import { useAuth0 } from '../../react-auth0-spa'

export const Collaborators = ({}) => {

    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    let user = woqlClient.user()
    const { getTokenSilently } = useAuth0();
    

    function createOrg(doc) {
        //should really come from form
        CreateOrganization(doc, bffClient, getTokenSilently)
        .then((bla) => {
            alert(JSON.stringify(bla))
        })
        .catch((err) => process_error(err, update_start, clone_remote_failure(doc.label, doc.id)))
        .finally(() => setLoading(false))            
    }    

    return (<Organization onUpdate={createOrg}/>)
}


