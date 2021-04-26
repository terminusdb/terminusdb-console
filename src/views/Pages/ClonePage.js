import React, {useEffect, useState} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { SimplePageView} from '../Templates/SimplePageView'
import {CloneController} from '../Clone/CloneController'
import {getUserHubDB,getUserCollDB} from '../Clone/cloneUtils'
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks";
import {TERMINUS_ERROR } from "../../constants/identifiers";

//organization action call
const ClonePage = ({organization, db}) => {
    const { woqlClient, remoteComplete , loadingServer} = WOQLClientObj()
    let userObj = woqlClient.user()
    const [hubdbs, setHubDBs] = useState(getUserHubDB(woqlClient, userObj))
    const [collabs, setCollabs] = useState(getUserCollDB(woqlClient, userObj))

    //divided the database by type
    //contextEnriched>0 after the remote data has been merged with the local one
    useEffect(() => {
        if(remoteComplete){
            userObj = woqlClient.user()
            setHubDBs(getUserHubDB(woqlClient, userObj))
            setCollabs(getUserCollDB(woqlClient, userObj))
        }
    }, [remoteComplete])

    return (
        <SimplePageView id="clonePage">
            {!loadingServer && !remoteComplete && 
                <TerminusDBSpeaks report={{status: TERMINUS_ERROR, message: "I can not get the user's roles"}} />
            }
            {remoteComplete && <CloneController organization={organization} db={db} list={hubdbs} collaborations={collabs}/>}
        </SimplePageView>
    )
}

export default ClonePage