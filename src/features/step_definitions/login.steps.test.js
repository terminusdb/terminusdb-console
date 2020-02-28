import { defineFeature, loadFeature } from 'jest-cucumber';
import HomeNavBar from '../../components/HomeNavBar'
import React from "react";


/*
* Functional testing means testing a slice of functionality in the system (may interact with dependencies) 
* to confirm that the code is doing the right things.
* It provides light utility functions on top of react-dom and react-dom/test-utils,
*/
import TestRenderer from 'react-test-renderer';

const feature = loadFeature('./src/features/login.feature');

defineFeature(feature, test => {
  test('showing the navBar', ({ given, when, then }) => {
    let testInstance: TestRenderer.ReactTestInstance;

    given('mount navBar', () => {
      const testRenderer = TestRenderer.create(<HomeNavBar />);
      testInstance = testRenderer.root;
    });

    when('verify that the user is not already authenticated', () => {
      // INITIALLY

    });

    then('showing the Download Button', () => {
      const divInstance = testInstance.findByProps({ id: 'qsLoginBtn' });
      expect(divInstance.props.children).toBe('Download now');
    });
  });
})

