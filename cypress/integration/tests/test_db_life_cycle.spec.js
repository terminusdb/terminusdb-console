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
       cy.visit('/');
    })
      

    describe('Database life Circle', () => {

       config.forEach((database) => {
       //+ database.name, 
        /***** Creating database ****/
        it('Creating database', () => {
            cy.log("___DATABASE__",config)           
            cy.wait(2000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains(tabs.CREATEDB_TITLE)
            .click().then( async() => {
                cy.wait(1000);
                await createLocalDB(database.name)
            })
        })


        /***** Add schema ****/
        it('Add Schema', () => {
            cy.wait(3000);
            cy.url().then(urlString => {
                cy.log(urlString)
                if(urlString!==`http://localhost:3005/#/db/admin/${database.name}`){
                    cy.visit(`http://localhost:3005/#/db/admin/${database.name}`)
                }
            
                cy.get('#nav_query').click().then( async() => {
                    cy.wait(1000)
                    await addSchema(database)
                })
            })
        })
       /* it('Add Schema',  () => {
            //cy.url();
            cy.server().route('/#/db/admin/**').as('newDB');
            cy.server().route(`/#/db/admin/${database.name}/query`).as('queryPage');
            //cy.wait(1000);
            cy.url().then(urlString => {
                cy.log(urlString);
                cy.wait("@newDB");

                cy.log("AFTER WAIT FOR @newDB");
                cy.get('#nav_query').click().then( async() => {
                    cy.wait("@queryPage");
                    await addSchema(database)
                })

            })//do whatever)
                       
        })*/


        /***** View schema ****/
        /*it('View Schema tabs', () => {
            cy.wait(2000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Schema')
            .click({force: true}).then(async() => {
    			cy.wait(1000)
                await flickThroughSchemaTabs(database)
            })
        })


        /***** Query Schema Elements  ****/
        /*it('Query All Schema Elements', () => {
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
        /*it('Add Documents', () => {
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
        /*it('View Documents', () => {
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
        })*/


        /***** Go to Home Page  ****/
        it('Go to database home page', () => {
            cy.wait(2000);
            const dbHomeRef = "#/db/admin/" + database.name + "/"
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
                removeLocalDB(database.name)
            })
       })

    })
})

})
