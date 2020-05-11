import React, { useState, useEffect } from "react";
import * as viewLabels from "../../labels/viewLabels"
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge, Container} from "reactstrap";

export const ViewChooser = ({view, views, updateView}) => {
    views = views || [{id: "table", label: "Table View", config: {}}, {id: "graph", label: "Graph View", config: {}}]

    const entries = views.map((v) => {
        return (<DropdownItem active={v.id == view} key={v.id} onClick={function(){updateView(v.config, v.id)}}>{v.label}</DropdownItem>) 
    })

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
  
    return (
    <Container>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                {view}
            </DropdownToggle>
            <DropdownMenu>
                {entries}
            </DropdownMenu>
        </Dropdown>
    </Container>
    )

}
