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
import {CreateDatabase} from '../CreateDB/CreateDatabase'
import TerminusClient from '@terminusdb/terminusdb-client'
import {ConsoleTutorials} from '../Server/ConsoleTutorials'
import {DBListControl} from "../Server/DBListControl"
import {Collaborators} from "../Server/Collaborators"

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

    let showlist = woqlClient.user_databases().length

    useEffect(() => {
        if(woqlClient){
            setMyDBs(woqlClient.databases())
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

    let hasTutorials = false;//user.logged_in
    if (showlist) {
        sections.push({id: "mydbs", className: DBLIST_HEADER_CSS, label: DBLIST_TITLE})
        tabs.push(<DBListControl key="dbl" type='my' list={myDBs} user={user} />)
    }
    if(user.logged_in){
        sections.push({id: "clonedb", className: DBLIST_HEADER_CSS, label: CLONEDB_TITLE})
        tabs.push(<DBListControl key="dbl2" list={CLONEDBS} type='clone' user={user} />)
        sections.push({id: "createdb", className: DBLIST_HEADER_CSS, label: CREATEDB_TITLE})
        tabs.push(<CreateDatabase key="createpage" />)
      // sections.push({id: "collaborate", className: DBLIST_HEADER_CSS, label: COLLABORATE_TITLE})
       // tabs.push(<Collaborate key="collaboratepage" />)
    }
    else {
        sections.push({id: "createpage", className: DBLIST_HEADER_CSS, label: CREATEDB_TITLE})
        tabs.push(<CreateDatabase key="createpage" />)
    }
    if (hasTutorials) {
        sections.push({id: "tutorials",  className: TUTORIALS_CSS, label: TUTORIALS_TITLE})
        tabs.push(<ConsoleTutorials key="tutorials" />)
    }
    return (
        <TabbedPageView type='major' id="home" active={active} sections={sections}>
            {tabs}
        </TabbedPageView>
    )
}

export default ServerHome
