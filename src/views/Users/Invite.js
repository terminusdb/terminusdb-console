import React from 'react';
import { FormGroups } from "../../components/Form/FormGroups"
import { Modal, ModalBody, ModalFooter, Button} from "react-bootstrap" //replaced;


export const InviteModal = (props) => {
    return (
        <Modal show={props.isOpen} onHide={props.toggle}>
             <Modal.Header closeButton>Invite Users</Modal.Header>
             <ModalBody>
                 You can Invite users to access this database
                 <FormGroups type= "text"
                             name="email"
                             description="Via Email"
                             input/>
                 <FormGroups type= "select"
                             name="user_list"
                             description="Add Users locally"
                             select/>
             </ModalBody>
             <ModalFooter>
                 <Button color="primary" onClick={props.toggle}>Invite</Button>{' '}
             </ModalFooter>
       </Modal>
    )
}
