import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Col, Row } from "reactstrap"
import { CommitView } from "./CommitView"
import { GO_RIGHT, GO_LEFT } from "../../constants/faicons"
import { COMMIT_TRAVELLER } from "./constants.history"

export const CommitTraveller = (props) => {

    function handleNextCommit(){
        props.setRef(props.commit.child)
    }

    function handlePreviousCommit(){
        props.setRef(props.commit.parent)
    } 

    function getForwardButton(){
        if(props.commit && props.commit.child) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.className} icon={GO_RIGHT}/>)
        return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={GO_RIGHT}/>)
    }

    function getBackButton(){
        if(props.commit && props.commit.parent) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.className} icon={GO_LEFT}/>)
        return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={GO_LEFT}/>)
    }

    function getBackNavigation(){
        if(props.commit && props.commit.parent){
            return (
                <Col onClick={handlePreviousCommit} className={COMMIT_TRAVELLER.navColClassName} md={1}>
                    <span className={COMMIT_TRAVELLER.navClassName}>
                        {getBackButton()}
                    </span>
                </Col>
            )
        }
        else {
            return (
                <Col className={COMMIT_TRAVELLER.inactiveNavColClassName} md={1}>
                    <span className={COMMIT_TRAVELLER.inactiveNavClassName}>
                        {getBackButton()}
                    </span>
                </Col>
            )
        }
    }

    function getForwardNavigation(){
        if(props.commit && props.commit.child){
            return (
                <Col onClick={handleNextCommit} className={COMMIT_TRAVELLER.navColClassName} md={1}>
                    <span className={COMMIT_TRAVELLER.navClassName}>
                        {getForwardButton()}
                    </span>
                </Col>
            )
        }
        else {
            return (
                <Col className={COMMIT_TRAVELLER.inactiveNavColClassName} md={1}>
                    <span className={COMMIT_TRAVELLER.inactiveNavClassName}>
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
        <Container className={COMMIT_TRAVELLER.containerClassName}>
            <Row>
                {backNavigation}
                <Col  className={COMMIT_TRAVELLER.commitColClassName} md={10}>
                    <span className={COMMIT_TRAVELLER.commitClassName}>
                        <CommitView commit={props.commit} />
                    </span>
                </Col>
                {forwardNavigation}
            </Row>
        </Container>
    )
}

