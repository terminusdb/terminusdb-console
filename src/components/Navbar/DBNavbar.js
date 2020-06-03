import {  Nav,NavItem, NavLink, Row, Col } from "reactstrap";
import React, { useState, useEffect } from "react";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { NavLink as RouterNavLink } from "react-router-dom";
import { trimContent } from "../../utils/helperFunctions"
import ToggleButton from 'react-toggle-button'
import { getDBPageRoute } from "../Router/ConsoleRouter"
import {DOCUMENT_PAGE_LABEL, SCHEMA_PAGE_LABEL, QUERY_PAGE_LABEL, SLIDER_CSS, NAV_CSS} from './constants.navbar'
import { DBContextObj } from "../Query/DBContext"
import {BranchSelector} from "../History/BranchSelector"

export const DBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj();
    const {branches, branch, ref, setHead, consoleTime} = DBContextObj();

    let dbmeta = woqlClient.connection.getDBMetadata(woqlClient.db(), woqlClient.account()) || {}

    const [toggleTime, setToggleTime] = useState(false)

    function getNavURL(page){
        let aid = woqlClient.account() || woqlClient.uid()
        return getDBPageRoute(woqlClient.db(), aid, page)
    }

    let dbClass = (!props.isOpen ? SLIDER_CSS.openButton : SLIDER_CSS.closedButton) 

    const handleToggle = (toggleTime) => {
        setToggleTime(!toggleTime)
        if(props.toggleTimeTravel) props.toggleTimeTravel()
    }

    let branchStatus = ( ref  ? "#ffa500" : "#ccc")

    function getDBHomeDetails(){
        if(dbmeta.db == "terminus" || !branches ){
            return null
        }

        let currentTime = (<span className={NAV_CSS.latest}>Latest</span>)
        if(consoleTime) currentTime = (<span className={NAV_CSS.history}>{consoleTime}</span>)

        let timeCSS = ( consoleTime ? NAV_CSS.Container : NAV_CSS.timeContainer)

        //let bs = (<BranchSelector />) 

        let toggler = (
            <ToggleButton value={ toggleTime || false }
                inactiveLabel={SLIDER_CSS.inactiveText}
                inactiveLabelStyle={SLIDER_CSS.inactiveLabel}
                activeLabel={SLIDER_CSS.activeText}
                activeThumbStyle = {SLIDER_CSS.thumb}
                activeLabelStyle={SLIDER_CSS.activeLabel}
                trackStyle={SLIDER_CSS.borderRadius}
                thumbAnimateRange = {[0, 80]}
                colors={
                    {
                        inactiveThumb: {
                            base: branchStatus,
                        },
                        active: {
                            base: branchStatus,
                            hover: 'rgb(177, 191, 215)',
                        }
                    } 
                }
                onToggle={ (value) => handleToggle(value) } 
            />
        )
        return (
        
                <Row className={NAV_CSS.dbDetails} >
                    <Col className={timeCSS}>
                        {currentTime}
                        {toggler}
                    </Col>
                </Row>
        )
    }

    /*
    <Row className={NAV_CSS.dbDetails} >
                {bs && 
                    <Col className={NAV_CSS.branchContainer}>{bs}</Col>
                }
                <Col className={timeCSS}>
                    {currentTime}
                    {toggler}
                </Col>
            </Row>
    */


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
        </Nav>
    )
}

/*(value) => { setToggleTime(!toggleTime) */
