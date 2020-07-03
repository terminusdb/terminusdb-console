import React, {useState, useEffect, Fragment} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {NavLink} from 'react-router-dom'
import {trimContent} from '../../utils/helperFunctions'
import {getDBPageRoute} from '../Router/ConsoleRouter'
import {
    DOCUMENT_PAGE_LABEL,
    SCHEMA_PAGE_LABEL,
    QUERY_PAGE_LABEL,
    PAGES_ID,
} from './constants.navbar'
import {DBContextObj} from '../Query/DBContext'
import {BranchSelector} from '../History/BranchSelector'
import {printts} from '../../constants/dates'

export const DBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj()
    if (woqlClient.db()) {
        //sometimes loaded by back button when not in DB context
        try {
            return GuardedDBNavbar(props)
        } catch (e) {
            return null
        }
    }
    return null
}

const GuardedDBNavbar = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {branches, consoleTime} = DBContextObj()

    let dbmeta = woqlClient.get_database() || {}

    const [toggleTime, setToggleTime] = useState(false)

    function getNavURL(page) {
        return getDBPageRoute(woqlClient.db(), woqlClient.organization(), page)
    }

    const handleToggle = (toggleTime) => {
        setToggleTime(!toggleTime)
        if (props.toggleTimeTravel) props.toggleTimeTravel()
    }

    function getDBHomeDetails() {
        if (dbmeta.id == '_system' || !branches) {
            return ''
        }

        let currentTime = <span className="nav__main__commit">Latest</span>
        if (consoleTime)
            currentTime = <span className="nav__main__commit">{printts(consoleTime)}</span>
        return currentTime
    }

    const isOpen = false
    const dropdownContent =
        isOpen === true
            ? 'dropdown__content  dropdown__content--show'
            : 'dropdown__content dropdown__content--hide'
    const homeDetails = getDBHomeDetails()
    return (
        <Fragment>
            <li className="nav__main__item ">
                <NavLink
                    tag={NavLink}
                    className="nav__main__link"
                    to={getNavURL('')}
                    activeClassName="nav__main__link--selected"
                    exact
                    id={PAGES_ID.NAV_DB_HOME}
                    title={dbmeta.label}
                >
                    {trimContent(dbmeta.label, 15)}
                </NavLink>
            </li>
            <li className="nav__main__item">
                <NavLink
                    tag={NavLink}
                    className="nav__main__link"
                    activeClassName="nav__main__link--selected"
                    to={getNavURL('document')}
                    exact
                    id={PAGES_ID.NAV_DOCUMENTS}
                >
                    {DOCUMENT_PAGE_LABEL}
                </NavLink>
            </li>
            <li className="nav__main__item">
                <NavLink
                    tag={NavLink}
                    className="nav__main__link"
                    to={getNavURL('query')}
                    activeClassName="nav__main__link--selected"
                    exact
                    id={PAGES_ID.NAV_QUERY}
                >
                    {QUERY_PAGE_LABEL}
                </NavLink>
            </li>
            <li className="nav__main__item">
                <NavLink
                    className="nav__main__link"
                    tag={NavLink}
                    to={getNavURL('schema')}
                    activeClassName="nav__main__link--selected"
                    exact
                    id={PAGES_ID.NAV_SCHEMA}
                >
                    {SCHEMA_PAGE_LABEL}
                </NavLink>
            </li>
            <li className="nav__main__item nav__main__item--box">
                <BranchSelector />
                <label className="switch" title="time travel tools">
                    <input type="checkbox" className="switch__input" onChange={handleToggle} />
                    <span className="switch__slider"></span>
                </label>
                {homeDetails}
            </li>
        </Fragment>
    ) 
}
