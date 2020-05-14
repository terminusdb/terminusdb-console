import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import { DialogueBox } from "../../components/Reports/DialogueBox"
import CreateDb from "./CreateForm"
import { createDbCardOptions } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"

export const CreateOptions = (props) => {
    const [show, setShow] = useState(true);
    const [local, setLocal] = useState(false);
    const [remote, setRemote] = useState(false);

    const handleLocal = () => {
        setLocal(true)
        setShow(false)
    }

    const handleRemote = () => {
        setRemote(true)
        setShow(false)
    }


    return (
        <>
         {show && <><span className="d-fl">
            <Col md={6} className="col-md-6">
                <Card body outline color="info" onClick={handleLocal} className="db-view-cards">
                    <DatabaseCard card = {createDbCardOptions.local}/>
                </Card>
            </Col>

            <Col md={6} className="col-md-6">
                <Card body outline color="info" onClick={handleRemote} className="db-view-cards">
                    <DatabaseCard card = {createDbCardOptions.remote}/>
                </Card>
            </Col>

        </span>
    </>}

    {local && <CreateDb/>}

    {remote && <DialogueBox message = { 'Coming soon ...!'}/>}

    </>)
}
