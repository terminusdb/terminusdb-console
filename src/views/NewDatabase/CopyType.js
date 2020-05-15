import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
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

    const handleClone = () => {
        if(local) setPage(view.CLONE_LOCAL)
        if(remote) setPage(view.CLONE_REMOTE)
    }

    const handleFork = () =>{
        if(local) setPage(view.CLONE_LOCAL)
        if(remote) setPage(view.CLONE_REMOTE)
    }

    return (<>
             {<div className="card-grid">
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
            </span> </div>}

        </>
    )
}
