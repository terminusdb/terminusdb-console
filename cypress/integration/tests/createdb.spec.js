import {createLocalDB,removeLocalDB} from "./utils/dbLifeCircle"

context('check connection', () => {
   let dbid;

   before(() => {
       cy.visit('http://localhost:3005');
       dbid=`mydb_${Date.now()}`
   })

   it('Connect to a Server', () => {
   	   cy.wait(2000);
	     cy.get('#terminus-console-page')
         .find('a')
         .contains('New Database')
         .click().then(() => {
	            cy.wait(1000);
              createLocalDB(dbid)
	   })
  })


  it('Connect to a Server', () => {
       cy.wait(2000);
       cy.get('#terminus-console-page')
         .find('a')
         .contains('Manage')
         .click().then(() => {
              cy.wait(1000);
              removeLocalDB(dbid)
     })
   }) // connect to a server
})
