import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Col} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
import { DELETE_ICON } from "../../constants/images"
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from "../../constants/identifiers"
import { goServerHome } from '../../components/Router/ConsoleRouter';
import { DELETE_DB_MODAL } from "./constants.dbmanage"

export const DeleteDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const {woqlClient,reconnectServer} = WOQLClientObj();
    const [rep, setReport] = useState();
    const [modal, setModal] = useState(props.modal);
    const toggle = () => setModal(!modal);
    const [disabled, setDisabled] = useState(false);

    const onDelete = (data) => {
        setDisabled(true);
        if(data.dbId && data.dbId == woqlClient.db()){
            let st = Date.now()
            woqlClient.deleteDatabase(data.dbId)
            .then(() => {
                setReport({message: DELETE_DB_MODAL.deleted + " " + data.dbId, status: TERMINUS_SUCCESS, time: Date.now() - st});
                reconnectServer()
                goServerHome()
                setDisabled(false)
            })
            .catch((err) => {
                setDisabled(false)
                setReport({error: err, message: DELETE_DB_MODAL.failed + " " + data.dbId, status: TERMINUS_ERROR, time: Date.now() - st});
            })
        }
        else {
            setModal(false)
            alert(DELETE_DB_MODAL.error)
        }
    }

    return (
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> {DELETE_DB_MODAL.prompt} </ModalHeader>
            <ModalBody>
                <Col md={12}>
                    {rep &&
                        <APIUpdateReport message = { rep.message } error={rep.error} status={rep.status} time={rep.time} />
                    }
                    <div className="del-mod">
                        <img src={DELETE_ICON} className="center"/>
                        <form onSubmit={ handleSubmit(onDelete) }>
                            <input 
                                type="text" 
                                name="dbId" 
                                id="dbId"
                                ref = { register({ validate: value => value.length > 0}) }
                            />
                            <hr className = "my-space-25"/>
                            <Button color="danger" disabled={disabled}>
                                { DELETE_DB_MODAL.confirm }
                            </Button>
                        </form>
                    </div>
                  </Col>
           </ModalBody>
       </Modal>
    );
}

