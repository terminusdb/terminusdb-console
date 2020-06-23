import { createLocalDB, addSchema, removeLocalDB, addDocuments,runQueries } from "./utils/dbLifeCircle"
import { flickThroughSchemaTabs, getSchemaElements, getDocumentsMetaData } from "./utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { config } from "./utils/config"

/*
+   1.	Create a new db
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
            .click().then( async() => {
                cy.wait(1000);
                await createLocalDB(dbid)
            })
        })

        /***** Add schema ****/
        it('Add Schema', async () => {
            cy.server()
            cy.route('/#/db/admin/**').as('newDB');
            await cy.wait("@newDB");
            await cy.get('#nav_query').click();
            cy.wait(1000)
            await addSchema(dbid);
            //console.log("AFTER AWAIT")           
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

        /***** Go to Document Page  ****/
        it('Add Documents', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('button')
            .contains('Add New Query Pane')
            .click().then(() => {
    			cy.wait(1000)
                addDocuments(database)
            })
        })

        /***** View Documents  ****/
        it('View Documents', () => {
            cy.wait(2000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Documents')
            .click({force: true}).then(() => {
    			cy.wait(1000)
            })
        })

    	it('Query All Document', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Query')
            .click().then(() => {
    			cy.wait(1000)
    			//getDocumentsMetaData()
                runQueries(database)
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
