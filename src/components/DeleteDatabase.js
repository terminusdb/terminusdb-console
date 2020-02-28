
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {deleteDatabaseLabels} from '../variables/content'

const DeleteDatabaseModal = (props) => {
  const {
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="danger" onClick={toggle}>{deleteDatabaseLabels.title}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Form>
            <Row form className="mt-4">
              <Col md={8}>
                <FormGroup>
                  <FormText>{deleteDatabaseLabels.confirmText}</FormText>
                  <Input type="text" name="dbname" id="dbname"/>
                </FormGroup>
              </Col>
            </Row>
          </Form>
       </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Delete Database</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default DeleteDatabaseModal;
