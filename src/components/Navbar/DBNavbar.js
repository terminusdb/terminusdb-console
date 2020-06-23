import React, { useState, useEffect,Fragment } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { NavLink } from "react-router-dom";
import { trimContent } from "../../utils/helperFunctions"
import ToggleButton from 'react-toggle-button'
import { getDBPageRoute } from "../Router/ConsoleRouter"
import {DOCUMENT_PAGE_LABEL, SCHEMA_PAGE_LABEL, QUERY_PAGE_LABEL, PAGES_ID} from './constants.navbar'
import { DBContextObj } from "../Query/DBContext"
import {BranchSelector} from "../History/BranchSelector"
import { printts } from "../../constants/dates";

export const DBNavbar = (props) => {
    //sometimes loaded by back button when not in DB context
    try {
        return GuardedDBNavbar(props)
    }catch(e){
        return null
    }
}

const GuardedDBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj();
    const {branches, branch, ref, setHead, consoleTime} = DBContextObj();

    let dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}

    const [toggleTime, setToggleTime] = useState(false)

    function getNavURL(page){
        return getDBPageRoute(woqlClient.db(), woqlClient.account(), page)
    }

    const handleToggle = (toggleTime) => {
        setToggleTime(!toggleTime)
        if(props.toggleTimeTravel) props.toggleTimeTravel()
    }

    
    function getDBHomeDetails(){
        if(dbmeta.db == "terminus" || !branches ){
            return ""
        }

        let currentTime = (<span className="nav__main__commit">Latest</span>)
        if(consoleTime) currentTime = (<span className="nav__main__commit">{printts(consoleTime)}</span>)
        return currentTime
    }

    const isOpen=false;
    const dropdownContent = isOpen===true ? "dropdown__content  dropdown__content--show" : "dropdown__content dropdown__content--hide"
    const homeDetails = getDBHomeDetails()
    return (<Fragment>
                <li className="nav__main__item ">
                    <NavLink tag = {NavLink} className="nav__main__link"
                        to = {getNavURL("")}
                        activeClassName = "nav__main__link--selected"
                        exact
                        id={PAGES_ID.NAV_DB_HOME}>
                        {trimContent(dbmeta.title, 15)}                
                    </NavLink>
                </li>
                <li className="nav__main__item">
                    <NavLink tag = {NavLink} 
                        className="nav__main__link"
                        activeClassName = "nav__main__link--selected"
                        to = {getNavURL("document")}
                        exact
                        id={PAGES_ID.NAV_DOCUMENTS}>
                        {DOCUMENT_PAGE_LABEL}
                    </NavLink>
                </li>
                <li className="nav__main__item">
                    <NavLink tag = {NavLink} 
                        className="nav__main__link"
                        to = {getNavURL("query")}
                        activeClassName = "nav__main__link--selected"
                        exact
                        id={PAGES_ID.NAV_QUERY}>
                        {QUERY_PAGE_LABEL}
                    </NavLink>
                </li>
                <li className="nav__main__item">
                    <NavLink 
                        className="nav__main__link"
                        tag = {NavLink}
                        to = {getNavURL("schema")}
                        activeClassName = "nav__main__link--selected"
                        exact
                        id={PAGES_ID.NAV_SCHEMA}>
                        {SCHEMA_PAGE_LABEL}
                    </NavLink>
                </li>
                <li className="nav__main__item nav__main__item--box">   
                   <BranchSelector />
                   <label className="switch" title="time travel tools">
                      <input type="checkbox" className="switch__input" onChange={handleToggle}/>
                      <span className="switch__slider"></span>
                    </label>
                    {homeDetails}
                </li>                   
            </Fragment>
               
       
    )//onClick={toggle}
}

/*
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
            <NavItem className="d-none d-md-block" >
                <div className="select-nav-bar">
                    <BranchSelector />
                </div>
            </NavItem>
            <NavItem className="d-none d-md-block" >
                    {getDBHomeDetails()}
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
        </Nav>*/

/*(value) => { setToggleTime(!toggleTime) */