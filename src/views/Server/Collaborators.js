import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import { WOQLClientObj } from '../../init/woql-client-instance'
import { Organization } from './Organization'
import { APIUpdateReport } from '../../components/Reports/APIUpdateReport'
import { UpdateOrganization } from '../../components/Query/CollaborateAPI'
import { useAuth0 } from '../../react-auth0-spa'

export const Collaborators = ({}) => {

    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    let user = woqlClient.user()
    const { getTokenSilently } = useAuth0()
    const [loading, setLoading] = useState()
    
    function createOrgu(doc) {
        let d = {
            organization_name: "xxx23",
            organization_database: [],
            organization_child: []
        }
        woqlClient.createOrganization("xxx23", d)
    }


    function createOrg(doc) {
        //should really come from form
        doc.status = "active"
        doc.create = true
        UpdateOrganization(doc, bffClient, getTokenSilently)
        .then((bla) => {
            alert(JSON.stringify(bla))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))            
    }    

    return (<Organization onUpdate={createOrgu}/>)
}


