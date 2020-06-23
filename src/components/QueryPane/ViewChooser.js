import React, { useState, useEffect } from "react";
//import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Col, Row } from "reactstrap";
import { TABLE_VIEW, GRAPH_VIEW, TOOLBAR_CSS,ELEMENTS_ID } from "./constants.querypane"
import {Dropdown} from '../Form/Dropdown'; 

export const ViewChooser = ({view, views, updateView}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const changeView=(view)=>{
        updateView(view)
        toggle(false)
    }

    views = views || [{id: "table", label: TABLE_VIEW}, {id: "graph", label: GRAPH_VIEW}]

    const currentView = view || 'table';
    let currentLabel;

    const entries = views.map((v) => {
        if(v.id === currentView) currentLabel=v.label;

        const active=v.id === currentView ? {active:"active"} : {}

        return(<button onClick={function(){changeView(v.id)}} {...active}
                    className="tdb__dropdown__button" key={v.id} >{v.label}</button>)
    })

    
    return (
        <div className="tdb__commit__bar" >
             <Dropdown id={ELEMENTS_ID.RESULT_DROPDOWN} isOpen={dropdownOpen} toggle={toggle} title={currentLabel } className="nav__main__link tdb__commit__bar--drop">
                {entries}
            </Dropdown>              
        </div>
    )

}
