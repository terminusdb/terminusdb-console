import {  Nav,NavItem, NavLink, Alert } from "reactstrap";
import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { NavLink as RouterNavLink } from "react-router-dom";
import * as links from '../../variables/pageLabels'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { trimContent } from "../../utils/helperFunctions"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faCodeBranch } from '@fortawesome/free-solid-svg-icons'
library.add(faClock, faCodeBranch)
import ToggleButton from 'react-toggle-button'

export const DBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj();
    let dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}

    const [DBMeta, setDBMeta] = useState(dbmeta)
    const [branch, setBranch] = useState(woqlClient.checkout())
    const [ref, setRef] = useState(woqlClient.ref())
    const [toggleTime, setToggleTime] = useState(false)

    function toggleNavbar(){
        if(props.toggleTimeTravel) props.toggleTimeTravel()
    }

    function getNavURL(type){
        let dbb = "/db/"
        if(woqlClient && woqlClient.db()){
            if(woqlClient.db() == "terminus") dbb += "terminus"
            else dbb += woqlClient.account() + "/" + woqlClient.db()
        }
        return dbb + (type == "home" ? "/" : "/" + type)
    }

    let dbClass = ""
    if(!props.isOpen) dbClass = "ml-auto db-nav"
    else dbClass = "ml-auto"


    let headText = (ref ? "Commit (" + ref + ")" : "Latest")
    /*console.log('headText', headText)
    console.log('ref', ref)
    console.log('branch', branch)*/
    let branchStatus = ((ref || branch != "master") ? "orange" : "#ccc")

    const handleToggle = (toggleTime) => {
        setToggleTime(!toggleTime)
    }

    const inactiveLabelStyle = {
        fontSize: '14px',
        display: 'flex',
        AlignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color:'rgb(250, 250, 250)',
        marginTop: 'auto',
        marginBottom: 'auto',
        lineHeight: 0,
        opacity: 0,
        width: '26px',
        height: '20px',
        left: '4px'
    }

    const borderRadiusStyle = {
        minWidth: '100px',
        width: 'auto'
    }

    const activeLabelStyle = {
        fontSize: '14px'
    }

    //console.log('branchStatus', branchStatus)


    return (

            <Nav className = {dbClass} navbar>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("home")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {trimContent(DBMeta.title, 15)}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("document")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {links.DOCUMENT_PAGE.label}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("query")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {links.QUERY_PAGE.label}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("schema")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {links.SCHEMA_PAGE.label}
                    </NavLink>
                </NavItem>
                {dbmeta.db != "terminus" && !props.isOpen &&
                <NavItem>
                    {/*<NavLink onClick = {toggleNavbar} title={branch + ' ' + headText*/}
                    <NavLink onClick = {toggleNavbar} title={'Click to view History Navigator'}>
                       {/* <FontAwesomeIcon size="2x" icon="code-branch" className="mr-3" title={branch + " " + headText} color={branchStatus}/>*/}
                       { <ToggleButton value={ toggleTime || false }
                            inactiveLabel={branch}
                            inactiveLabelStyle={inactiveLabelStyle}
                            activeLabel={'Commits'}
                            activeLabelStyle={activeLabelStyle}
                            trackStyle={borderRadiusStyle}
                            thumbAnimateRange = {[0, 80]}
                            colors={{ activeThumb: {
                                      base: branchStatus,
                                    },
                                    active: {
                                      base: branchStatus,
                                      hover: 'rgb(177, 191, 215)',
                                    }} }
                          onToggle={ (value) => handleToggle(value)
                          } />}
                    </NavLink>
                </NavItem>
                }
        </Nav>
    )
}

/*(value) => { setToggleTime(!toggleTime) */
