import React, {useEffect, useState} from 'react'
import {
    CLONEDBS
} from './constants.pages'

import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import {DBListControl} from "../Server/DBListControl"

const ClonePage = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let user = woqlClient.user()
   
    return (
        <SimplePageView  id="clonePage" >
            <DBListControl  list={CLONEDBS} type='clone' user={user} count={CLONEDBS.length}/>
        </SimplePageView>
    )
}

export default ClonePage
