import { episode_2_database } from "../../fixtures/utils/config"
import { importAndExportCSV, clickOnBranch } from "../../fixtures/utils/definedActions"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { createLocalDB, removeLocalDB, addSchema, addTriples, runAQuery,
    createBranch, rebase } from "../../fixtures/utils/dbLifeCircle"


context('Run test for Eposide 2 part 1', () => {

    before(() => {
       cy.visit('/');
    })

    describe('Test episode 2 part 1', () => {

		const password = Cypress.env('password');
		const database = episode_2_database;
        const dbId = database.name
        const user = false
        const bid = 'branch_office', main = 'main'


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

	    /***** Add schema ****/
 	    it('Add Schema', () => {
 		   cy.wait(5000);
		   cy.get('.nav__main__item').find('a').contains('Query').click().then( async() => {
			   cy.wait(1000)
			   await addSchema(database)
		   })
 	    })

		/***** Add data ****/
		it('Add Documents', () => {
			cy.wait(5000);
			cy.get('#terminus-console-page')
			.find('button')
			.contains('Add New Query Pane')
			.click().then(async() => {
				cy.wait(1000)
			 await addTriples(database)
			 cy.wait(2000)
			})
        })

		/***** Queries ****/
		it('Write some edit queries - wrong', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Query')
            .click().then(async() => {
    			cy.wait(2000)
                await runAQuery(dbId, database.edit_query_wrong)
            })
        })

		/***** Queries ****/
		it('Write some edit queries - Adding Mike', () => {
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains('Query')
            .click().then(async() => {
    			cy.wait(2000)
                await runAQuery(dbId, database.query_create_mike)
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

        /***** Go to Manage Page & create Branch ****/
        it('Create branch', () => {
		    const commit_msg = 'Branch for our new branch office'
            cy.wait(5000);
            cy.get('#terminus-console-page')
            .find('a')
            .contains(tabs.MANAGE_TAB)
            .click().then(async () => {
                cy.wait(1000);
                await createBranch(bid, commit_msg)
            })
       })

       /***** View Documents  ****/
       it('View Documents Page of bank branch', () => {
           cy.wait(2000);
           cy.get('#terminus-console-page')
           .find('a')
           .contains('Documents')
           .click({force: true}).then(() => {
               cy.wait(2000)
           })
       })

        /***** Click on new bank branch ****/
       it('View Branch List',() => {
           cy.wait(2000);
           cy.get('.tdb__dropdown')
           .click().then( async() => {
               cy.wait(1000);
   			    await clickOnBranch(bid)
           })
       })

       /***** Query to add Jim ****/
       it('Adding Jim', () => {
           cy.wait(5000);
           cy.get('#terminus-console-page')
           .find('a')
           .contains('Query')
           .click().then(async() => {
               cy.wait(2000)
               await runAQuery(dbId, database.query_create_jim)
           })
       })

       /***** View Documents  ****/
       it('View Documents Page of bank branch', () => {
           cy.wait(2000);
           cy.get('#terminus-console-page')
           .find('a')
           .contains('Documents')
           .click({force: true}).then(() => {
               cy.wait(2000)
           })
       })

       /***** Click on main branch ****/
      it('View main branch',() => {
          cy.wait(2000);
          cy.get('.tdb__dropdown')
          .click().then( async() => {
              cy.wait(1000);
               await clickOnBranch(main)
          })
      })

      /***** Query to add Jane ****/
      it('Adding Jane', () => {
          cy.wait(5000);
          cy.get('#terminus-console-page')
          .find('a')
          .contains('Query')
          .click().then(async() => {
              cy.wait(2000)
              await runAQuery(dbId, database.query_create_jane)
          })
      })

      /***** View Documents ****/
      it('View Documents Page of main', () => {
          cy.wait(2000);
          cy.get('#terminus-console-page')
          .find('a')
          .contains('Documents')
          .click({force: true}).then(() => {
              cy.wait(2000)
          })
      })

      /***** Click on bank branch ****/
     it('View main branch',() => {
         cy.wait(2000);
         cy.get('.tdb__dropdown')
         .click().then( async() => {
             cy.wait(1000);
              await clickOnBranch(bid)
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

      /***** Go to Manage Page & Rebase ****/
      it('Rebase', () => {
          const commit_msg = 'Merging branch office info'
          cy.wait(5000);
          cy.get('#terminus-console-page')
          .find('a')
          .contains(tabs.MANAGE_TAB)
          .click().then(async () => {
              cy.wait(1000);
              await rebase(main, commit_msg)
          })
     })

     /***** Click on main branch ****/
    it('View main branch',() => {
        cy.wait(2000);
        cy.get('.tdb__dropdown')
        .click().then( async() => {
            cy.wait(1000);
             await clickOnBranch(main)
        })
    })

     /***** View Documents  after merginf****/
     it('View Documents Page after merging', () => {
         cy.wait(2000);
         cy.get('#terminus-console-page')
         .find('a')
         .contains('Documents')
         .click({force: true}).then(() => {
             cy.wait(2000)
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
