import React from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import {Collaborators} from "../Server/Collaborators"

const CollaboratePage = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let user = woqlClient.user()
    
    return (
        <SimplePageView id="collaboratepage" >
            <Collaborators user={user} />
        </SimplePageView>
    )
}

export default CollaboratePage
