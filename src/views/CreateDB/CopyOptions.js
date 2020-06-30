import React from 'react'
import {Col, Row} from 'reactstrap'
import {DatabaseCard} from './DatabaseCard'
import {
    OPTIONS_PANE_CSS,
    OPTIONS_PANE_COL_CSS,
    CARD_CONTAINER_CSS,
    COPY_CARD,
} from './constants.createdb'

export const CopyOptions = (props) => {
    return (
        <Row className={OPTIONS_PANE_CSS}>
            <Col className={OPTIONS_PANE_COL_CSS}>
                <div
                    id={COPY_CARD.local.id}
                    onClick={props.setLocal}
                    className={CARD_CONTAINER_CSS}
                >
                    <DatabaseCard card={COPY_CARD.local} />
                </div>
            </Col>

            <Col className={OPTIONS_PANE_COL_CSS}>
                <div
                    id={COPY_CARD.remote.id}
                    onClick={props.setRemote}
                    className={CARD_CONTAINER_CSS}
                >
                    <DatabaseCard card={COPY_CARD.remote} />
                </div>
            </Col>
        </Row>
    )
}
