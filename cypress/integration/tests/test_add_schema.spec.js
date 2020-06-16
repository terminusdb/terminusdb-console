import { createLocalDB, removeLocalDB, addSchema } from "./utils/dbLifeCircle"
import { flickThroughSchemaTabs, getSchemaElements } from "./utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"

/*
*	1.	Create a new db
*	2.	Loads Bikes Schema
*	3.	Views provides schema views - Classes| Properties | OWL | URL Prefixes| Graphs
*	4.	Query to view all schema elements in Table | Graph view
*   5.  Delete Database
*/

context('Create database and add schema', () => {
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

	it('Query All Schema Elements', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Query')
        .click().then(() => {
			cy.wait(1000)
            getSchemaElements()
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
