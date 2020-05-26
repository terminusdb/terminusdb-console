import React from "react";
import { Col, Row } from "reactstrap";
import { RIVER_OF_SECTIONS, SUMMARY_SECTION, SECTION_HEADER } from "./constants.templates"
import { CHECK } from "../../constants/faicons"

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
        return (
            <Button onClick={onOpen} className={SUMMARY_SECTION.openButtonCSS}>
                {section.button}
            </Button>
        )
    }

    function getIcon(section){
        if(!section.icon) return null
        return (<FontAwesomeIcon className={SUMMARY_SECTION.iconCSS} icon={section.icon}/>)
    }

    return (
        <Row key={section.id + "_summary"} className={SUMMARY_SECTION.containerCSS}>
            <Col md={2} className={SUMMARY_SECTION.iconContainerCSS}>
                {getIcon(section)}
            </Col>
            <Col md={8} className={SUMMARY_SECTION.contentCSS}>
                <span className={SUMMARY_SECTION.titleCSS}>
                    {section.title}
                </span>
                <span className={SUMMARY_SECTION.blurbCSS}>
                    {section.blurb}
                </span>
            </Col>
            <Col md={2} className={SUMMARY_SECTION.openCSS}>
                {getOpen(section)}
            </Col>
        </Row>
    )
}

const SubsectionHeader = ({section, onClose}) => {
    
    function getIcon(sec){
        if(!sec.icon) return null
        return (<FontAwesomeIcon className={SECTION_HEADER.iconCSS} icon={sec.icon}/>)
    }
    
    function getClose(sec){
        return (<FontAwesomeIcon className={SECTION_HEADER.closeIconCSS} icon={CHECK} onClick={onClose}/>)
    }

    if(!section) return null
    return (
        <Row key={section.id + "_hdr"}  className={SECTION_HEADER.containerCSS}>
            <Col md={2} className={SECTION_HEADER.iconContainerCSS}>
                {getIcon(section)}
            </Col>
            <Col md={4} className={SECTION_HEADER.titleCSS}>
                {section.title}
            </Col>
            <Col md={6} className={SECTION_HEADER.blurbCSS}>
                {section.blurb}
            </Col>
            <Col md={2} className={SECTION_HEADER.closeCSS}>
                {getClose(section)}
            </Col>
        </Row>
    )
}

