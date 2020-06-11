import { createLocalDB, removeLocalDB, addSchema } from "./utils/dbLifeCircle"
import { flickThroughSchemaTabs } from "./utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"

context('Create database and add schema locally', () => {
   let dbid;

   before(() => {
       cy.visit('http://localhost:3005');
       dbid=`mydb_${Date.now()}`
   })

   it('Create database', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains(tabs.CREATEDB_TITLE)
        .click().then(() => {
            cy.wait(1000);
            createLocalDB(dbid)
        })
    })

    it('Add Schema', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Query')
        .click().then(() => {
			cy.wait(1000)
            addSchema(dbid)
        })
    })

	it('View Schema tabs', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Schema')
        .click({force: true}).then(() => {
			cy.wait(1000)
            flickThroughSchemaTabs()
        })
    })

})
