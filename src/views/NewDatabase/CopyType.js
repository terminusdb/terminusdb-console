import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import cloneImg from "../../img/icons/clone.png"
import forkImg from "../../img/icons/fork.png"

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
                        <Card body outline color="info">
                            <hr className = "my-space-100"/>
                            <CardImg top width="100%" src={forkImg}/>
                            <hr className = "my-space-100"/>
                            <CardTitle>Do you want to Fork?</CardTitle>
                            <Button color="secondary" onClick={handleFork}>Fork</Button>
                        </Card>
                    </Col>

                    <Col md={6} className="col-md-6">
                    <Card body outline color="info">
                        <hr className = "my-space-100"/>
                        <CardImg top width="100%" src={cloneImg}/>
                        <hr className = "my-space-100"/>
                        <CardTitle>Do you want to Clone?</CardTitle>
                        <Button color="secondary" onClick={handleClone}>Clone</Button>
                    </Card>
                </Col>
            </span> </>}

           {next && local && <CloneLocalDB fork = { fork }/>}
           {next && remote && <CloneRemoteDB clone = { clone }/>}

        </>
    )
}
