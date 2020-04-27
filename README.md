# terminus-dashboard

Management Dashboard for TerminusDB

The Terminus Dashboard is a simple react javascript client application that provides users with an interface for managing and querying TerminusDB. It ships with TerminusDB and is available at http://localhost:3005/

The dashboard requires terminus-client, terminus-react-table and terminus-react-graph to be available.

As of to install terminusdb-console locally, follow the below steps:-

* Clone terminus-client from https://github.com/terminusdb/terminus-client, then cd into the root dir and run: 
`npm install`
And all of the dependencies should be automatically installed

* Clone terminus-react-table from https://github.com/terminusdb/terminus-react-table
1. `npm install`
1. `npm run build`

If any changes are made by you locally, in order to reflect this in terminusdb-console, make sure you run the build command

* Clone terminus-react-graph from https://github.com/terminusdb/terminus-react-graph
1. `npm install`
1. `npm run build`

If any changes are made by you locally, in order to reflect this in terminusdb-console, make sure you run the build command

* Clone this repo (terminusdb-console), then cd into the root dir and run: 
    Locally install the above dependencies for terminus-client, terminus-react-table and terminus-react-graph
 1. `npm install --nosave ../terminus-client`
1.    `npm install --nosave ../terminus-react-table`
1.    `npm install --nosave ../terminus-react-graph`
1.    `npm install`
 
And all of the dependencies should be automatically installed

* To run this on http://localhost:3005/
`npm run start`
