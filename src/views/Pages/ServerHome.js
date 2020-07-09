import React, {useEffect, useState} from 'react'
import {
    CREATEDB_TITLE,
    DBLIST_TITLE,
    CLONEDB_TITLE,
    CREATE_FIRSTDB_CSS,
    CREATE_FIRSTDB,
    DBLIST_HEADER_CSS,
    CREATE_FIRSTUSER,
    CREATE_FIRSTUSER_CSS,
    FAILED_LOADING_USERS,
    ADD_COMMIT_ID_CSS,
    ADD_COMMIT_ID_TITLE,
    TUTORIALS_CSS,
    TUTORIALS_TITLE,
    MANAGE_USERS_CSS,
    MANAGE_USERS_TITLE,
    MANAGE_SERVER_TITLE,
    MANAGE_SERVER_CSS,
} from './constants.pages'
import {CONNECTION_FAILURE, ACCESS_FAILURE, TERMINUS_ERROR} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TabbedPageView} from '../Templates/TabbedPageView'
import {CreateDatabase} from '../CreateDB/CreateDatabase'
import {CloneDatabase} from '../CreateDB/CloneDatabase'
import {DBList} from '../Tables/DBList'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import TerminusClient from '@terminusdb/terminusdb-client'
import {AddUserCommitLogID} from '../Server/AddUserCommitLogID'
import {ConsoleTutorials} from '../Server/ConsoleTutorials'
import {ManageServer} from '../Server/ManageServer'
import {ManageUsers} from '../Server/ManageUsers'
import { printts } from '../../constants/dates'

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

    let [error, setError] = useState(false)
    let [myDBs, setMyDBs] = useState(false)

    const {woqlClient, contextEnriched } = WOQLClientObj()

    let showlist = woqlClient.user_databases().length


    useEffect(() => {
        if(woqlClient){
            setMyDBs(getDBList())
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

    function getDBList(){
        return woqlClient.databases()
    }

    let sections = []
    let tabs = []

    let user = woqlClient.user()
    if(user.problem && user.problem == "missing"){
        if(user.logged_in){
            fixCommitLog(user.id, user.author)
        }
        else {
          //  sections.push({className: ADD_COMMIT_ID_CSS, label: ADD_COMMIT_ID_TITLE})
          //  tabs.push(<AddUserCommitLogID key="addcommitid" />)
        }
    }


    let hasTutorials = false;//user.logged_in
    let canManageUsers = false;//user.logged_in
    let canManageServer = false;//user.logged_in

    if (showlist) {
        sections.push({className: DBLIST_HEADER_CSS, label: DBLIST_TITLE})
        tabs.push(<DBList key="dbl" list={myDBs} user={user} />)
    }
    if(user.logged_in){
        sections.push({className: DBLIST_HEADER_CSS, label: CLONEDB_TITLE})
        tabs.push(<CloneDatabase key="clone" />)
        sections.push({className: DBLIST_HEADER_CSS, label: CREATEDB_TITLE})
        tabs.push(<CreateDatabase key="createpage" />)
    }
    else {
        sections.push({className: DBLIST_HEADER_CSS, label: CREATEDB_TITLE})
        tabs.push(<CreateDatabase key="createpage" />)
    }
    if (hasTutorials) {
        sections.push({className: TUTORIALS_CSS, label: TUTORIALS_TITLE})
        tabs.push(<ConsoleTutorials key="tutorials" />)
    }
    if (canManageUsers) {
        sections.push({className: MANAGE_USERS_CSS, label: MANAGE_USERS_TITLE})
        tabs.push(<ManageUsers key="manageusers" />)
    }
    if (canManageServer) {
        sections.push({className: MANAGE_SERVER_CSS, label: MANAGE_SERVER_TITLE})
        tabs.push(<ManageServer key="manageserver" />)
    }
    if (error) {
        return <TerminusDBSpeaks failure={CONNECTION_FAILURE} report={error} />
    }
    let active = props.page
    return (
        <TabbedPageView id="home" active={active} sections={sections}>
            {tabs}
        </TabbedPageView>
    )
}

export default ServerHome
