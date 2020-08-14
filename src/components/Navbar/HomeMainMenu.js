import {NavLink} from 'react-router-dom';
import React, {useState, useEffect, Fragment} from 'react';
import {
	PAGES_ID,
    CREATEDB_TITLE,
    DBLIST_TITLE,
    CLONEDB_TITLE,
    COLLABORATE_TITLE,
    
} from './constants.navbar'

import {SERVER_ROUTE,CREATE_DB_ROUTE,CLONE_DB_ROUTE,COLLABORATE_DB_ROUTE} from '../../constants/routes'
import { useAuth0 } from "../../react-auth0-spa";
export const HomeMainMenu = (props) => {

	const { isAuthenticated} = useAuth0();
	return (<Fragment>
		        <li className="nav__main__item">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link "
		                activeClassName="nav__main__link--selected"
		                to={CLONE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_CLONE}
		            >
		             {CLONEDB_TITLE}
		            </NavLink>
		        </li>
		        <li className="nav__main__item">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link"
		                activeClassName="nav__main__link--selected"
		                to={CREATE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_CREATE_DB}
		            >
		             {CREATEDB_TITLE}
		            </NavLink>
		        </li>
		        <li className="nav__main__item">
		            <NavLink
		                tag={NavLink}
		                className="nav__main__link"
		                activeClassName="nav__main__link--selected"
		                to={COLLABORATE_DB_ROUTE}
		                exact
		                id={PAGES_ID.NAV_COLL}
		            >
		             {COLLABORATE_TITLE}
		            </NavLink>
		        </li>
		   </Fragment>
    )
}