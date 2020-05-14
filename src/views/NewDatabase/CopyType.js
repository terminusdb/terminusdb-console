import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import { copyDbCardTypes } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"

export const CopyType = (props) => {
    const [show, setShow] = useState(true);
    const [fork, setFork] = useState(false);
    const [clone, setClone] = useState(false);
    const [next, setNext] = useState(false);
    const local = props.local || false;
    const remote = props.remote || false;

    const handleClone = () => {
        setClone(true)
        setShow(false)
        setNext(true)
    }

    const handleFork = () =>{
        setFork(true)
        setShow(false)
        setNext(true)
    }

    return (<>
             {show &&  <>
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
            </span> </>}

           {next && local && <CloneLocalDB fork = { fork }/>}
           {next && remote && <CloneRemoteDB clone = { clone }/>}

        </>
    )
}
