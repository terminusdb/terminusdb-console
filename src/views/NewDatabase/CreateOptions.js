import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import CreateDb from "./CreateForm"
import { createDbCardOptions } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"
import * as view from "../../labels/createView"

export const CreateOptions = (props) => {
    const setPage = props.setPage;
    const setCreateRemote = props.setCreateRemote;
    const setCreateLocal = props.setCreateLocal;

    const handleLocal = () => {
        setPage(view.CREATE_LOCAL)
        setCreateLocal(true)
        setCreateRemote(false)
    }

    const handleRemote = () => {
        setPage(view.CREATE_REMOTE)
        setCreateLocal(false)
        setCreateRemote(true)
    }


    return (
        <>
         {<><span className="d-fl">
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

    </>)
}
