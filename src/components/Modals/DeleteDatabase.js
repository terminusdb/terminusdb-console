import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, FormText, FormGroup, Input} from 'reactstrap';
import {deleteDatabaseLabels} from '../../variables/content'
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"
import * as reportAlert from "../../labels/reportLabels"
import {DELETE_ICON} from "../../constants/images"
import { goServerHome } from '../Router/ConsoleRouter';

const DeleteDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const { woqlClient } = WOQLClientObj();
    const [rep, setReport] = useState();
    const [modal, setModal] = useState(props.modal);
    const toggle = () => setModal(!modal);

    const onDelete = (data) => {
        if(data.dbId && data.dbId == woqlClient.db()){
            woqlClient.deleteDatabase(data.dbId)
            .then((cresults) => {
                setLoading(false)
                goServerHome()
            })
            .catch((err) => {
                setReport({error: err, status: reportAlert.ERROR});
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
                    <div className="del-mod">
                        <img src={DELETE_ICON} className="center"/>
                        {rep && 
                            <APIUpdateReport report = { rep }/>
                        }
                        <form onSubmit={ handleSubmit(onDelete) }>
                            <input type="text" name="dbId" id="dbId"
                                ref = { register({ validate: value => value.length > 0}) }/>
                            <hr className = "my-space-25"/>
                            <Button color="danger">{ deleteDatabaseLabels.confirmText }</Button>
                        </form>
                    </div>
                  </Col>
           </ModalBody>
       </Modal>
    );
}

export default DeleteDatabase;
