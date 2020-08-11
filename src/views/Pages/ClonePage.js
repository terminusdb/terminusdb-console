import React, {useEffect, useState} from 'react'
import {
    CREATEDB_TITLE,
    DBLIST_TITLE,
    CLONEDB_TITLE,
    DBLIST_HEADER_CSS,
    TUTORIALS_CSS,
    CLONEDBS,
    TUTORIALS_TITLE,
    COLLABORATE_TITLE
} from './constants.pages'

import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import {DBListControl} from "../Server/DBListControl"
import {HomeMainMenu} from "../../components/Navbar/HomeMainMenu"


const ClonePage = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let user = woqlClient.user()
   
    return (
        <SimplePageView  id="clonePage" >
            <HomeMainMenu/>
            <DBListControl  list={CLONEDBS} type='clone' user={user} count={CLONEDBS.length}/>
        </SimplePageView>
    )
}

export default ClonePage
