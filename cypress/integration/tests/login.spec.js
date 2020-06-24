context('check connection', () => {
    before(() => {
        cy.visit('/')
    })

    it('Login to console', () => {
        cy.wait(3000)
        cy.get('#tdbPassword').type("root")
        cy.get('#tdbSubmit').click()
    })
})

/*
https://testing.dcm.ist, http://localhost:3000, http://localhost/auth0-hooks-context/, https://terminusdb.com/hubtest, https://myconsole.com, https://9c003056.ngrok.io/, http://localhost:6363/console/, http://localhost:3005,
https://127.0.0.1:6363/*/
