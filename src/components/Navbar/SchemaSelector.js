import React , {useState} from 'react';
import {Dropdown} from '@terminusdb/terminusdb-react-components';
import { ConsoleHistory } from "../Router/ConsoleRouter";
import {NavLink,useRouteMatch} from 'react-router-dom'
import {
    CLASSES_TAB,
    OWL_TAB,
    PROPERTIES_TAB,
    GRAPHS_TAB,
    PREFIXES_TAB,
    MODEL_TAB,
    GRAPHS_LOAD_ERROR,
} from '../../views/Pages/constants.pages'

import {
    SCHEMA_CLASSES_ROUTE,
    SCHEMA_PROPERTIES_ROUTE,
    SCHEMA_GRAPHS_ROUTE,
    SCHEMA_OWL_ROUTE,
    SCHEMA_PREFIXES_ROUTE,
    DB_SCHEMA_ROUTE,
    SCHEMA_MODEL_ROUTE,
} from '../../constants/routes'

import {SchemaPagesHook} from '../../views/Schema/SchemaPagesHook'
/**
 * Simple Dropdown for switching between branches
 */
export const SchemaSelector = ({ onChange, currentBranch, getNavURL }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    //const {getDefaultInstanceFilter, getDefaultSchemaFilter, graphFilter, graphs}=SchemaPagesHook()

    const toggle = (isOpen) => {
        setDropdownOpen(isOpen);
    }

    function changeSchemaPage(){      
        const navUrl=getNavURL(`schema${SCHEMA_MODEL_ROUTE}`);
        ConsoleHistory.push(navUrl);     
    }

    const entries = []
    entries.push( <NavLink
                        tag={NavLink}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_MODEL_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={MODEL_TAB}
                        title={MODEL_TAB}
                        key={MODEL_TAB}
                    >
                    {MODEL_TAB}
                    </NavLink>)

    entries.push( <NavLink
                        tag={NavLink}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_CLASSES_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={CLASSES_TAB}
                        title={CLASSES_TAB}
                        key={CLASSES_TAB}
                    >
                    {CLASSES_TAB}
                    </NavLink>)

     entries.push( <NavLink
                        tag={NavLink}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_PROPERTIES_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={PROPERTIES_TAB}
                        key={PROPERTIES_TAB}
                        title={PROPERTIES_TAB}
                    >
                    {PROPERTIES_TAB}
                    </NavLink>)

     entries.push( <NavLink
                        tag={NavLink}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_GRAPHS_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={GRAPHS_TAB}
                        title={GRAPHS_TAB}
                        key={GRAPHS_TAB}
                    >
                    {GRAPHS_TAB}
                    </NavLink>)

      entries.push( <NavLink
                        tag={NavLink}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_OWL_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={OWL_TAB}
                        title={OWL_TAB}
                        key={OWL_TAB}
                    >
                    {OWL_TAB}
                    </NavLink>)

      entries.push( <NavLink
                        key={PREFIXES_TAB}
                        className="nav__main__link nav__main__link--sub"
                        to={getNavURL(`schema${SCHEMA_PREFIXES_ROUTE}`)}
                        activeClassName="nav__main__link--selected"
                        exact
                        id={PREFIXES_TAB}
                        title={PREFIXES_TAB}
                    >
                    {PREFIXES_TAB}
                    </NavLink>)

       // })
    const {path} = useRouteMatch()
    const className = path.indexOf('schema') >-1 ? 'nav__main__link nav__main__link--sub nav__main__link--subselected' : 'nav__main__link--sub nav__main__link'

    return( 
            <Dropdown toggle={toggle} onClickAction={changeSchemaPage} mouseOverActive={true} isOpen={dropdownOpen} title="Schema" className={className} >                   
                {entries}                 
            </Dropdown>
          )
    /*}else if(branch && branches && Object.keys(branches).length == 1 && !hideSingle){
        return (
                <span className="nav__main__link">
                        {BRANCH_SELECTOR.label + " " + branch}
                </span>
        )
    }
    return (<span className={BRANCH_SELECTOR.emptyBranchClassName}/>)*/
}
