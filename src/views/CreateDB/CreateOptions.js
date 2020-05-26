import React from "react";
import { Col, Row } from "reactstrap";
import { DatabaseCard } from "./DatabaseCard"
import { OPTIONS_PANE_CSS, OPTIONS_PANE_COL_CSS, CARD_CONTAINER_CSS, CREATE_CARD } from "./constants.createdb";

export const CreateOptions = (props) => {
    
    return (
        <Row className={OPTIONS_PANE_CSS} >
            <Col className={OPTIONS_PANE_COL_CSS}>
                <div onClick={props.setLocal} className={CARD_CONTAINER_CSS}>
                    <DatabaseCard card = {CREATE_CARD.local}/>
                </div>
            </Col>

            <Col className={OPTIONS_PANE_COL_CSS}>
                <div onClick={props.setRemote} className={CARD_CONTAINER_CSS}>                           
                    <DatabaseCard card = {CREATE_CARD.remote}/>
                </div>
            </Col>
        </Row>
    )
}
