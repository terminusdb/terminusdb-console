import React, {useEffect, useState} from 'react'
import {SimplePageView} from '../Templates/SimplePageView'
import {CreateDatabase} from '../CreateDB/CreateDatabase'
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
    return (
        <SimplePageView id="createpage" >
            <CreateDatabase/>
        </SimplePageView>
    )
}

export default CreateDBPage
