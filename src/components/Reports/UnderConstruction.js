import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Col, Row, Label, Input} from "react-bootstrap" //replace;
import { useForm } from 'react-hook-form';
import { UNDER_CONSTRUCTION } from "./constants.reports"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UnderConstruction = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [modal, setModal] = useState(props.modal);
    const toggle = () => setModal(!modal);
    const [disabled, setDisabled] = useState(false);

    const UNDER_CONSTRUCTION_CONST=props.const_obj || UNDER_CONSTRUCTION;

    const onSubmit = (data) => {
        setDisabled(true)
        setModal(false)
    }

    const buttonClassName=props.buttonClassName || UNDER_CONSTRUCTION_CONST.buttonClassName;
    const color=props.buttonColor || UNDER_CONSTRUCTION_CONST.color;
    const buttonText=props.buttonText || UNDER_CONSTRUCTION_CONST.buttonText

    let introText = props.description || props.action + " " + UNDER_CONSTRUCTION_CONST.introText
    let hdr = props.headerText || props.action + " " + UNDER_CONSTRUCTION_CONST.headerText
    return (<>        
            <Button className={buttonClassName} outline color={color} onClick={toggle}>
                {buttonText}
            </Button>
            <Modal isOpen={modal} toggle={toggle} centered={true}>
                <ModalHeader toggle={toggle} className={UNDER_CONSTRUCTION_CONST.headerClassName}>
                    <Row >
                        {!props.noIcon && 
                        <Col md={3}>
                            
                            <FontAwesomeIcon icon={UNDER_CONSTRUCTION_CONST.icon} className={UNDER_CONSTRUCTION_CONST.iconClassName}/>
                            
                        </Col>
                        }
                        <Col md={9}>
                            {hdr}
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Col md={12}>
                        <div className={UNDER_CONSTRUCTION_CONST.introClassName}>
                            {introText}
                        </div>
                        {!props.noEmail &&
                        <div className={UNDER_CONSTRUCTION_CONST.formWrapperClassName}>
                            <a href="mailto:team@terminusdb.com" className={UNDER_CONSTRUCTION_CONST.submitButtonClassName}>
                               {UNDER_CONSTRUCTION_CONST.submitText + " " + "team@terminusdb.com"}
                            </a>
                        </div>
                        }
                    </Col>
                </ModalBody>
            </Modal>
        </>)
}
