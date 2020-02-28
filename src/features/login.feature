Feature: Use Download Button to login into Zero
  It displays an navBar
 
  Scenario: showing the navBar
    Given mount navBar
    When verify that the user is not already authenticated
    Then showing the Download Button