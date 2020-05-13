import React, { useState, useEffect } from "react";
import * as viewLabels from "../../labels/viewLabels"
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge, Container} from "reactstrap";

export const ViewChooser = ({view, views, updateView}) => {
    
    views = views || [{id: "table", label: "Table View"}, {id: "graph", label: "Graph View"}]

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
