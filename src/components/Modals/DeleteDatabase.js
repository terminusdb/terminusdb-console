import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, FormText, FormGroup, Input} from 'reactstrap';
import {deleteDatabaseLabels} from '../../variables/content'
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
import {DELETE_ICON} from "../../constants/images"
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from "../../constants/identifiers"
import { goServerHome } from '../Router/ConsoleRouter';


const DeleteDatabase = (props) => {
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
                setReport({message: "Deleted Database " + data.dbId, status: TERMINUS_SUCCESS, time: Date.now() - st});
                alert("whasup")
                reconnectServer()
                alert("pussycat")
                goServerHome()
                alert("yo")
                setDisabled(false)
            })
            .catch((err) => {
                setDisabled(false)
                setReport({error: err, message: "Failed to Delete Database " + data.dbId, status: TERMINUS_ERROR, time: Date.now() - st});
            })
        }
        else {
            setModal(false)
            alert("Error - the database ID was incorrect")
        }
    }

    return (
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> {deleteDatabaseLabels.mainDescription} </ModalHeader>
            <ModalBody>
                <Col md={12}>
                    {rep &&
                        <APIUpdateReport message = { rep.message } error={rep.error} status={rep.status} time={rep.time} />
                    }                        
                    <div className="del-mod">
                        <img src={DELETE_ICON} className="center"/>
                        <form onSubmit={ handleSubmit(onDelete) }>
                            <input type="text" name="dbId" id="dbId"
                                ref = { register({ validate: value => value.length > 0}) }/>
                            <hr className = "my-space-25"/>
                            <Button color="danger" disabled={disabled}>{ deleteDatabaseLabels.confirmText }</Button>
                        </form>
                    </div>
                  </Col>
           </ModalBody>
       </Modal>
    );
}

export default DeleteDatabase;
