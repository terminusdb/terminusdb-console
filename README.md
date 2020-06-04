# terminusdb-console

Management Dashboard for TerminusDB

The Terminus Dashboard is a simple react javascript client application that provides users with an interface for managing and querying TerminusDB. It ships with TerminusDB and is available at http://localhost:3005/


The dashboard requires terminusdb-client, terminusdb-react-table and terminusdb-react-graph to be available.

As of to install terminusdb-console locally for development, follow the below steps:-

* Clone terminus-client from https://github.com/terminusdb/terminusdb-client, 
then cd into the root dir and run: 
`npm install`

And all of the dependencies should be automatically installed

* Clone terminus-react-table from https://github.com/terminusdb/terminusdb-react-table
1. `npm install`


* Clone terminus-react-graph from https://github.com/terminusdb/terminusdb-react-graph
1. `npm install`


* Clone this repo (terminusdb-console), then cd into the root dir and run: 
    npm install
 
And all of the dependencies should be automatically installed
Note with npm install you install in node_module the last official dependency 

* To run this on http://localhost:3005/
`npm run start`

* Note with "npm install" you'll install in node module the last official dependency published in npm
for terminusdb-client, terminusdb-react-table, terminusdb-react-graph

But in development mode you'll use your local version
