import {createLocalDB,removeLocalDB} from "./utils/dbLifeCircle"
import * as tabs from "../../../src/views/Pages/constants.pages"

context('Create and delete a database locally', () => {
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
            cy.wait(2000);
        })
    })

    it('Delete database', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains(tabs.MANAGE_TAB)
        .click().then(() => {
            cy.wait(1000);
            removeLocalDB(dbid)
        })
   })

})
