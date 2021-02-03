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

    let active = props.page

    const { woqlClient, contextEnriched, refreshRemoteURL } = WOQLClientObj()
    
    function get_dbs_to_show(){
        let mdbs = []
        let dbs = woqlClient.databases()
        for(var i = 0; i<dbs.length; i++){
            if(dbs[i].id) mdbs.push(dbs[i])
        }
        return mdbs
    }
    /*
    * the promise if go in error it will be rejected
    */
    function load_missing_urls(urls){
        let promises = urls.map((item) => refreshRemoteURL(item))
        /*
        * manual implementation of Promise.allSettled() refreshRemoteURL return always a promise resolved
        * method returns a promise that resolves after all of the given promises 
        * have either fulfilled or rejected, with an array of objects that each describes 
        * the outcome of each promise.
        * REFACTOR we have to review this and move the call in the children 
        * one call for every children so the refresh is at children level
        */
        Promise.all(promises).then((values) => {
            setMyDBs(get_dbs_to_show())          
        }).catch(err=>{
            console.log(err)
        })
    }

    /*
    * you have to test if the user is logged
    * add the user fix the problem if I log in and after log out
    */
    useEffect(() => {
        if(woqlClient){
            let mdbs = get_dbs_to_show()
            let missing_urls = []
            setMyDBs(mdbs)

            /*
            * I try to load the remote record only if the user is logged
            * remove auth0 error 
            */
            if(auth0User){
                for(var i = 0; i<mdbs.length; i++){
                    if(mdbs[i].remote_url && !mdbs[i].remote_record && missing_urls.indexOf(mdbs[i].remote_url) == -1){
                        missing_urls.push(mdbs[i].remote_url)
                    }
                }
                if(missing_urls.length){
                    load_missing_urls(missing_urls)
                }
            }
            showlist = mdbs.length || false
        }
    }, [woqlClient, contextEnriched])

    if(!woqlClient) return null
    let showlist = (woqlClient ? woqlClient.databases().length : false)

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
