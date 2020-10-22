import React, {Fragment,useState} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {NavLink} from 'react-router-dom'
import {getDBPageRoute} from '../Router/ConsoleRouter'
import {SchemaSelector} from './SchemaSelector'
import {
    DOCUMENT_PAGE_LABEL,
    SCHEMA_PAGE_LABEL,
    MODEL_PAGE_LABEL,
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
    const [isTopOpen, setTopDropdownOpen] = useState(false)
    const toggleTop = () => setTopDropdownOpen((prevState) => !prevState)

    const topmenu =
        isTopOpen === true
            ? 'nav__main__center  nav__main__center--show'
            : 'nav__main__center nav__main__center--hide'


    function getNavURL(page) {
        return getDBPageRoute(woqlClient.db(), woqlClient.organization(), page)
    }

    return (
        <Fragment>
            <div className="nav__main__wrap">
            <div className="console__page__container--width" >
            <nav className="nav__main nav__main--sub">
                <ul className={topmenu}>
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
                    </li>
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
                       <SchemaSelector getNavURL={getNavURL}/>
                    </li>
                    </ul>
                    <div className="nav__main__menu">
                    <button
                        className="nav__main__burger nav__main__burger--sub"
                        onClick={toggleTop}
                        role="button"
                        aria-label="Navigation burger button"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                </nav>
            </div>
            </div> 
        </Fragment>
    ) 
}
