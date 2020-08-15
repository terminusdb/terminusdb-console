import React, {Fragment} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {NavLink} from 'react-router-dom'
import {getDBPageRoute} from '../Router/ConsoleRouter'
import {
    DOCUMENT_PAGE_LABEL,
    SCHEMA_PAGE_LABEL,
    QUERY_PAGE_LABEL,
    PAGES_ID,
    MANAGE_TITLE,
    DB_HOME_PAGE_LABEL,
    SYNCHRONIZE_TITLE
} from './constants.navbar'

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
    const databaseInfo = woqlClient.get_database()

    function getNavURL(page) {
        return getDBPageRoute(woqlClient.db(), woqlClient.organization(), page)
    }

    return (
        <Fragment>
            <div className="nav__main__wrap">
            <div className="console__page__container--width" >
            <nav className="nav__main nav__main--sub">
                <ul className="nav__main__center nav__main__center--show">
                    <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            tag={NavLink}
                            className="nav__main__link nav__main__link--sub"
                            to={getNavURL('')}
                            activeClassName="nav__main__link--subselected"
                            exact
                            id={PAGES_ID.NAV_DB_HOME}
                            title={DB_HOME_PAGE_LABEL}
                        >
                            {DB_HOME_PAGE_LABEL}
                        </NavLink>
                    </li>
                    { databaseInfo.remote_url && 
                     <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            tag={NavLink}
                            className="nav__main__link nav__main__link--sub"
                            to={getNavURL(PAGES_ID.NAV_SYNCHRONIZE)}
                            activeClassName="nav__main__link--subselected"
                            exact
                            id={PAGES_ID.NAV_SYNCHRONIZE}
                            title={SYNCHRONIZE_TITLE}
                        >
                            {SYNCHRONIZE_TITLE}
                        </NavLink>
                    </li>}
                    <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            tag={NavLink}
                            className="nav__main__link nav__main__link--sub"
                            activeClassName="nav__main__link--subselected"
                            to={getNavURL('manage')}
                            exact
                            id={PAGES_ID.NAV_MANAGE}
                        >
                            {MANAGE_TITLE}
                        </NavLink>
                    </li>
                    <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            tag={NavLink}
                            className="nav__main__link nav__main__link--sub"
                            to={getNavURL('query')}
                            activeClassName="nav__main__link--subselected"
                            exact
                            id={PAGES_ID.NAV_QUERY}
                        >
                            {QUERY_PAGE_LABEL}
                        </NavLink>
                    </li>                    
                    <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            tag={NavLink}
                            className="nav__main__link nav__main__link--sub"
                            activeClassName="nav__main__link--subselected"
                            to={getNavURL('document')}
                            exact
                            id={PAGES_ID.NAV_DOCUMENTS}
                        >
                            {DOCUMENT_PAGE_LABEL}
                        </NavLink>
                    </li>
                    <li className="nav__main__item nav__main__item--sub">
                        <NavLink
                            className="nav__main__link nav__main__link--sub"
                            tag={NavLink}
                            to={getNavURL('schema')}
                            activeClassName="nav__main__link--subselected"
                            exact
                            id={PAGES_ID.NAV_SCHEMA}
                        >
                            {SCHEMA_PAGE_LABEL}
                        </NavLink>
                    </li>
                    </ul>
                </nav>
            </div>
            </div> 
        </Fragment>
    ) 
}
