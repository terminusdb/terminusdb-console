import * as tabs from "../../../../src/views/Pages/constants.pages"
import { SHOW_CLASSES_PROPERTIES, DOCUMENT_META_DATA, ADD_DOCTYPE_TEST, ADD_DOCTYPE_SECOND_TEST } from "./queries"

export const flickThroughSchemaTabs = async () => {
	await cy.get('#terminus-console-page').find('a').contains(tabs.PROPERTIES_TAB).click()
	cy.wait(2000);
	await cy.get('#loading').should('not.exist')
	await cy.get('#terminus-console-page').find('a').contains(tabs.OWL_TAB).click()
	cy.wait(2000);
	await cy.get('#loading').should('not.exist')
	await cy.get('#terminus-console-page').find('a').contains(tabs.GRAPHS_TAB).click()
	cy.wait(2000);
	await cy.get('#loading').should('not.exist')
	await cy.get('#terminus-console-page').find('a').contains(tabs.PREFIXES_TAB).click()
	cy.wait(2000);
	await cy.get('#loading').should('not.exist')
}

export const getSchemaElements = async () => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(SHOW_CLASSES_PROPERTIES)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
	await cy.get('.tdb__dropdown').find('button').find('span').contains('Table').click({force:true})
    await cy.get('.tdb__dropdown__content').find('button').contains('Graph').click({force:true})
	cy.wait(1000)
}

export const getDocumentsMetaData = async () => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(DOCUMENT_META_DATA)
    await cy.get('.tdb__qpane__editor').find('button').contains('Run Query').click()
    cy.wait(2000);
	await cy.get('.tdb__dropdown').find('button').find('span').contains('Table').click({force:true})
    await cy.get('.tdb__dropdown__content').find('button').contains('Graph').click({force:true})
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
