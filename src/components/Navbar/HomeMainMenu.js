import {NavLink} from 'react-router-dom';
import React, {useState, useEffect, Fragment} from 'react';
import {
	PAGES_ID,
    CREATEDB_TITLE,
    DBLIST_TITLE,
    CLONEDB_TITLE,
    COLLABORATE_TITLE
} from './constants.navbar'

import {SERVER_ROUTE,CREATE_DB_ROUTE,CLONE_DB_ROUTE,COLLABORATE_DB_ROUTE} from '../../constants/routes'

export const HomeMainMenu = (props) => {
	const [isTopOpen, setIsOpen] = useState(false)

	const topmenu =
        isTopOpen === true
            ? 'nav__main__center  nav__main__center--show'
            : 'nav__main__center nav__main__center--hide'


	return (
			<div className="nav__main__wrap">
            <div className="console__page__container--width" >
			<nav className="nav__main nav__main--sub">
			<ul className={topmenu}>
		        <li className="nav__main__item nav__main__item--sub">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link nav__main__link--sub"
		                to={SERVER_ROUTE}
		                activeClassName="nav__main__link--subselected"
		                exact
		                id={PAGES_ID.NAV_DB_LIST}
		                title={DBLIST_TITLE}
		            >
		                {DBLIST_TITLE}
		            </NavLink>
		        </li>
		        <li className="nav__main__item nav__main__item--sub">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link nav__main__link--sub"
		                activeClassName="nav__main__link--subselected"
		                to={CLONE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_CLONE}
		            >
		             {CLONEDB_TITLE}
		            </NavLink>
		        </li>
		        <li className="nav__main__item nav__main__item--sub">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link nav__main__link--sub"
		                activeClassName="nav__main__link--subselected"
		                to={CREATE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_CREATE_DB}
		            >
		             {CREATEDB_TITLE}
		            </NavLink>
		        </li>
		        <li className="nav__main__item nav__main__item--sub">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link nav__main__link--sub"
		                activeClassName="nav__main__link--subselected"
		                to={COLLABORATE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_COLL}
		            >
		             {COLLABORATE_TITLE}
		            </NavLink>
		        </li>
		   </ul>
	    </nav>
	    </div>
	    </div>
    )
}