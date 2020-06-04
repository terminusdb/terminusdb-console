import React, { useState, useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Container, Col, Row } from "reactstrap";
import { TABLE_VIEW, GRAPH_VIEW, TOOLBAR_CSS } from "./constants.querypane"

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
        <Row className={TOOLBAR_CSS.containerRow} >
            <Col md={12} className={TOOLBAR_CSS.row}>
                <Row>
                    <Col md={11}/>
                    <Col md={1} className={TOOLBAR_CSS.queryPaneControls}>
                        <Dropdown isOpen={dropdownOpen} toggle={toggle} className={TOOLBAR_CSS.dropdown}>
                            <DropdownToggle caret>
                                {currentLabel}
                            </DropdownToggle>
                            <DropdownMenu>
                                {entries}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
            </Col>
        </Row>
    )

}
