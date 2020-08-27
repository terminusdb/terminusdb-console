import { RiDeleteBin5Line, RiErrorWarningLine } from 'react-icons/ri'
import { AiOutlineDelete } from "react-icons/ai"
import {Row, Modal, ModalHeader, ModalBody, ModalFooter, Col} from "reactstrap"
import React, {useState} from 'react'
import {DELETE_DB_MODAL} from '../DBHome/constants.dbhome'


export const DeleteControl = ({repo, onDelete}) => {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    return (<span className='delete-control' onClick={toggle}>
        <DeleteWidget repo={repo} />
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}> <span className="modal-head">Delete Remote</span> </ModalHeader>
            <ModalBody>
                <Row key="rd">
                    <Col md={12} className="delete-modal-col-align">
                        <span className="delete-modal-text">
                            This action will remove the connection to the remote database - it will not effect your local database, but you will no longer be able to push and pull updates.
                        </span>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <span className="delete-button">
                    <button className="tdb__button__base tdb__button__base--bred delete-modal-button"  onClick={onDelete}>
                        <AiOutlineDelete className="delete-modal-icon"/>
                        {DELETE_DB_MODAL.confirmRemote}
                    </button>
                    <button className={"tdb__button__base tdb__button__cancel"} onClick={toggle}>Cancel</button>
                </span>
            </ModalFooter>
        </Modal>
        {/*<Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}></ModalHeader>
            <ModalBody className="delete-modal-body">
                <Row>
                    <Col md={2}>
                        <RiErrorWarningLine color="#ff9800" className="delete-modal-icon"/>
                    </Col>
                    <Col md={10} className="delete-modal-col-align">
                        <span className="warning-modal-text">This action will remove the connection to the remote database - it will not effect your local database, but you will no longer be able to push and pull updates. </span>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
            <button className="tdb__button__base tdb__button__base--bred"  onClick={onDelete}>Delete</button>
            </ModalFooter>
        </Modal>*/}
    </span>)
}

export const DeleteWidget = ({repo}) => {
    let title = `Delete Remote ${repo.title} (${repo.url})`
    return <span className="db-action"  title={title}><RiDeleteBin5Line color="#721c24" className='db-control' /></span>
}
