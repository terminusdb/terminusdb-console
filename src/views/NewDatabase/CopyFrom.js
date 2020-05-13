import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import copyLocallyImg from "../../img/icons/copy-locally.png"
import copyRemoteImg from "../../img/icons/copy-remote.png"
import { CopyType } from "./CopyType"

export const CopyFrom = (props) => {
    const [show, setShow] = useState(true);
    const [local, setLocal] = useState(false);
    const [remote, setRemote] = useState(false);
    const [showType, setShowType] = useState(false);

    const handleLocal = () => {
        setLocal(true)
        setShow(false)
        setShowType(true)
    }

    const handleRemote = () => {
        setRemote(true)
        setShow(false)
        setShowType(true)
    }

    return (
        <>
         {show && <>
             <span className="d-fl">
                <Col md={6} className="col-md-6">
                    <Card body outline color="info">
                        <hr className = "my-space-100"/>
                        <CardImg top width="100%" src={copyLocallyImg}/>
                        <hr className = "my-space-100"/>
                        <CardTitle>Do you want to copy from local database?</CardTitle>
                        <Button color="secondary" onClick={handleLocal}>Copy Local Database</Button>
                    </Card>
                </Col>

                <Col md={6} className="col-md-6">
                    <Card body outline color="info">
                        <hr className = "my-space-100"/>
                        <CardImg top width="100%" src={copyRemoteImg}/>
                        <hr className = "my-space-100"/>
                        <CardTitle>Do you want to copy from a remote database?</CardTitle>
                        <Button color="secondary" onClick={handleRemote}>Copy Remote Database</Button>
                    </Card>
                </Col>

            </span>
    </>}

    {showType && <CopyType remote = { remote } local = { local }/>}

    </>)
}
