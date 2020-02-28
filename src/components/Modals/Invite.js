import React from 'react';
import { FormGroups } from "../Form/FormGroups"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";


export const InviteModal = (props) => {
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle}>
             <ModalHeader toggle={props.toggle}>Invite Users</ModalHeader>
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
