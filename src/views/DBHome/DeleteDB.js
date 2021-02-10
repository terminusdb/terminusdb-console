import React, {useState,Fragment} from 'react'
import {Button, Row, Modal, ModalBody, Col, ModalFooter} from "react-bootstrap" //replace
import {useForm} from 'react-hook-form'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {goServerHome} from '../../components/Router/ConsoleRouter'
import {DELETE_DB_MODAL} from './constants.dbhome'
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineDelete, AiOutlineWarning } from 'react-icons/ai';

export const DeleteDB = ({meta}) => {
    const {register, handleSubmit, errors} = useForm()
    const {woqlClient, reconnectToServer} = WOQLClientObj()
    const [rep, setReport] = useState()
    const [modal, setModal] = useState(false)
    
    const showModal = (evt) => {
        console.log("___SHOW___MODAL",evt.currentTarget,evt.target)
        setModal(true)
    }

    const hideModal = () => {
        setModal(false)
    }

    const [disabled, setDisabled] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    function removeDBCard(dbid, orgid){
        dbid = dbid ||  woqlClient.db()
        orgid = orgid || woqlClient.organization()
        let dbs =  woqlClient.databases()
        let ndbs = []
        for(var i = 0; i<dbs.length; i++){
            if(!(dbs[i].id == dbid && dbs[i].organization == orgid)){
                ndbs.push(dbs[i])
            }
            else if(dbs[i].remote_record) {
                dbs[i].id = ""
                dbs[i].type = "missing"
                ndbs.push(dbs[i])
            }
        }
        woqlClient.databases(ndbs)
    }

    const onDelete = (data) => {
        setDisabled(true)
        if (data.dbId && data.dbId == woqlClient.db()) {
        //if(dbName && dbName === woqlClient.db()){
            let st = Date.now()
            woqlClient
                .deleteDatabase(data.dbId,  woqlClient.organization(), true)
                .then(() => {
                    setReport({
                        message: DELETE_DB_MODAL.deleted + ' ' + data.dbId,
                        status: TERMINUS_SUCCESS,
                        time: Date.now() - st,
                    })
                    removeDBCard()
                    reconnectToServer()
                    setDisabled(false)
                    woqlClient.db(false)
                    goServerHome()
                })
                .catch((err) => {
                    setDisabled(false)
                    setReport({
                        error: err,
                        message: DELETE_DB_MODAL.failed + ' ' + data.dbId,
                        status: TERMINUS_ERROR,
                        time: Date.now() - st,
                    })
                })
        } else {
            //setModal(false)
            alert(DELETE_DB_MODAL.error)
            setDisabled(false)
        }
    }

    function uip(e){
        if(e && e.target){
            setDeleteConfirm(e.target.value == meta.id)
        }
    }


    return (
        <Fragment>
            <span className='delete-control' onClick={showModal}>
                <span className="db-action"  title="Delete Database">
                    <RiDeleteBin5Line color="#721c24" className='db-control' />
                    <span style={{color: "#721c24"}}> delete</span>
                </span>
            </span>
            <Modal show={modal} onHide={hideModal}>
                <Modal.Header closeButton>  <span className="modal-head">Delete Local Database</span> </Modal.Header>
                <form onSubmit={handleSubmit(onDelete)}>
                <ModalBody>
                    <Row key="rd">
                        <Col md={12} className="delete-modal-col-align">
                            <div className="delete-modal-text"> <AiOutlineWarning className="del-hub-warning" />This will delete your local database but will not effect the linked remote which will still be available in your hub account.</div><br/>
                            <div className="delete-modal-text"><span>{DELETE_DB_MODAL.message}</span> <b>{woqlClient.db()}</b></div>
                        </Col>
                    </Row>

                    <Row key="rr">
                        {rep && <TerminusDBSpeaks report={rep} />}
                            <div className="del-mod">

                                   {/* <Row key="rm" className="del-mod-row">
                                        <Col md={2}>
                                            <input type="checkbox" className="tcf-checkbox" name="delete-remote" id="delete-remote" value="delete-remote"/>
                                        </Col>
                                        <Col md={10}>
                                            <label className="tcf-checkbox-label tcf-label-modal-align" for="remote-db">Delete remote database?</label>
                                        </Col>
                                    </Row> */}

                                    <input
                                        name="dbId"
                                        placeholder= {DELETE_DB_MODAL.placeholder}
                                        className = "tcf-input tcf-inp-center"
                                        onChange ={uip}
                                        ref={register({
                                          validate: (value) => value.length > 0
                                        })}
                                    />

                            </div>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <span className="delete-button">
                        {!deleteConfirm &&
                            <button className={"tdb__button__base tdb__button__cancel"} onClick={hideModal}>Cancel</button>
                        }
                        {deleteConfirm &&
                            <button className="tdb__button__base tdb__button__base--bred" >
                                <AiOutlineDelete className="delete-modal-icon"/> {DELETE_DB_MODAL.confirmLocal}
                            </button>
                        }
                    </span>

                </ModalFooter>
                </form>
            </Modal>
        </Fragment>
    )
}
