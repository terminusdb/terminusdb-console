export const createLocalDB = async (dbId,withGraph=true) =>{
     cy.server().route("POST", `**/db/admin/${dbId}`).as('createDB');
     cy.server().route("POST", `**/graph/admin/${dbId}/local/branch/master/schema/main`).as('createGraph');

    
     await cy.get("#create_db").click()
     await cy.get("#create_db_local").click()

     cy.get("#dbid").focus().type(dbId);
     cy.get("#dbname").focus().type(dbId);
     cy.get("#description").focus().type(dbId);

     await cy.get('form').find("button").contains('Create New Database').click()

     //await cy.get('#loading').should('exist')
       
     await cy.wait("@createDB").its('status').should('eq', 200);
     
     if(withGraph)
        await cy.wait("@createGraph").its('status').should('eq', 200);
     
     await cy.get('#loading').should('not.exist');
}

export const removeLocalDB = async (dbId) =>{
    await cy.get('#terminus-console-page').find('button').contains('DELETE').click()
    cy.get('#dbId').focus().type(dbId);
    await cy.get('.modal-body').find('button').contains('Confirm Database Delete').click()
    cy.wait(2000);
}

export const addSchema = async (database) => {
    await cy.get('.CodeMirror').find('div').find('textarea').focus().type(database.addSchema)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
}

export const addDocuments = async (database) => {
    const csv = database.loadDocuments.csv;
    const inputs = 'WOQL.and(' + csv + ', ...' + database.loadDocuments.wrangles + ')'
    const q = 'WOQL.when(' + inputs + ', ' + database.loadDocuments.inserts + ')'
    await cy.get('.CodeMirror').find('div').find('textarea').focus().clear()
    await cy.get('.CodeMirror').find('div').find('textarea').focus().type(q)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(10000);
    cy.wait(2000);
    cy.get('#terminus-console-page')
    .find('a')
    .contains('Documents')
    .click({force: true}).then(() => {
        cy.wait(1000)
    })
}

export const runQueries = async(database) => {
    await cy.get('.CodeMirror').find('div').find('textarea').focus().clear()
    cy.wait(1000);
    await cy.get('.CodeMirror').find('div').find('textarea').focus().type(database.queries.selectDocuments)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(1000);
    await cy.get('#result_dropdown').find('button').contains('Graph').click({force:true})
	cy.wait(3000)
}

export const createBranch = async (bid, msg) => {
    await cy.get('#terminus-console-page').find('button').contains('Branch').click()
    cy.get('input[id="bid"]').focus().type(bid);
    cy.get('textarea[id="commit"]').focus().type(msg);
    await cy.get('.tcf-form').find('button').contains('Create New Branch').click()
    cy.wait(2000);
}
