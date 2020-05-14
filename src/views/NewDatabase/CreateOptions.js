import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import createLocallyImg from "../../img/icons/create-locally.png"
import createRemoteImg from "../../img/icons/create-remote.png"
import { DialogueBox } from "../../components/Reports/DialogueBox"
import CreateDb from "./CreateForm"

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
                <Card body outline color="info">
                    <hr className = "my-space-100"/>
                    <CardImg top width="100%" src={createLocallyImg}/>
                    <hr className = "my-space-100"/>
                    <CardTitle>Do you want to create locally?</CardTitle>
                    <Button color="secondary" onClick={handleLocal}>Create Locally</Button>
                </Card>
            </Col>

            <Col md={6} className="col-md-6">
                <Card body outline color="info">
                    <hr className = "my-space-100"/>
                    <CardImg top width="100%" src={createRemoteImg}/>
                    <hr className = "my-space-100"/>
                    <CardTitle>Do you want to create on Hub?</CardTitle>
                    <Button color="secondary" onClick={handleRemote}>Create on Hub</Button>
                </Card>
            </Col>

        </span>
    </>}

    {local && <CreateDb/>}

    {remote && <DialogueBox message = { 'Coming soon ...!'}/>}

    </>)
}
