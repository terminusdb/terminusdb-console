import { createLocalDB, removeLocalDB, addSchema, addDocuments } from "./utils/dbLifeCircle"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { getDocumentsMetaData } from "./utils/definedActions"

/*
*	1.	Create a new db
*	2.	Load Bikes Schema
*	3.	Load Bikes Documents
*/

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

	it('Add Documents', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('button')
        .contains('Add New Query Pane')
        .click().then(() => {
			cy.wait(1000)
            addDocuments(dbid)
        })
    })

	it('View Documents', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Documents')
        .click({force: true}).then(() => {
			cy.wait(1000)
        })
    })

	it('Query All Schema Elements', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Query')
        .click().then(() => {
			cy.wait(1000)
			getDocumentsMetaData()
        })
    })

	it('Go to database home page', () => {
        cy.wait(2000);
        const dbHomeRef = "#/db/admin/" + dbid + "/"
        cy.get('#terminus-console-page')
        .find('a[href="'+ dbHomeRef +'"]')
        .click().then(() => {
            cy.wait(1000);
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
