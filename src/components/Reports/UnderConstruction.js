import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Col, Row} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { UNDER_CONSTRUCTION } from "./constants.reports"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UnderConstruction = (props) => {
    const { register, handleSubmit, errors } = useForm();
    //const {woqlClient,reconnectServer} = WOQLClientObj();
    //const [rep, setReport] = useState();
    const [modal, setModal] = useState(props.modal);
    const toggle = () => setModal(!modal);
    const [disabled, setDisabled] = useState(false);

    const onSubmit = (data) => {
        setDisabled(true)
        setModal(false)
    }

    let introText = props.action + " " + UNDER_CONSTRUCTION.introText
    let hdr = props.action + " " + UNDER_CONSTRUCTION.headerText
    return (<>
        {!modal &&
           <Button className={UNDER_CONSTRUCTION.buttonClassName} onClick={toggle}>
               {UNDER_CONSTRUCTION.buttonText}
            </Button>
        }
        <Modal isOpen={modal} toggle={toggle} centered={true}>
            <ModalHeader toggle={toggle} className={UNDER_CONSTRUCTION.headerClassName}>
                <Row>
                    <Col md={3}>
                        <FontAwesomeIcon icon={UNDER_CONSTRUCTION.icon} className={UNDER_CONSTRUCTION.iconClassName}/>
                    </Col>
                    <Col md={9}>
                        {hdr}
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Col md={12}>
                    <div className={UNDER_CONSTRUCTION.introClassName}>
                        {introText}
                    </div>
                    <div className={UNDER_CONSTRUCTION.formWrapperClassName}>
                        <form onSubmit={ handleSubmit(onSubmit) }>
                            <hr className="my-space-25"/>
                            <input
                                type="text"
                                name="useremail"
                                id="useremail"
                                placeholder={UNDER_CONSTRUCTION.emailPlaceholder}
                                ref = { register({ validate: value => value.length > 0}) }
                            />
                            <hr className="my-space-25"/>
                            <textarea
                                placeholder={UNDER_CONSTRUCTION.messagePlaceholder}
                                name="usermessage"
                                id="usermessage"
                                ref = { register({ validate: value => value.length > 0}) }
                            />
                            <hr className = "my-space-25"/>
                            <Button disabled={disabled}>{ UNDER_CONSTRUCTION.submitText }</Button>
                            <hr className = "my-space-25"/>
                        </form>
                    </div>
                </Col>
            </ModalBody>
        </Modal>
    </>)
}
