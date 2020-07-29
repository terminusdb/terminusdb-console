context('check connection', () => {

    before(() => {
        cy.visit('/')
    })

    it('Login to Auth0', () => {
    	 cy.wait(4000);
    	 cy.get("body").then($body => {

    	 	 if ($body.find("button.nav__main__login").length > 0) {
    	 	 	cy.get('button.nav__main__login').click()
    	 	 }
    	 })//login_button
    })

})

/*
https://testing.dcm.ist, http://localhost:3000, http://localhost/auth0-hooks-context/, https://terminusdb.com/hubtest, https://myconsole.com, https://9c003056.ngrok.io/, http://localhost:6363/console/, http://localhost:3005,
https://127.0.0.1:6363/*/
