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
    let branchStatus = ((ref || branch != "master") ? "orange" : "#ccc")

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
                            colors={{ activeThumb: {
                                      base: branchStatus,
                                    },
                                    active: {
                                      base: branchStatus,
                                      hover: 'rgb(177, 191, 215)',
                                    }} }
                          onToggle={(value) => { setToggleTime(!toggleTime)
                          }} />}
                    </NavLink>
                </NavItem>
                }
        </Nav>
    )
}
