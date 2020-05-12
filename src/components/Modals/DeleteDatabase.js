import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, FormText, FormGroup, Input} from 'reactstrap';
import {deleteDatabaseLabels} from '../../variables/content'
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Report } from "../../components/Reports/Report"
import * as reportAlert from "../../labels/reportLabels"
import history from '../../utils/history';
import { isObject } from "../../utils/helperFunctions"
import deleteImg from "../../img/icons/delete.png"
import Loading from "../Loading";

const DeleteDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const { woqlClient } = WOQLClientObj();
    const [dbId, setDbId] = useState(false);
    const [rep, setReport] = useState({});
    const [loading, setLoading] = useState(false)

    const [modal, setModal] = useState(props.modal);

    const toggle = () => setModal(!modal);

    const onDelete = (data) => {
        setDbId(data.dbId)
    }

    useEffect(() => {
  	  if(dbId){
  		  let acc = woqlClient.account() || woqlClient.uid();
  		  woqlClient.deleteDatabase(dbId, acc)
  		  .then((cresults) => {
              setLoading(false)
              history.replace('/home');
  		  })
  		  .catch((err) => {
  			 setReport({error: err, status: reportAlert.ERROR});
  		  })
  	  }
    }, [dbId]);

    return (
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> {deleteDatabaseLabels.mainDescription} </ModalHeader>
            <ModalBody>
                  <Col md={12}>
                    <div className="del-mod">
                        <img src={deleteImg} className="center"/>
                        {isObject(rep) && <Report report = { rep }/>}
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
