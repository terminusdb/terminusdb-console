import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
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
         {<Row className="col-md-12 justify-content-center" >
                <Col className="col-md-5">
                    <div onClick={handleLocal} className="square db-view-cards">
                        <DatabaseCard card = {copyDbCardOptions.local}/>
                    </div>
                </Col>

                <Col className="col-md-5">
                    <div onClick={handleRemote} className="square db-view-cards">                           
                        <DatabaseCard card = {copyDbCardOptions.remote}/>
                    </div>
                </Col>
        </Row>}

    </>)
}

/*
<div className="card-grid">
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
    </div>*/
