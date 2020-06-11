import * as tabs from "../../../../src/views/Pages/constants.pages"
import { CREATE_SCHEMA, SHOW_ALL_SCHEMA_ELEMENTS } from "./queryList"

export const flickThroughSchemaTabs = async () => {
	await cy.get('#terminus-console-page').find('a').contains(tabs.PROPERTIES_TAB).click()
	cy.wait(2000);
	await cy.get('#terminus-console-page').find('a').contains(tabs.OWL_TAB).click()
	cy.wait(2000);
	await cy.get('#terminus-console-page').find('a').contains(tabs.GRAPHS_TAB).click()
	cy.wait(2000);
	await cy.get('#terminus-console-page').find('a').contains(tabs.PREFIXES_TAB).click()
	cy.wait(2000);
}

export const getQueryDisplaySchemaElements = async () => {
	await cy.get('.CodeMirror').find('div').find('textarea').focus().type(SHOW_ALL_SCHEMA_ELEMENTS)
    await cy.get('.query-pane-container').find('button').contains('Run Query').click()
    cy.wait(2000);
	await cy.get('.dropdown').find('button').contains('Graph').click({force:true})
	cy.wait(1000)
}
