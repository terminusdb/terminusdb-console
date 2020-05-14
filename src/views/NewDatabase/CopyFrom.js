import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import { CopyType } from "./CopyType"
import { copyDbCardOptions } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"

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
                    <Card body outline color="info" onClick={handleLocal} className="db-view-cards">
                        <DatabaseCard card = {copyDbCardOptions.local}/>
                    </Card>
                </Col>

                <Col md={6} className="col-md-6">
                    <Card body outline color="info" onClick={handleRemote} className="db-view-cards">
                        <DatabaseCard card = {copyDbCardOptions.remote}/>
                    </Card>
                </Col>

            </span>
    </>}

    {showType && <CopyType remote = { remote } local = { local }/>}

    </>)
}
