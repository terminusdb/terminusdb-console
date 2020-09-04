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


Cypress.Commands.add('loginAndLogout', (overrides = {}) => {
    const auth0Url = Cypress.env('auth0Url')
    const role = Cypress.env('role')

    cy.server().route("POST", auth0Url).as('auth0');
    cy.server().route("POST", `**/api/woql/_system`).as('system');
    cy.server().route("POST", role).as('role');

    cy.get("body").then($body => {
         if ($body.find("button.nav__main__login").length > 0) {
             cy.get('button.nav__main__login').click().then(() => {
                cy.wait(1000)
                cy.wait(1000)

                if ($body.find('input[type=text]').length > 0) {

                       const username = Cypress.env('userName')
                       const password = Cypress.env('userNamePassword')

                       cy.get('input[type=text]').focus().type(username)
                       cy.get('input[type=password]').focus().type(password)

                       cy.get('.auth0-label-submit').click().then(() => {
                           cy.wait(1000);
                           cy.wait("@auth0").its('status').should('eq', 200);
                           cy.wait("@system").its('status').should('eq', 200);
                           cy.wait("@role").then(() => {
                               cy.get('button.nav__main__profile__button').click()
                               cy.wait(1000)
                               cy.get('div.tdb__dropdown__content').find('a[href="/"]')
                               .click().then(() => {
                                   cy.wait(1000);
                               })
                           })
                       })
                }
             })

        }
    })
});


Cypress.Commands.add('login', (overrides = {}) => {
    const auth0Url = Cypress.env('auth0Url')
    const role = Cypress.env('role')

    cy.server().route("POST", auth0Url).as('auth0');
    cy.server().route("POST", `**/api/woql/_system`).as('system');
    cy.server().route("POST", role).as('role');

    cy.get("body").then($body => {
         if ($body.find("button.nav__main__login").length > 0) {
             cy.get('button.nav__main__login').click().then(() => {
                cy.wait(1000)
                cy.wait(1000)

                if ($body.find('input[type=text]').length > 0) {
                       const username = Cypress.env('userName')
                       const password = Cypress.env('userNamePassword')

                       cy.get('input[type=text]').focus().type(username)
                       cy.get('input[type=password]').focus().type(password)

                       cy.get('.auth0-label-submit').click().then(() => {
                           cy.wait(1000);
                           cy.wait("@auth0").its('status').should('eq', 200);
                           cy.wait("@system").its('status').should('eq', 200);
                           cy.wait("@role").then(() => {
                               return true
                           })
                       })
                }
             })

        }
    })
});
