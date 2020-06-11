/*
*from home page
*/
export const createLocalDB = async (dbId) =>{
     await cy.get("#create_db").click()
     await cy.get("#create_db_local").click()

     cy.get("#dbid").focus().type(dbId);
     cy.get("#dbname").focus().type(dbId);
     cy.get("#description").focus().type(dbId);

     await cy.get('form').find("button").contains('Create New Database').click()

     cy.wait(2000);
     /*
     query the termunus db ...
     */
    // expect(cy.get('#terminus-console-page').find('legend').contains(dbId)).to.be.exist
}

/*
* //class="del-mod"
* <button type="button" class="ros-delete-button btn btn-outline-danger">DELETE</button>
*from db home page
*/
export const removeLocalDB = async (dbId) =>{
     
    await cy.get('#terminus-console-page').find('button').contains('DELETE').click()

    cy.get('#dbId').focus().type(dbId);

    await cy.get('.modal-body').find('button').contains('Confirm Database Delete').click()

    cy.wait(2000);
     
}