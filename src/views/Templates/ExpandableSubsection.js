import React from "react";
import { Col, Row, Button, Container } from "reactstrap";
import { RIVER_OF_SECTIONS, SUMMARY_SECTION, SECTION_HEADER } from "./constants.templates"
import { CHECK } from "../../constants/faicons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ExpandableSubsection = ({section, index, active, onClose, onOpen, children}) => {

    function openSubsection(){
        onOpen(index)
    }

    if(typeof active != "undefined" && active != index) return null //something else is open
    if(typeof active == "undefined") return (<SubsectionSummary section={section} onOpen={openSubsection}/>)
    return (
        <Col className={RIVER_OF_SECTIONS.activePageCSS}>
            <Row className={RIVER_OF_SECTIONS.activePageHeaderCSS}>
                <SubsectionHeader section={section} onClose={onClose}/>
            </Row>
            <Row className={RIVER_OF_SECTIONS.activePageBodyCSS}>
                { children }
            </Row>
        </Col>
    )

}

const SubsectionSummary = ({section, onOpen}) => {

    function getOpen(section){
        if(section.id == "delete") return (
            <Button color="danger" onClick={onOpen} className={SUMMARY_SECTION.deleteButtonCSS}>
                {section.button}
            </Button>
        )
        return (
            <Button outline color="secondary" onClick={onOpen} className={SUMMARY_SECTION.openButtonCSS}>
                {section.button}
            </Button>
        )
    }

    function getIcon(section){
        if(!section.icon) return null
        if(section.id == "delete") return (<FontAwesomeIcon size="5x" className={SUMMARY_SECTION.deleteCSS} icon={section.icon}/>)
        else return (<FontAwesomeIcon size="5x" className={SUMMARY_SECTION.iconCSS} icon={section.icon}/>)
    }

    return (
        <Container className={SUMMARY_SECTION.containerCSS}>
            <Row key={section.id + "_summary"} className={SUMMARY_SECTION.contentRowCSS}>
                <Col md={1} className={SUMMARY_SECTION.iconContainerCSS}>
                    {getIcon(section)}
                </Col>
                <Col md={10} className={SUMMARY_SECTION.contentCSS}>
                    <div className={SUMMARY_SECTION.titleCSS}>
                        {section.title}
                    </div>
                    <div className={SUMMARY_SECTION.blurbCSS}>
                        {section.blurb}
                    </div>
                </Col>
                <Col md={1} className={SUMMARY_SECTION.openCSS}>
                </Col>
            </Row>
            <Row key = {section.id + "_s2"} className={SUMMARY_SECTION.buttonRowCSS}>
                <Col md={10}></Col>
                <Col md={2}>
                    {getOpen(section)}
                </Col>
            </Row>
        </Container>
    )
}

const SubsectionHeader = ({section, onClose}) => {
    
    function getIcon(sec){
        if(!sec.icon) return null
        return (<FontAwesomeIcon size="3x" className={SECTION_HEADER.iconCSS} icon={sec.icon}/>)
    }
    
    function getClose(sec){
        return (<FontAwesomeIcon size="3x" className={SECTION_HEADER.closeIconCSS} icon="times-circle" onClick={onClose}/>)
    }

    if(!section) return null
    return (
        <Row key={section.id + "_hdr"}  className={SECTION_HEADER.containerCSS}>
            <Col md={1} className={SECTION_HEADER.iconContainerCSS}>
                {getIcon(section)}
            </Col>           
            <Col md={10} className={SECTION_HEADER.blurbCSS}>
                {section.blurb}
            </Col>
            <Col md={1} className={SECTION_HEADER.closeCSS}>
                {getClose(section)}
            </Col>
        </Row>
    )
}

