import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import { copyDbCardTypes } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"
import * as view from "../../labels/createView"

/** fork and clone logic not included **/
export const CopyType = (props) => {
    const setPage = props.setPage;
    const local = props.local || false;
    const remote = props.remote || false;
    const setClone = props.setClone;

    const handleClone = () => {
        if(local) setPage(view.CLONE_LOCAL)
        if(remote) setPage(view.CLONE_REMOTE)
        setClone(true)
    }

    const handleFork = () =>{
        if(local) setPage(view.CLONE_LOCAL)
        if(remote) setPage(view.CLONE_REMOTE)
        setClone(false)
    }

    return (<>
             { <Row className="col-md-12 justify-content-center" >
                    <Col className="col-md-5">
                        <div onClick={handleFork} className="square db-view-cards">
                            <DatabaseCard card = {copyDbCardTypes.fork}/>
                        </div>
                    </Col>

                    <Col className="col-md-5">
                        <div onClick={handleClone} className="square db-view-cards">                           
                            <DatabaseCard card = {copyDbCardTypes.clone}/>
                        </div>
                    </Col>
                </Row>}

        </>
    )
}

/*
<div className="card-grid">
                 <span className="d-fl">
                    <Col md={6} className="col-md-6">
                        <Card body outline color="info" onClick={handleFork} className="db-view-cards">
                            <DatabaseCard card = {copyDbCardTypes.fork}/>
                        </Card>
                    </Col>

                    <Col md={6} className="col-md-6">
                    <Card body outline color="info" onClick={handleClone} className="db-view-cards">
                        <DatabaseCard card = {copyDbCardTypes.clone}/>
                    </Card>
                </Col>
            </span> </div>*/
