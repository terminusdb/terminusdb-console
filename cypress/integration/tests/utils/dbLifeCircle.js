import { flickThroughSchemaTabs } from "./definedActions"
import * as routes from "./routes"

/*
*   create a local database
*/
export const createLocalDB = async (dbId,withGraph=true) =>{

    cy.server().route("POST", routes.createDb(dbId)).as('createDB');
    cy.server().route("POST", routes.createGraph(dbId)).as('createGraph');

    cy.get("#create_db").click()
    cy.get("#create_db_local").click()

    cy.get("#dbid").focus().type(dbId);
    cy.get("#dbname").focus().type(dbId);
    cy.get("#description").focus().type(dbId);

    cy.get('form').find("button").contains('Create New Database').click()

    cy.wait("@createDB").its('status').should('eq', 200);

    if(withGraph)
        cy.wait("@createGraph").its('status').should('eq', 200);

    await cy.get('#loading').should('not.exist')
}

/*
*   Add schema
*/
export const addSchema = (database) => {

    cy.server().route("POST", routes.woqlQuery(database.name)).as('runQuery');

    cy.get('.CodeMirror').find('div').find('textarea').focus().type(database.addSchema)
    cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()

    cy.wait("@runQuery").its('status').should('eq', 200);
    cy.wait(5000);
}

/*
*   Add documents
*/
export const addDocuments = async (database) => {
    cy.server().route("POST", routes.woqlQuery(database.name)).as('runQuery');

    const csv = database.loadDocuments.csv;
    const inputs = 'WOQL.and(' + csv + ', ...' + database.loadDocuments.wrangles + ')'
    const q = 'WOQL.when(' + inputs + ', ' + database.loadDocuments.inserts + ')'
    await cy.get('.CodeMirror').find('div').find('textarea').focus().clear()
    await cy.get('.CodeMirror').find('div').find('textarea').focus().type(q)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()

    cy.wait("@runQuery").its('status').should('eq', 200);

    //cy.wait("@runQuery",{responseTimeout:120000}).its('status').should('eq', 200);

    //cy.wait(10000);

    cy.get('#terminus-console-page')
        .find('a')
        .contains('Documents')
        .click({force: true}).then(() => {
            cy.wait(1000)
    })
}

/*
*   Run queries
*/
export const runQueries = async(database) => {
    await cy.get('.CodeMirror').find('div').find('textarea').focus().clear()
    cy.wait(1000);
    await cy.get('.CodeMirror').find('div').find('textarea').focus().type(database.queries.selectDocuments)

    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(5000);

    await cy.get('.tdb__dropdown').find('button').find('span').click()
    await cy.get('.tdb__dropdown__content').find('button').contains('Graph').click()
	cy.wait(3000)
}

/*
*   create a new branch
*/
export const createBranch = async (bid, msg) => {
    await cy.get('#terminus-console-page').find('button').contains('Branch').click()
    cy.get('input[id="bid"]').focus().type(bid);
    cy.get('textarea[id="commit"]').focus().type(msg);
    await cy.get('.tcf-form').find('button').contains('Create New Branch').click()
    cy.wait(2000);
}

/*
*   delete database
*/
export const removeLocalDB = async (dbId) =>{
    await cy.get('#terminus-console-page').find('button').contains('DELETE').click()
    cy.get('#dbId').focus().type(dbId);
    await cy.get('.modal-body').find('button').contains('Confirm Database Delete').click()
    cy.wait(2000);
}