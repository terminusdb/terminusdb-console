import React, {useState} from 'react'
import {Button, Row, Modal, ModalHeader, ModalBody, Col, ModalFooter} from 'reactstrap'
import {useForm} from 'react-hook-form'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {DELETE_ICON} from '../../constants/images'
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {goServerHome} from '../../components/Router/ConsoleRouter'
import {DELETE_DB_MODAL} from './constants.dbhome'
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineDelete } from 'react-icons/ai';

export const DeleteDB = (props) => {
    const {register, handleSubmit, errors} = useForm()
    const {woqlClient, reconnectToServer} = WOQLClientObj()
    const [rep, setReport] = useState()
    const [modal, setModal] = useState()
    const toggle = () => setModal(!modal)
    const [disabled, setDisabled] = useState(false)

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
            let st = Date.now()
            woqlClient
                .deleteDatabase(data.dbId,  woqlClient.organization())
                .then(() => {
                    setReport({
                        message: DELETE_DB_MODAL.deleted + ' ' + data.dbId,
                        status: TERMINUS_SUCCESS,
                        time: Date.now() - st,
                    })
                    removeDBCard()
                    reconnectToServer()
                    setDisabled(false)
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

    return (
        <span className='delete-control' onClick={toggle}>

            <span className="db-action"  title="Delete Database">
                <RiDeleteBin5Line color="#721c24" className='db-control' />
            </span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}/>
                <ModalBody>

                    <Row key="re">
                        <span className="modal-head">Delete Local Database?</span>
                    </Row>
                    <Row key="rd">
                        <Col md={12} className="delete-modal-col-align">
                            <span className="delete-modal-text"> This action will remove your local database, but will be available remotely.
                            {DELETE_DB_MODAL.message} {woqlClient.db()} </span>
                        </Col>
                    </Row>

                    <Row key="rr">
                        {rep && <TerminusDBSpeaks report={rep} />}
                            <div className="del-mod">
                                <form onSubmit={handleSubmit(onDelete)}>
                                    <Row key="rm" className="del-mod-row">
                                        <Col md={2}>
                                            <input type="checkbox" class="tcf-checkbox" name="delete-remote" id="delete-remote" value="delete-remote"/>
                                        </Col>
                                        <Col md={10}>
                                            <label class="tcf-checkbox-label" for="remote-db">Delete remote database?</label>
                                        </Col>
                                    </Row>
                                    <input
                                        type="text"
                                        name="dbId"
                                        id="dbId"
                                        className = "tcf-input"
                                        ref={register({validate: (value) => value.length > 0})}
                                        placeholder= {DELETE_DB_MODAL.placeholder}
                                    />
                                </form>
                            </div>
                    </Row>

                    {/*<Col md={12}>
                        {rep && <TerminusDBSpeaks report={rep} />}
                        <div className="del-mod">
                            <p className="del-message">
                                {' '}
                                {DELETE_DB_MODAL.message} {woqlClient.db()}
                            </p>
                            <img src={DELETE_ICON} className="center" />
                            <form onSubmit={handleSubmit(onDelete)}>
                                <input
                                    type="text"
                                    name="dbId"
                                    id="dbId"
                                    ref={register({validate: (value) => value.length > 0})}
                                />
                                <hr className="my-space-25" />
                                <Button color="danger" disabled={disabled}>
                                    {DELETE_DB_MODAL.confirm}
                                </Button>
                            </form>
                        </div>
                    </Col>*/}
                </ModalBody>
                <ModalFooter>
                    <button className="tdb__button__base tdb__button__base--bred delete-modal-button"  onClick={onDelete}>
                        <AiOutlineDelete color="#dc3545" className="delete-modal-icon"/>
                        {DELETE_DB_MODAL.confirm}
                    </button>
                </ModalFooter>
            </Modal>
        </span>
    )
}
