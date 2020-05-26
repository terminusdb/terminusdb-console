import React from "react"
import { Button, ButtonGroup } from 'reactstrap'
import TerminusClient from '@terminusdb/terminusdb-client';
//import * as query from "../labels/queryLabels";


export const QueryLibrary = (props) => {
    const libs = props.libs || [];
    const setWoql = props.setWoql;
    const libButtons = [];

    libs.map((items) => {
        libButtons.push(
          <Button key = { items } onClick = { () => {
              const q = getQuery(items);
              setWoql(q)
          }}>{ items } </Button>
        )
    })

    return(
        <div className="lib-pane">
            <ButtonGroup> { libButtons } </ButtonGroup>
        </div>
    )
}
/*
export const getQuery = (queryName, dbClient) =>{
    const WOQL = TerminusClient.WOQL;
    const commit_graph = (dbClient ? `${dbClient.account()}/${dbClient.db()}/${dbClient.repo()}/_commits` : false)

    switch(queryName){
       case query.SHOW_ALL_SCHEMA_ELEMENTS:
            return WOQL.lib().elementMetadata();

       case query.SHOW_ALL_CLASSES:
            return WOQL.lib().classList();

       case query.SHOW_DOCUMENT_CLASSES:
            return WOQL.lib().concreteDocumentClasses();

       case query.SHOW_ALL_PROPERTIES:
            return WOQL.lib().propertyMetadata();

       case query.GET_COMMITS:
            // change account later and repo
            //const bid = params.bid || false; //bid is branch id or commit id
            //const isBranch = params.isBranch || false; // is branch determines if branch or commit id
            return WOQL.using(commit_graph).and(
                   WOQL.triple("v:Branch", "ref:branch_name", dbClient.checkout()),
                   WOQL.triple("v:Branch", "ref:ref_commit", "v:Head"),
                   WOQL.path("v:Head", "ref:commit_parent+", "v:Tail", "v:Path"),
                   WOQL.not().triple("v:Tail",  "ref:commit_parent", "v:Any"),
                   WOQL.triple("v:Tail",  "ref:commit_id", "v:TailID"),
                   WOQL.triple("v:Tail",  "ref:commit_timestamp", "v:TailID"),

                )
       default:
           return {};
       break;
    }

}
*/