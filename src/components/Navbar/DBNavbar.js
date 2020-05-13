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

export const DBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj();
    let dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}

    const [DBMeta, setDBMeta] = useState(dbmeta)
    const [branch, setBranch] = useState(woqlClient.checkout())
    const [ref, setRef] = useState(woqlClient.ref())

    const [collapsed, setCollapsed] = useState(true);


    useEffect(() => {
        dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}
        setDBMeta(dbmeta)
        setBranch(woqlClient.checkout())
        setRef(woqlClient.ref())
    }, []);

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

    let headText = (ref ? "Commit (" + ref + ")" : "Latest")
    let clockStatus = (ref ? "orange" : "green")
    let branchStatus = (branch != "master" ? "orange" : "green")
    return (
        <div className="d-flex db-al db-nav s-nav">
            <Nav className = "mr-auto"  navbar>
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
                {dbmeta.db != "terminus" &&
                <NavItem>
                    <NavLink onClick = {toggleNavbar}>
                       <FontAwesomeIcon icon="clock" className="mr-3" title={headText} color={clockStatus}/>
                       <FontAwesomeIcon icon="code-branch" className="mr-3" title={branch} color={branchStatus}/>
                    </NavLink>
                </NavItem>
                }
        </Nav>
        </div>
    )
}
