// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (overrides = {}) => {
    cy.get("body").then($body => {
         if ($body.find("button.nav__main__login").length > 0) {
             cy.clearCookies()
             cy.get('button.nav__main__login').click()
             cy.wait(1000)
             const username = Cypress.env('userName')
             const password = Cypress.env('userNamePassword')
             console.log('username', username)
             console.log('password', password)
             cy.get('input[type=text]').focus().type(username)
             cy.get('input[type=password]').focus().type(password)
             cy.get('.auth0-label-submit').click()
         }
    })
});
