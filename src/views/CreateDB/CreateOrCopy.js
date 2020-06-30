import React from 'react'
import {Col, Row} from 'reactstrap'
import {DatabaseCard} from './DatabaseCard'
import {
    OPTIONS_PANE_CSS,
    OPTIONS_PANE_COL_CSS,
    CARD_CONTAINER_CSS,
    CREATE_OR_COPY_CARD,
} from './constants.createdb'

export const CreateOrCopy = (props) => {
    return (
        <Row className={OPTIONS_PANE_CSS}>
            <Col className={OPTIONS_PANE_COL_CSS}>
                <div
                    id={CREATE_OR_COPY_CARD.create.id}
                    onClick={props.setCreate}
                    className={CARD_CONTAINER_CSS}
                >
                    <DatabaseCard card={CREATE_OR_COPY_CARD.create} />
                </div>
            </Col>

            <Col className={OPTIONS_PANE_COL_CSS}>
                <div
                    id={CREATE_OR_COPY_CARD.copy.id}
                    onClick={props.setCopy}
                    className={CARD_CONTAINER_CSS}
                >
                    <DatabaseCard card={CREATE_OR_COPY_CARD.copy} />
                </div>
            </Col>
        </Row>
    )
}
