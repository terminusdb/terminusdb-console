import { episode_1_database } from "./utils/config"
import { importAndExportCSV } from "./utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { createLocalDB, removeLocalDB } from "./utils/dbLifeCircle"

context('Run test for the one where Sarah imports a csv, queries to tidy up data and exports the csv in Canary', () => {

    before(() => {
       cy.visit('/');
    })

    describe('Test episode 1', () => {

		const password = Cypress.env('password');
		const database = episode_1_database;
        const dbId = database.name
        const user = false


		it('User Login', () => {
            cy.get("body").then($body => {
                if ($body.find("#tdbPassword").length > 0) {
                      cy.get("#tdbPassword").focus().type(password).then(()=>{
                          cy.get("#tdbSubmit").click();
                  })
                }
            })
        })

        /***** Creating database ****/
        it('Creating database',() => {
            cy.wait(5000);

            cy.get("#terminus-console-page").then(async($consolePage)=>{

                if ($consolePage.find(`a:contains('${tabs.CREATEDB_TITLE}')`).length > 0) {   //evaluates as true
                    await cy.get('#terminus-console-page').find('a').contains(tabs.CREATEDB_TITLE).click()//.then(async() => {
                    cy.wait(1000);
                    await createLocalDB(dbId, user)
                }else{
                    await createLocalDB(dbId, user);
                }
            })
        })

        /***** Write query to import and export csv  ****/
       it('Run query to import and export csv', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Query')
            .click().then(async() => {
    			cy.wait(1000)
                await importAndExportCSV(dbId)
            })
        })

        /***** Go to Home Page  ****/
       it('Go to database home page', () => {
            cy.wait(5000);
            const dbHomeRef = "/db/admin/" + dbId + "/"
            cy.get('#terminus-console-page').get('.console__page__header').get('.nav__main').find('ul').find('li')
            .find('a[href="'+ dbHomeRef +'"]')
            .click().then(() => {
                cy.wait(1000);
            })
        })

        /***** Deleting database ****/
        it('Delete database', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains(tabs.MANAGE_TAB)
            .click().then(async () => {
                cy.wait(1000);
                await removeLocalDB(dbId)
            })
       })

    })
})
