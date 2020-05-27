import React, { useState, useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container} from "reactstrap";
import {TABLE_VIEW, GRAPH_VIEW} from "./constants.querypane"

export const ViewChooser = ({view, views, updateView}) => {
    
    views = views || [{id: "table", label: TABLE_VIEW}, {id: "graph", label: GRAPH_VIEW}]

    const currentView = view || 'table';
    let currentLabel;

    const entries = views.map((v) => {
        if(v.id === currentView) currentLabel=v.label;
        return (<DropdownItem active={v.id == currentView} key={v.id} onClick={function(){updateView(v.id)}}>{v.label}</DropdownItem>) 
    })

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
  
    return (
    <Container>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                {currentLabel}
            </DropdownToggle>
            <DropdownMenu>
                {entries}
            </DropdownMenu>
        </Dropdown>
    </Container>
    )

}
