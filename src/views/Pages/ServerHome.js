import React, {useEffect, useState} from 'react';
import {WOQLClientObj} from '../../init/woql-client-instance'
import {SimplePageView} from '../Templates/SimplePageView'
import TerminusClient from '@terminusdb/terminusdb-client'
import {DBListControl} from "../Server/DBListControl"
import {useAuth0} from '../../react-auth0-spa'

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
    const { user:auth0User } = useAuth0();
    let [myDBs, setMyDBs] = useState(false)
    
    //review I don't know maybe we have to remove
    let active = props.page

    const { woqlClient} = WOQLClientObj()

    /*
    * you have to test if the user is logged
    * add the user fix the problem if I log in and after log out???
    */
    useEffect(() => {
        if(woqlClient){
            setMyDBs(woqlClient.databases())
        }
    }, [woqlClient])

    if(!woqlClient) return null
    let showlist = (woqlClient ? woqlClient.databases().length : false)

    //to review this one I don't know if we need it
    function fixCommitLog(id, email){
        let WOQL = TerminusClient.WOQL 
        let q = WOQL.when( WOQL.triple("v:UIRI", "system:agent_name", id))
            .add_triple("v:UIRI", "system:user_identifier", email) 
        let fixer = woqlClient.copy()
        fixer.setSystemDb()
        fixer.query(q)
    }

    let sections = []
    //let tabs = []

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
