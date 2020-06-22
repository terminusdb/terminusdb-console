import { createLocalDB, removeLocalDB, addSchema, addDocuments, createBranch } from "./utils/dbLifeCircle"
import * as tabs from "../../../src/views/Pages/constants.pages"
import { getDocumentsMetaData, clickOnBranch, addNewDocTypes, addSecondNewDocTypes } from "./utils/definedActions"
import { config } from "./utils/config"

/*
*	1.	Create a new db
*	2.	Load Bikes Schema
*	3.	Create a new branch
* 	4.	Select new branch
* 	5.	Add a new doctype to branch
* 	6.	Add another doctype to branch
* 	7.	Compare schema class view between master and new branch
* 	6. 	Delete database
*/

context('Test commits and branching', () => {
   let bid, commit_msg, masterBranchId='master';
   let database = config[0]
   let dbid = config[0].name + Date.now();

   before(() => {
       cy.visit('http://localhost:3005');
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
            addSchema(database)
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

	it('Create Branch', () => {
        cy.wait(2000);
		bid = 'New_Branch'
		commit_msg = 'Creating new test branch'
        cy.get('#terminus-console-page')
        .find('a')
        .contains(tabs.MANAGE_TAB)
        .click().then(() => {
            cy.wait(1000);
            createBranch(bid, commit_msg)
        })
    })

	it('View Schema Classes', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Schema')
        .click({force: true}).then(() => {
			cy.wait(1000)
        })
    })


	it('View Branch List', () => {
        cy.wait(2000);
        cy.get('.tdb__dropdown')
        .click().then(() => {
            cy.wait(1000);
			clickOnBranch(bid)
        })
    })

	it('Query to perform a commit in new branch', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Query')
        .click().then(() => {
			cy.wait(1000)
			addNewDocTypes()
        })
    })

	it('Query to perform a second commit in new branch', () => {
        cy.wait(5000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Query')
        .click().then(() => {
			cy.wait(1000)
			addSecondNewDocTypes()
        })
    })

	it('View Schema Classes', () => {
        cy.wait(2000);
        cy.get('#terminus-console-page')
        .find('a')
        .contains('Schema')
        .click({force: true}).then(() => {
			cy.wait(1000)
        })
    })


	it('View Master Branch', () => {
        cy.wait(2000);
        cy.get('.tdb__dropdown')
        .click().then(() => {
            cy.wait(1000);
			clickOnBranch(masterBranchId)
        })
    })

	it('View New Branch', () => {
        cy.wait(2000);
        cy.get('.tdb__dropdown')
        .click().then(() => {
            cy.wait(1000);
			clickOnBranch(bid)
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
