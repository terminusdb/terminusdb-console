import * as tabs from "../../../src/views/Pages/constants.pages"
import { EDIT_OWL_BUTTON } from "../../../src/views/Schema/constants.schema"
import { SHOW_CLASSES_PROPERTIES, DOCUMENT_META_DATA, ADD_DOCTYPE_TEST, ADD_DOCTYPE_SECOND_TEST, IMPORT_AND_EXPORT_CSV } from "./queries"
import * as routes from "./routes"

/*
* check the loading object
*/



export const flickThroughSchemaTabs = async (database) => {
	/*
	* check table exists in the schema tab
	*/
	cy.server().route("GET", routes.triplesGraph(database.name)).as('tripleQuery');
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);

	/*
	* check table exists in the properties tab
	*/
	await cy.get('#terminus-console-page').find('a').contains(tabs.PROPERTIES_TAB).click()
	cy.wait(2000);
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);

	/*
	* check that I call get schema
	*/
	await cy.get('#terminus-console-page').find('a').contains(tabs.OWL_TAB).click()
	cy.wait("@tripleQuery").its('status').should('eq', 200);


	await cy.get('#terminus-console-page').find('a').contains(tabs.GRAPHS_TAB).click()
	cy.wait(2000);
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);

	await cy.get('#terminus-console-page').find('a').contains(tabs.PREFIXES_TAB).click()
	cy.wait(2000);
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);

}

export const getSchemaElements = async (database) => {
	cy.server().route("POST", routes.woqlQuery(database.name)).as('runQuery');

	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(SHOW_CLASSES_PROPERTIES)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()

    cy.wait("@runQuery").its('status').should('eq', 200);

	cy.wait(2000)
	/*
	* check that I have a query result
	*/
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);
}

export const getDocumentsMetaData = async () => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(DOCUMENT_META_DATA)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
	await cy.get('.tdb__dropdown').find('button').find('span').click()
    await cy.get('.tdb__dropdown__content').find('button').contains('Graph').click()
	cy.wait(1000)
}

export const clickOnBranch = async(bid) => {
	cy.wait(1000)
	await cy.get('.tdb__dropdown__content').find('button').contains(bid).click()
	cy.wait(1000)
}

export const addNewDocTypes = async() => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(ADD_DOCTYPE_TEST)
    cy.get('.tdb__commit__bar__input').find('input[id="commitMessage"]').focus().type('Adding new doctype scooter to test branching ...')
	await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
}

export const addSecondNewDocTypes = async () => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(ADD_DOCTYPE_SECOND_TEST)
	cy.get('.tdb__commit__bar__input').find('input[id="commitMessage"]').focus().type('Adding a second doctype skates to test branching ...')
	await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
}

//(clonedDatabase, database.name)
export const cloneLocalDatabase = async(newDbId, cloneFromDb) => {
	cy.server().route("POST", routes.clone(newDbId)).as('cloneDB');

    cy.get("#copy_db").click()
    cy.get("#copy_db_local").click()

	const inpCloneId = cloneFromDb + '{enter}';
	cy.get(".tcf-select").click().find("input").first().focus().type(inpCloneId);

    cy.get("#newid").focus().type(newDbId);

    cy.get('form').find("button").contains('Create Copy').click()

    cy.wait("@cloneDB").its('status').should('eq', 200);

    await cy.get('#loading').should('not.exist')
}


export const importAndExportCSV = async(dbId) => {
	cy.server().route("POST", routes.woqlQuery(dbId)).as('runQuery');

	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(IMPORT_AND_EXPORT_CSV)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()

    //cy.wait("@runQuery").its('status').should('eq', 200);

	cy.wait(2000)
	/*
	* check that I have a query result
	*/
	cy.get('#terminus-console-page').find('tr').its('length').should('greaterThan', 1);
}
