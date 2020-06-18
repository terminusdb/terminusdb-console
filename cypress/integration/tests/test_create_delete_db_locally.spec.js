import { createLocalDB, addSchema, removeLocalDB } from "./utils/dbLifeCircle"
import { flickThroughSchemaTabs, getSchemaElements } from "./utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { config } from "./utils/config"

/*
*	1.	Create a new db
*	2.	Deletes the db
*/

context('Create and delete a database locally', () => {

   before(() => {
       cy.visit('http://localhost:3005');
   })

    config.forEach((database) => {
        let dbid = database.name + Date.now();

        /***** Creating database ****/
        it('Creating database ' + database.name, () => {
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

        /***** Add schema ****/
        it('Add Schema', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Query')
            .click().then(() => {
    			cy.wait(1000)
                addSchema(database)
            })
        })

        /***** View schema ****/
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

        /***** Query Schema Elements  ****/
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

        /***** Go to Home Page  ****/
        it('Go to database home page', () => {
            cy.wait(2000);
            const dbHomeRef = "#/db/admin/" + dbid + "/"
            cy.get('#terminus-console-page')
            .find('a[href="'+ dbHomeRef +'"]')
            .click().then(() => {
                cy.wait(1000);
            })
        })

        /***** Deleting database ****/
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
})
