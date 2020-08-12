import React, {useEffect, useState} from 'react';
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import TerminusClient from '@terminusdb/terminusdb-client'
import {DBListControl} from "../Server/DBListControl"

/**
 * Server home is the launch screen to the local experience
 *
 * Currently it has a simple functional role
 * 1. Show the user any modal messages that they must respond to before continuing (e.g. upgrades, identity, improper configuration....)
 * 2. Show the user their databases on the server
 * 3. Show the user the list of users of the server (if they have permissions)
 *
 */

const ServerHome = (props) => {
    //if we are the only user (admin) and there are no dbs, show the create first user dialogue
    //if we do not have a commit log message set with our current user, show warning / capture
    //if we have some super user permission, we can view the users tab
    //if we are in unitialised step, show the add commit log message
    //if we

    let [myDBs, setMyDBs] = useState(false)

    let active = props.page

    const { woqlClient, contextEnriched } = WOQLClientObj()
    let showlist = woqlClient.databases().length || false

    useEffect(() => {
        if(woqlClient){
            let mdbs = []
            mdbs = woqlClient.databases().map((item) => item)
            setMyDBs(mdbs)
            showlist = mdbs.length || false
        }
    }, [woqlClient, contextEnriched])

    function fixCommitLog(id, email){
        let WOQL = TerminusClient.WOQL 
        let q = WOQL.when( WOQL.triple("v:UIRI", "system:agent_name", id))
            .add_triple("v:UIRI", "system:user_identifier", email) 
        let fixer = woqlClient.copy()
        fixer.set_system_db()
        fixer.query(q)
    }

    let sections = []
    let tabs = []

    let user = woqlClient.user()
    if(user.problem && user.problem == "missing"){
        if(user.logged_in){
            fixCommitLog(user.id, user.author)
        }
    }

    return (
        <SimplePageView type='major' id="home" active={active} sections={sections}>
            <DBListControl key="dbl" type='my' list={myDBs} user={user} count={myDBs.length} />
        </SimplePageView>
    )
}

export default ServerHome
