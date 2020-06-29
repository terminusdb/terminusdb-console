import React, {useState} from 'react'
import {
    TOOLBAR_CSS,
} from '../Schema/constants.schema'
import {ADD_COLLABORATORS_BUTTON, REMOVE_COLLABORATORS_BUTTON} from './constants.dbcollaborate'
import {Row, Col, Button} from 'reactstrap'

export const CollaborateToolbar = ({
    editmode,
    onAdd,
    onRemove,
    onCancel,
    onSubmit,
}) => {
    
    return (
        <Row className={TOOLBAR_CSS.container}>
            <Col>
                <Button key="cancel" className={TOOLBAR_CSS.updateOWLButton} onClick={onRemove}>
                    {REMOVE_COLLABORATORS_BUTTON}
                </Button>
            </Col>
            <Col>
                <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={onAdd}>
                    {ADD_COLLABORATORS_BUTTON}
                </Button>
            </Col>                        
        </Row>
    )
}
