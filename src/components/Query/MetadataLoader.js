import { useEffect, useState } from "react"
import { WOQLClientObj } from "../../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "./WOQLQueryContainerHook"

/**
 * Library of functions which load useful metadata via woql queries and return it in simple json formats that are easier to process
 */

/**
 * 
 * @param {Array} dblist - array of json objects {id, title, description} describing  
 */
export const LoadDatabaseListDetails = (dblist) => {
    //gets the size and structural information about a list of databases for display on server home page
    //get branch structure for each db
    //get graph structure for each branch
    //get size for each graph....
    return [dblist, false]
}




export const loadGraphStructure = (branch, ref) => {
    const [report, setReport] = useState()
    const [graphStructure, setGraphStructure] = useState()
    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
        askTerminus(branch, ref)
    }, [branch, ref])

    function askTerminus(branch, ref){
        let woql = TerminusClient.WOQL.lib().getStructuralMetadata(branch, ref, woqlClient.resource("commits")) 
        woqlClient.query(woql).then((results) => {
            setGraphStructure(structureFromBindings(results.bindings))
        })
        .catch((e) => {
            setReport({status: TERMINUS_ERROR, message: FAILED_LOADING_GRAPH_STRUCTURE, error: e})
        })
    }

    function structureFromBindings(bindings){
        return bindings;
    } 

    return [graphStructure, report]
}

/*function loadBranchStructure(){

}

function getPropertiesQuery(branch, ref, graphFilter, limit, start){

    let qtype = TerminusClient.WOQL.lib().propertyMetadata(graphFilter)
    let query 
    if(limit) {
        start = start || 0
        query = 
    let woql = (limit ? TerminusClient.WOQL.limit(limit) ) 

    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(getClassQuery(props.graph));

    let gstr = gfilter.type + "/" + gfilter.gid
    return TerminusClient.WOQL.limit(200, TerminusClient.WOQL.lib().propertyMetadata(gstr))
}

function getPropertiesQuery(gfilter){
    let gstr = gfilter.type + "/" + gfilter.gid
    return TerminusClient.WOQL.limit(200, TerminusClient.WOQL.lib().propertyMetadata(gstr))
}
*/

