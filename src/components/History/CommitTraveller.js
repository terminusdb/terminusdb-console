import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Col, Row } from "reactstrap"
import { CommitView } from "./CommitView"
import { GO_RIGHT, GO_LEFT, HEAD } from "../../constants/faicons"
import { COMMIT_TRAVELLER } from "./constants.history"
import TerminusClient from '@terminusdb/terminusdb-client';
import { DBContextObj} from "../Query/DBContext"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TERMINUS_ERROR } from "../../constants/identifiers";

export const CommitTraveller = (props) => {
    const [commit, setCommit] = useState()
    const {woqlClient} = WOQLClientObj();
    const {branch, branches} = DBContextObj();

    let mb = props.branch || branch

    let isHead = (commit && branches && branch && branches[branch].head == commit.id)

    //retrieves details of the commit with id ref
    useEffect(() => {
        if(props.commit){
            TerminusClient.WOQL.lib().loadCommitBranchDetails(woqlClient, props.commit, mb).execute(woqlClient)
           .then((res) => {
                let commie = (res && res.bindings ? extractCommitData(res.bindings[0]) : [])
                setCommit(commie)
            })
        }
    }, [props.commit]);

    
    const extractCommitData = (res)=>{
        let commie = {}
        if(res){
            if(res['CommitID'] && res['CommitID']['@value']) commie.id = res['CommitID']["@value"]
            if(res['Time'] && res['Time']["@value"]) commie.time = parseFloat(res['Time']["@value"])
            if(res['Author'] && res['Author']["@value"]) commie.author = res['Author']["@value"]
            if(res['Message'] && res['Message']["@value"]) commie.message = res['Message']["@value"]
            if(res['Parent'] && res['Parent']["@value"]) commie.parent = res['Parent']["@value"]
            if(res['Child'] && res['Child']["@value"]) commie.child = res['Child']["@value"]
        }
        return commie
    }

    function handleNextCommit(){
        let next = (commit && commit.child ? commit.child : (branches && branch && branches[branch] ?  branches[branch].head : false))
        props.setRef(next)
        setCommit()
    }

    function handlePreviousCommit(){
        props.setRef(commit.parent)
        setCommit()
    } 

    function getForwardButton(){
        if(commit && commit.child) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.className} icon={GO_RIGHT}/>)
        if(isHead) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={HEAD}/>)
        if(commit) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.className} icon={HEAD}/>)
        return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={GO_RIGHT}/>)
    }

    function getBackButton(){
        if(commit && commit.parent) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.className} icon={GO_LEFT}/>)
        if(commit) return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={HEAD}/>)
        return (<FontAwesomeIcon className={COMMIT_TRAVELLER.inactiveHistoryClassName} icon={GO_LEFT}/>)
    }



    function getBackNavigation(){
        if(commit && commit.parent){
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
        if(commit && commit.child){
            return (
                <Col onClick={handleNextCommit} className={COMMIT_TRAVELLER.navColClassName} md={1}>
                    <span className={COMMIT_TRAVELLER.navClassName}>
                        {getForwardButton()}
                    </span>
                </Col>
            )
        }
        else if(commit && !isHead){
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
                        <CommitView commit={commit} />
                    </span>
                </Col>
                {forwardNavigation}
            </Row>
        </Container>
    )
}
