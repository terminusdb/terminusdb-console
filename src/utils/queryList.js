import TerminusClient from '@terminusdb/terminus-client';
import {LIST_OF_DATABASE_QUERY, SCHEMA_LIST_OF_CLASSES_QUERY,
        SCHEMA_LIST_OF_PROPERTIES_QUERY} from "../labels/queryLabels";

export const getQuery = (queryName) =>{
    const WOQL = TerminusClient.WOQL;
    switch(queryName){
        case LIST_OF_DATABASE_QUERY:
            return WOQL.and(
                      WOQL.triple('v:Id', 'type', 'terminus:Database'),
                      WOQL.triple('v:Id', 'label', 'v:Name'),
                      WOQL.triple('v:Id', 'comment', 'v:Description'))

        case SCHEMA_LIST_OF_CLASSES_QUERY:
            return WOQL.limit(100).and(
                      WOQL.quad('v:Class ID', 'type', 'Class', 'schema'),
                      WOQL.opt().quad('v:Class ID', 'label', 'v:Name', 'schema'),
                      WOQL.opt().quad('v:Class ID', 'comment', 'v:Description', 'schema'),
                      WOQL.opt().quad('v:Class ID', 'subClassOf', 'v:Parent Classes', 'schema'),
                      WOQL.opt().quad('v:Sub classes', 'subClassOf', 'v:Class ID', 'schema'),
                      WOQL.opt().quad('v:Class ID', 'tcs:tag', 'v:Abstract', 'schema'))

        case SCHEMA_LIST_OF_PROPERTIES_QUERY:
            return WOQL.limit(100).start(0).propertyMetadata();

        default:
            console.log('queryList.js - Invalid Query name ' + queryName)
        break;
    }

}
