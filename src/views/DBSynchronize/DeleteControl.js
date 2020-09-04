import { RiDeleteBin5Line, RiErrorWarningLine } from 'react-icons/ri'
import { AiOutlineDelete } from "react-icons/ai"
import {Row, Modal, ModalHeader, ModalBody, ModalFooter, Col} from "reactstrap"
import React, {useState} from 'react'
import {DELETE_DB_MODAL} from '../DBHome/constants.dbhome'
import { AiOutlineWarning } from "react-icons/ai"


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
                        <span className="delete-modal-text">  <AiOutlineWarning className="del-hub-warning" />
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
    </span>)
}

export const DeleteWidget = ({repo}) => {
    let title = `Delete Remote ${repo.title} (${repo.url})`
    return <span className="db-delete-maction"  title={title}><RiDeleteBin5Line color="#721c24" className='db-control' /> remove</span>
}
