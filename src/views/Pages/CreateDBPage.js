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
import {TabbedPageView} from '../Templates/TabbedPageView'

import {SimplePageView} from '../Templates/SimplePageView'
import {CreateDatabase} from '../CreateDB/CreateDatabase'
import TerminusClient from '@terminusdb/terminusdb-client'
import {ConsoleTutorials} from '../Server/ConsoleTutorials'
import {DBListControl} from "../Server/DBListControl"
import {Collaborators} from "../Server/Collaborators"
import {HomeMainMenu} from "../../components/Navbar/HomeMainMenu"

/**
 * Server home is the launch screen to the local experience
 *
 * Currently it has a simple functional role
 * 1. Show the user any modal messages that they must respond to before continuing (e.g. upgrades, identity, improper configuration....)
 * 2. Show the user their databases on the server
 * 3. Show the user the list of users of the server (if they have permissions)
 *
 */

const CreateDBPage = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    let user = woqlClient.user()

    return (
        <SimplePageView id="createpage" >
            <HomeMainMenu/>
            <CreateDatabase/>
        </SimplePageView>
    )
}

export default CreateDBPage
