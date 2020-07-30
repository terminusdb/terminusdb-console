context('check connection', () => {

    before(() => {
        cy.visit('/')
    })

    it('Login to Auth0', () => {
        cy.wait(4000);
        cy.login();
        /*cy.get("body").then($body => {

              if ($body.find("button.nav__main__login").length > 0) {
                  cy.get('button.nav__main__login').click()
              }
         })*/
    })

})
