import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import {
  Elements,
} from '@stripe/react-stripe-js';

//process.env.STRIPE_TEST_PUBLISHABLE_KEY
const stripePromise = loadStripe('pk_test_gMeVkO8PvMWToY2uTezDA52D00Tpsnvy5S');

const MyStoreCheckout = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);


export default MyStoreCheckout;
