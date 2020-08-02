import { createLocalDB, removeLocalDB, addSchema, addDocuments, createBranch } from "../../fixtures/utils/dbLifeCircle"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { getDocumentsMetaData, clickOnBranch, addNewDocTypes, addSecondNewDocTypes, cloneLocalDatabase } from "../../fixtures/utils/definedActions"
import { config } from "../../fixtures/utils/config"


/*
*   1.	Creates a new db
*   2.	Load Bikes Schema
*   3.	Create a new Database as Clone of local Bikes Database
*   4.	Enter respective field entries
*   5.	Go to schema page and confirm if cloned database has the schema copied from original database
*   6.	Delete cloned as well as origin database
*/

context.skip('Test cloning a local database', () => {
   let bid, commit_msg, masterBranchId='main';
   let database = config[0]
   let clonedDatabase = config[0].name + '__Clone'

   before(() => {
       cy.visit('/')
   })

   /***** login ****/
   it('the user need to login', () => {
     cy.get("body").then($body => {
         if ($body.find("#tdbPassword").length > 0) {
               cy.get("#tdbPassword").focus().type('root').then(()=>{
                   cy.get("#tdbSubmit").click();
           })
         }
     })
   })

   /***** Creating database ****/
   it('Creating database', () => {
        cy.wait(5000);

        cy.get("body").then(async ($body)=>{
                if ($body.find('#loading').length > 0){
                    await cy.get('#loading').should('not.exist');
                }
            })

        cy.get("#terminus-console-page").then(async($consolePage) => {
            if ($consolePage.find(`a:contains('${tabs.CREATEDB_TITLE}')`).length > 0) {   //evaluates as true
                await cy.get('#terminus-console-page').find('a').contains(tabs.CREATEDB_TITLE).click()//.then(async() => {
                cy.wait(1000);
                await createLocalDB(database.name)
            }else{
                /*if we don't have db and the add db tab if not present*/
                await createLocalDB(database.name);
            }
        });
    })


	/***** Add schema ****/
	it('Add Schema', () => {
		cy.wait(5000);

		cy.get("body").then(async ($body)=>{
		    if ($body.find('#loading').length > 0){
		        await cy.get('#loading').should('not.exist');
		    }
		})

		cy.url().then(urlString => {
		  const dbUrl = `#/db/admin/${database.name}`
		  if(!urlString.endsWith(dbUrl)){
		      cy.visit(dbUrl)
		  }

          cy.get('.nav__main__item').find('a').contains('Query').click().then( async() => {
              cy.wait(1000)
              await addSchema(database)
          })

		  /*cy.get('#nav_query').click().then( async() => {
		      cy.wait(1000)
		      await addSchema(database)
		  })*/
		})
	})

    /***** View Schema classes ****/
	it('View Schema Classes', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Schema')
        .click({force: true}).then(() => {
			cy.wait(1000)
        })
    })

	/***** Go to terminusdb Home and create new db ****/
	it('Go to Server Home Page', () => {
		cy.wait(5000);
		cy.get("#terminus-console-page").then(async($consolePage) => {
            await cy.get('.nav__main__left').find('a').click()
            cy.wait(1000);
        });
	})

    /***** Cloning database ****/
    it('Cloning database', () => {
         cy.wait(5000);

         cy.get("body").then(async ($body)=>{
             if ($body.find('#loading').length > 0){
                 await cy.get('#loading').should('not.exist');
             }
         })

         cy.get("#terminus-console-page").then(async($consolePage) => {
             if ($consolePage.find(`a:contains('${tabs.CREATEDB_TITLE}')`).length > 0) {   //evaluates as true
                 await cy.get('#terminus-console-page').find('a').contains(tabs.CREATEDB_TITLE).click()//.then(async() => {
                 cy.wait(1000);
                 await cloneLocalDatabase(clonedDatabase, database.name)
             }else{
                 /*if we don't have db and the add db tab if not present*/
                 await cloneLocalDatabase(clonedDatabase, database.name);
             }
         });
     })

	/***** Check to see if schema from original db been cloned ****/
	it('View Schema Classes', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Schema')
        .click({force: true}).then(() => {
			cy.wait(1000)
        })
    })


	/***** go to cloned db home page and delete ****/
	it('Go to database home page', () => {
        cy.wait(5000);
        const dbHomeRef = "#/db/admin/" + clonedDatabase + "/"
        cy.get('#terminus-console-page')
        .find('a[href="'+ dbHomeRef +'"]')
        .click().then(() => {
            cy.wait(1000);
        })
    })


    it('Deleting cloned database', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains(tabs.MANAGE_TAB)
        .click().then(() => {
            cy.wait(1000);
            removeLocalDB(clonedDatabase)
        })
    })

    it('Selecting origin database', () => {
         cy.wait(5000);

         cy.get("body").then(async ($body)=>{
             if ($body.find('#loading').length > 0){
                 await cy.get('#loading').should('not.exist');
             }
         })

         cy.get("#terminus-console-page").then(async($consolePage) => {
             if ($consolePage.find(`a:contains('${tabs.DBLIST_TITLE}')`).length > 0) {   //evaluates as true
                 await cy.get('#terminus-console-page').find('a').contains(tabs.DBLIST_TITLE).click()//.then(async() => {
                 cy.wait(1000);
                 cy.get('#terminus-console-page').find('div').contains(database.name).click()
             }
         });
    })

     it('Deleting original database', () => {
         cy.wait(5000);
         cy.get('#terminus-console-page')
         .find('a')
         .contains(tabs.MANAGE_TAB)
         .click().then(() => {
             cy.wait(1000);
             removeLocalDB(database.name)
         })
     })

})
