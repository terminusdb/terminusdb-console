# terminus-dashboard

Management Dashboard for TerminusDB

The Terminus Dashboard is a simple reactjavascript client application that provides users with an interface for managing and querying TerminusDB. It ships with TerminusDB and is available at http://localhost:3005/

The dashboard requires terminus-client, terminus-react-table and terminus-react-graph to be available.

To install the manually dashboard, as of now this works as mentioned below:

* Clone terminus-client from https://github.com/terminusdb, then cd into the root dir and run: 
`npm install`
And all of the dependencies should be automatically installed

* Clone terminus-react-table from https://github.com/terminusdb/terminus-react-table
`npm install`
`npm run build`

* Clone terminus-react-graph from https://github.com/terminusdb/terminus-react-graph
`npm install`
`npm run build`

* Clone this repo, then cd into the root dir and run: 
    Locally install the above dependencies for terminus-client, terminus-react-table and terminus-react-graph
    `npm install --nosave ../terminus-client`
    `npm install --nosave ../terminus-react-table`
    `npm install --nosave ../terminus-react-graph`
    `npm install`
And all of the dependencies should be automatically installed
