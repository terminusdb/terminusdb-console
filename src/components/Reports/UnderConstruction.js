import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Col} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { UNDER_CONSTRUCTION } from "./constants.reports"

export const UnderConstruction = (props) => {
    const { register, handleSubmit, errors } = useForm();
    //const {woqlClient,reconnectServer} = WOQLClientObj();
    //const [rep, setReport] = useState();
    const [modal, setModal] = useState(props.modal);
    const toggle = () => setModal(!modal);
    const [disabled, setDisabled] = useState(false);

    const onSubmit = (data) => {
        setDisabled(true)
        alert(JSON.stringify(data))
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
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> {hdr} </ModalHeader>
            <ModalBody>
                <Col md={12}>
                    <div className={UNDER_CONSTRUCTION.introClassName}>
                        {introText}
                    </div>
                    <div className={UNDER_CONSTRUCTION.formWrapperClassName}>
                        <form onSubmit={ handleSubmit(onSubmit) }>
                            <input 
                                type="text" 
                                name="useremail" 
                                id="useremail"
                                placeholder={UNDER_CONSTRUCTION.emailPlaceholder}
                                ref = { register({ validate: value => value.length > 0}) }
                            />
                            <textarea 
                                placeholder={UNDER_CONSTRUCTION.messagePlaceholder} 
                                name="usermessage" 
                                id="usermessage"
                                ref = { register({ validate: value => value.length > 0}) }
                            />
                            <hr className = "my-space-25"/>
                            <Button disabled={disabled}>{ UNDER_CONSTRUCTION.submitText }</Button>
                        </form>
                    </div>
                </Col>
            </ModalBody>
        </Modal>
    </>)
}

