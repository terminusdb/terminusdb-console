import React, {useState} from 'react'
import {Button, Modal, ModalHeader, ModalBody, Col} from 'reactstrap'
import {useForm} from 'react-hook-form'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {DELETE_ICON} from '../../constants/images'
import {TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {goServerHome} from '../../components/Router/ConsoleRouter'
import {DELETE_DB_MODAL} from '../DBManage/constants.dbmanage'

export const DeleteDB = (props) => {
    const {register, handleSubmit, errors} = useForm()
    const {woqlClient, reconnectToServer} = WOQLClientObj()
    const [rep, setReport] = useState()
    const [modal, setModal] = useState(props.modal)
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
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> {DELETE_DB_MODAL.prompt} </ModalHeader>
            <ModalBody>
                <Col md={12}>
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
                </Col>
            </ModalBody>
        </Modal>
    )
}
