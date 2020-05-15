import React, { useState } from "react";
import { CommitViewerText } from "../../variables/formLabels"
import { Container, Row, Col } from "reactstrap";
import {printts, DATETIME_FULL} from "../../utils/dateFormats"

export const CommitView = (props) => {
    if(!props.commit) return <div/>
    return (
        <Col>
            <Row>
                <span className="commit-view-header">
                    {printts(props.commit.time, DATETIME_FULL) + " - " + props.commit.author}
                </span>
            </Row>
            <Row>
                <span className="commit-view-id">
                    {props.commit.id}
                </span>
            </Row>
            <Row>
                <span className="commit-view-message">
                    {props.commit.message}
                </span>
            </Row>
        </Col>
    )
}


