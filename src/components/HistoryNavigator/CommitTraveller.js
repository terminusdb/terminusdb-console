import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Container, Col, Row} from "reactstrap"
import {CommitView} from "./CommitView"

export const CommitTraveller = (props) => {

    function handleNextCommit(){
        props.setRef(props.commit.child)
    }

    function handlePreviousCommit(){
        props.setRef(props.commit.parent)
    } 

    function getForwardButton(){
        if(props.commit && props.commit.child) return (<FontAwesomeIcon className="history-navigator-icon" icon="caret-square-right"/>)
        return (<FontAwesomeIcon className="history-navigator-icon-inactive" icon="caret-square-right"/>)
    }

    function getBackButton(){
        if(props.commit && props.commit.parent) return (<FontAwesomeIcon className="history-navigator-icon" icon="caret-square-left"/>)
        return (<FontAwesomeIcon className="history-navigator-icon-inactive" icon="caret-square-left"/>)
    }

    function getBackNavigation(){
        if(props.commit && props.commit.parent){
            return (
                <Col onClick={handlePreviousCommit} className="commit-traveller-navigation-col" md={1}>
                    <span className="commit-traveller-navigation">
                        {getBackButton()}
                    </span>
                </Col>
            )
        }
        else {
            return (
                <Col className="commit-traveller-inactive-navigation-col" md={1}>
                    <span className="commit-traveller-inactive-navigation">
                        {getBackButton()}
                    </span>
                </Col>
            )
        }
    }

    function getForwardNavigation(){
        if(props.commit && props.commit.child){
            return (
                <Col onClick={handleNextCommit} className="commit-traveller-navigation-col" md={1}>
                    <span className="commit-traveller-navigation">
                        {getForwardButton()}
                    </span>
                </Col>
            )
        }
        else {
            return (
                <Col className="commit-traveller-inactive-navigation-col" md={1}>
                    <span className="commit-traveller-inactive-navigation">
                        {getForwardButton()}
                    </span>
                </Col>
            )
        }        
    }

    
    const backNavigation = getBackNavigation()
    const forwardNavigation = getForwardNavigation()

    //backNavigation

    return (
        <Container className="commit-internal-container">
            <Row>
                {backNavigation}
                <Col  className="commit-traveller-commit-col" md={10}>
                    <span className="commit-traveller-commit">
                        <CommitView commit={props.commit} />
                    </span>
                </Col>
                {forwardNavigation}
            </Row>
        </Container>
    )
}

