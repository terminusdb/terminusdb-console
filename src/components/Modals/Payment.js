import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import { StripeProvider } from 'react-stripe-elements';
import MyStoreCheckout from '../Payment/MyStoreCheckout';
import { STRIPE_TEST_PUBLISHABLE_KEY } from '../../config/localSettings'

export const PaymentModal = (props) => {
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle}>
             <ModalHeader toggle={props.toggle}>Upgrade to Pro</ModalHeader>
             <ModalBody>
                 <StripeProvider apiKey={STRIPE_TEST_PUBLISHABLE_KEY}>
                     <MyStoreCheckout/>
                 </StripeProvider>
             </ModalBody>
       </Modal>
    )
}
