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
import {BiGitBranch} from "react-icons/bi"
import {printts} from '../../constants/dates'

export const DBNavbarTop = (props) => {
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
    const {branches, consoleTime, branch} = DBContextObj()

    let dbmeta = woqlClient.get_database() || {}
    const [toggleTime, setToggleTime] = useState(false)

    function getNavURL(page) {
        return getDBPageRoute(woqlClient.db(), woqlClient.organization(), page)
    }

    const handleToggle = (toggleTime) => {
        setToggleTime(!toggleTime)
        if (props.toggleTimeTravel) props.toggleTimeTravel()
    }

    function getCommitTime() {
        if (dbmeta.id == '_system' || !branches) {
            return ''
        }

        let currentTime = <span className="nav__main__commit">Latest</span>
        if (consoleTime)
            currentTime = <span className="nav__main__commit">{printts(consoleTime)}</span>
        return currentTime
    }

    const currentCommitTime = getCommitTime()

    return (
        <Fragment>
            <li className="nav__main__item ">
               <label className="nav__main__title" title={dbmeta.label}>
                    {dbmeta.label}
               </label>
            </li>
            {<li className="nav__main__item nav__main__item--box">
                <span class="nav__main__commit">
                    <BiGitBranch color="#ff9796"/>{branch}
                </span>
                {/*<BranchSelector currentBranch={branch}/>*/}
                <label className="switch" title="time travel tools">
                    <input type="checkbox" className="switch__input" onChange={handleToggle} />
                    <span className="switch__slider"></span>
                </label>
                {currentCommitTime}
            </li>}
        </Fragment>
    )
}
