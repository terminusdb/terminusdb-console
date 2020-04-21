import TerminusClient from '@terminusdb/terminus-client';
import * as query from "../labels/queryLabels";

export const getQuery = (queryName, dbClient) =>{
    const WOQL = TerminusClient.WOQL;
    const commit_graph = (dbClient ? `${dbClient.account()}/${dbClient.db()}/${dbClient.repo()}/_commits` : false)

    switch(queryName){
        case query.LIST_OF_DATABASE_QUERY:
            return WOQL.and(
                  WOQL.triple('v:Id', 'type', 'terminus:Database'),
                  WOQL.triple('v:Id', 'label', 'v:Name'),
                  WOQL.triple('v:Id', 'comment', 'v:Description'))

        case query.SCHEMA_LIST_OF_CLASSES_QUERY:
            return WOQL.limit(100).and(
                  WOQL.quad('v:Class ID', 'type', 'Class', 'schema'),
                  WOQL.opt().quad('v:Class ID', 'label', 'v:Name', 'schema'),
                  WOQL.opt().quad('v:Class ID', 'comment', 'v:Description', 'schema'),
                  WOQL.opt().quad('v:Class ID', 'subClassOf', 'v:Parent Classes', 'schema'),
                  WOQL.opt().quad('v:Sub classes', 'subClassOf', 'v:Class ID', 'schema'),
                  WOQL.opt().quad('v:Class ID', 'tcs:tag', 'v:Abstract', 'schema'))

        case query.SCHEMA_LIST_OF_PROPERTIES_QUERY:
            return WOQL.limit(100).start(0, WOQL.lib().propertyMetadata())

       case query.GET_USER_ACCESS_FOR_DB:
            return WOQL.and(
            	WOQL.triple("v:CapabilityID", "terminus:authority_scope", dbClient.db()),
            	WOQL.triple("v:UserID", "terminus:authority", "v:CapabilityID"),
                WOQL.not().eq("v:UserID", "doc:admin"),
                WOQL.triple("v:UserID", "label", "v:Label"),
            	WOQL.triple("v:CapabilityID", "terminus:action", "v:Action"))

       case query.GET_USERS_NOT_IN_DB:
            return WOQL.and(
			    WOQL.triple("v:CapabilityID", "terminus:authority_scope", 'v:AllDatabase'),
  				WOQL.not().eq('v:AllDatabase', dbId),
            	WOQL.triple("v:UserID", "terminus:authority", "v:CapabilityID"),
                WOQL.not().eq("v:UserID", "doc:admin"),
                WOQL.triple("v:UserID", "label", "v:Label"))

       case query.SHOW_ALL_SCHEMA_ELEMENTS:
            return WOQL.lib().elementMetadata();

       case query.SHOW_ALL_CLASSES:
            return WOQL.lib().classMetadata();

       case query.SHOW_DOCUMENT_CLASSES:
            return WOQL.lib().concreteDocumentClasses();

       case query.SHOW_ALL_PROPERTIES:
            return WOQL.lib().propertyMetadata();

       case query.GET_COMMITS:
            // change account later and repo
            //const bid = params.bid || false; //bid is branch id or commit id
            //const isBranch = params.isBranch || false; // is branch determines if branch or commit id
            if(dbClient.ref())
               return WOQL.using(commit_graph).and(WOQL.lib().getCommitDetails(dbClient.ref()))
            else return WOQL.using(commit_graph).and(
                   WOQL.triple("v:Branch", "ref:branch_name", dbClient.checkout()),
                   WOQL.triple("v:Branch", "ref:ref_commit", "v:Head"),
                   WOQL.path("v:Head", "ref:commit_parent+", "v:B", "v:Path"),
                   WOQL.not().triple("v:B",  "ref:commit_parent", "v:C"),
                   WOQL.triple("v:B",  "ref:commit_id", "v:CommitID"),
                   WOQL.lib().getCommitDetails("v:CommitID")
                )

       case query.GET_BRANCH_LIST:
           return WOQL.using(commit_graph, WOQL.lib().getBranchNames())
       default:
           return {};
       break;
    }

}
