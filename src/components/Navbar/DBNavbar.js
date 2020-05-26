import {  Nav,NavItem, NavLink, Alert } from "reactstrap";
import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { NavLink as RouterNavLink } from "react-router-dom";
import { trimContent } from "../../utils/helperFunctions"
import ToggleButton from 'react-toggle-button'
import { getDBPageRoute } from "../Router/ConsoleRouter"
import {DOCUMENT_PAGE_LABEL, SCHEMA_PAGE_LABEL, QUERY_PAGE_LABEL} from './constants.navbar'


export const DBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj();
    let dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}

    const branch = woqlClient.checkout()
    const ref = woqlClient.ref()
    const [toggleTime, setToggleTime] = useState(false)

    function toggleNavbar(){
        if(props.toggleTimeTravel) props.toggleTimeTravel()
    }

    function getNavURL(page){
        let aid = woqlClient.account() || woqlClient.uid()
        return getDBPageRoute(woqlClient.db(), aid, page)
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
                            to = {getNavURL("")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {trimContent(dbmeta.title, 15)}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("document")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {DOCUMENT_PAGE_LABEL}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("query")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {QUERY_PAGE_LABEL}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag = {RouterNavLink}
                            to = {getNavURL("schema")}
                            activeClassName = "router-link-exact-active"
                            onClick = {props.onClick}
                            exact>
                            {SCHEMA_PAGE_LABEL}
                    </NavLink>
                </NavItem>
                {dbmeta.db != "terminus" && !props.isOpen &&
                <NavItem>
                    <NavLink onClick = {toggleNavbar} title={branch + ' ' + headText}>
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
