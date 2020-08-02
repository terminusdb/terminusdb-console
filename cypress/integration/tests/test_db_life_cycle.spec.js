import { createLocalDB, addSchema, removeLocalDB, addDocuments,runQueries } from "../../fixtures/utils/dbLifeCircle"
import {  flickThroughSchemaTabs, getSchemaElements, getDocumentsMetaData } from "../../fixtures/utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { config } from "../../fixtures/utils/config"

/*    ----- not user is not logged in this test -----
*   1.	Create a new db
*   2.	Loads Bikes Schema
*   3.	Views provides schema views - Classes| Properties | OWL | URL Prefixes| Graphs
*   4.	Query to view all schema elements in Table | Graph view
*   5.  Load documents
*   6.	View Documents
*   7.  Query all documents
*   8.  Query to select
*   9.  Swap between table| Graph View
*   10. Delete Database
*   11. Perform the above 10 steps for political-data
*/
config.forEach((db) => {

    const database=db;

    context('Run the entire life cycle of a database', () => {

        before(() => {
           cy.visit('/');
        })


        describe('Database life Circle', () => {
            
            const user = false
            /*const password = Cypress.env('password');
            it('the user need to login', () => {
                cy.get("body").then($body => {
                    if ($body.find("#tdbPassword").length > 0) {
                          cy.get("#tdbPassword").focus().type(password).then(()=>{
                              cy.get("#tdbSubmit").click();
                      })
                    }
                })
            })*/

       
            /***** Creating database ****/
            it('Creating database',() => {
                

                cy.log("___DATABASE___", database.name)

                cy.wait(5000);

                cy.get("#terminus-console-page").then(async($consolePage)=>{

                    if ($consolePage.find(`a:contains('${tabs.CREATEDB_TITLE}')`).length > 0) {   //evaluates as true
                        await cy.get('#terminus-console-page').find('a').contains(tabs.CREATEDB_TITLE).click()//.then(async() => {
                        cy.wait(1000);
                        await createLocalDB(database.name, user)
                    }else{
                        await createLocalDB(database.name, user);
                    }
                })
            })


            /***** Add schema ****/
            it('Add Schema', () => {
                cy.wait(5000);
                cy.url().then(urlString => {
                    //const dbUrl = `#/db/admin/${database.name}`
                    const dbUrl = `/db/admin/${database.name}`
                    if(!urlString.endsWith(dbUrl)){
                        cy.log("___URL___",urlString);

                        cy.visit(dbUrl)
                    }

                    cy.get('.nav__main__item').find('a').contains('Query').click().then( async() => {
                        cy.wait(1000)
                        await addSchema(database)
                    })

                    /*cy.get('#nav_query').click().then( async() => {
                        cy.wait(1000)
                        await addSchema(database)
                    }) */
                })
            })


            /***** View schema ****/
            it('View Schema tabs', () => {
                cy.wait(5000);
                cy.get('#terminus-console-page')
                .find('a')
                .contains('Schema')
                .click({force: true}).then(async() => {
        			cy.wait(1000)
                    await flickThroughSchemaTabs(database)
                })
            })


            /***** Query Schema Elements  ****/
           it('Query All Schema Elements', () => {
                cy.wait(5000);
                cy.get('#terminus-console-page')
                .find('a')
                .contains('Query')
                .click().then(async() => {
        			cy.wait(1000)
                    await getSchemaElements(database)
                })
            })

            /***** Go to Document Page  ****/
           it('Add Documents', () => {
                cy.wait(5000);
                cy.get('#terminus-console-page')
                .find('button')
                .contains('Add New Query Pane')
                .click().then(async() => {
        			cy.wait(1000)
                    await addDocuments(database)
                    cy.wait(2000)
                })
            })

            /***** View Documents  ****/
            it('View Documents Page', () => {
                cy.wait(2000);
                cy.get('#terminus-console-page')
                .find('a')
                .contains('Documents')
                .click({force: true}).then(() => {
        			cy.wait(2000)
                    //cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);
                })
            })

         	it('Query All Document', () => {
                cy.wait(5000);
                cy.get('#terminus-console-page')
                .find('a')
                .contains('Query')
                .click().then(async() => {
        			cy.wait(2000)
        			//getDocumentsMetaData()
                    await runQueries(database)
                })
            })


            /***** Go to Home Page  ****/
           it('Go to database home page', () => {
                cy.wait(5000);
                //const dbHomeRef = "/db/admin/" + database.name + "/"
                const dbHomeRef = `/db/admin/${database.name}/`
                cy.log('dbHomeRef', dbHomeRef)
                cy.get('#terminus-console-page')
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
                    await removeLocalDB(database.name)
                })
           })

        })
    })

})
