import React, { useState, useEffect } from "react";
import { Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import { CopyType } from "./CopyType"
import { copyDbCardOptions } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"
import * as view from "../../labels/createView"

export const CopyFrom = (props) => {
    const setPage = props.setPage;
    const setLocal = props.setLocal;
    const setRemote = props.setRemote

    const handleLocal = () => {
        setLocal(true)
        setRemote(false)
        setPage(view.COPY_TYPES)
    }

    const handleRemote = () => {
        setRemote(true)
        setLocal(false)
        setPage(view.COPY_TYPES)
    }

    return (
        <>
         {<div className="card-grid">
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
    </div>}

    </>)
}
