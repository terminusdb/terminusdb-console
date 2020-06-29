import React, {useEffect, useState} from 'react'
import {
    CREATEDB_TITLE,
    DBLIST_TITLE,
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
import {SimplePageView} from '../Templates/SimplePageView'
import {TabbedPageView} from '../Templates/TabbedPageView'
import {CreateDatabase} from '../CreateDB/CreateDatabase'
import {DBList} from '../Tables/DBList'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {AddUserCommitLogID} from '../Server/AddUserCommitLogID'
import {SetUpFirstUser} from '../Server/SetUpFirstUser'
import {ConsoleTutorials} from '../Server/ConsoleTutorials'
import {ManageServer} from '../Server/ManageServer'
import {ManageUsers} from '../Server/ManageUsers'
import { useAuth0 } from "../../react-auth0-spa";

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

    const { loading, user } = useAuth0();

    let [modal, setModal] = useState(false)
    let [error, setError] = useState(false)

    const {woqlClient} = WOQLClientObj()
    const localdbs = woqlClient.user_databases()
    const dblist = addLocalDBs(localdbs) 
    const canCreate = woqlClient.action_permitted('create_database', woqlClient.user_organization())

    function addLocalDBs(dbs) {
        return dbs
    }

    function getUserAuthor(){
        if(user){
            return user.name
        }
        let luser = woqlClient.getUser()
        return luser.author
    }

    useEffect(() => {
        if (user) {
            //add remote databases   
        }
        else if(!loading) {

        }
    }, [user, loading])

    let hasTutorials = true
    let canManageUsers = true
    let canManageServer = true
    let sections = []
    let tabs = []
    let author = getUserAuthor()
    if (!author) {
        sections.push({className: ADD_COMMIT_ID_CSS, label: ADD_COMMIT_ID_TITLE})
        tabs.push(<AddUserCommitLogID key="addcommitid" />)
    }
    if (dblist.length > 0) {
        sections.push({className: DBLIST_HEADER_CSS, label: DBLIST_TITLE})
        tabs.push(<DBList key="dbl" list={dblist} />)
    }
    if (canCreate) {
        sections.push({className: CREATE_FIRSTDB_CSS, label: CREATEDB_TITLE})
        tabs.push(<CreateDatabase key="createpage" />)
    }
    if (hasTutorials) {
        sections.push({className: TUTORIALS_CSS, label: TUTORIALS_TITLE})
        tabs.push(<ConsoleTutorials key="tutorials" />)
    }
    //turn off regular admin until user adds first db... we want them to do that...
    if (dblist.length > 0) {
        if (canManageUsers) {
            sections.push({className: MANAGE_USERS_CSS, label: MANAGE_USERS_TITLE})
            tabs.push(<ManageUsers key="manageusers" />)
        }
        if (canManageServer) {
            sections.push({className: MANAGE_SERVER_CSS, label: MANAGE_SERVER_TITLE})
            tabs.push(<ManageServer key="manageserver" />)
        }
    }
    if (loading) return <Loading />
    if (modal) {
        return (
            <SimplePageView>
                <div className={MANAGE_SERVER_CSS}>{CREATE_FIRSTUSER}</div>
                <SetUpFirstUser />
            </SimplePageView>
        )
    }
    if (error) {
        return <TerminusDBSpeaks failure={CONNECTION_FAILURE} report={error} />
    }

    if (sections.length == 1)
        return (
            <SimplePageView>
                <div className={sections[0].className}>{sections[0].title}</div>
                {tabs}
            </SimplePageView>
        )
    let active = props.page
    return (
        <TabbedPageView id="home" active={active} sections={sections}>
            {tabs}
        </TabbedPageView>
    )
}

export default ServerHome
