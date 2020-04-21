import TerminusClient from '@terminusdb/terminus-client';
import * as query from "../labels/queryLabels";

export const getQuery = (queryName, params) =>{
    const WOQL = TerminusClient.WOQL;
    const dbId = params.dbId || '';
    const curl = "admin/" + dbId + "/local/_commits"
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
            return WOQL.limit(100).start(0).propertyMetadata();

       case query.GET_USER_ACCESS_FOR_DB:
            return WOQL.and(
            	WOQL.triple("v:CapabilityID", "terminus:authority_scope", dbId),
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
            return WOQL.query().elementMetadata();

       case query.SHOW_ALL_CLASSES:
            return WOQL.query().classMetadata();

       case query.SHOW_DOCUMENT_CLASSES:
            return WOQL.query().concreteDocumentClasses();

       case query.SHOW_ALL_PROPERTIES:
            return WOQL.query().propertyMetadata();

       case query.GET_COMMITS:
            // change account later and repo
            const bid = params.bid || false; //bid is branch id or commit id
            const isBranch = params.isBranch || false; // is branch determines if branch or commit id
            if(!isBranch)
               return WOQL.using(curl).and(WOQL.lib().getCommitDetails(bid))
            else return WOQL.using(curl).and(
                   WOQL.triple("v:Branch", "ref:branch_name", bid),
                   WOQL.triple("v:Branch", "ref:ref_commit", "v:Head"),
                   WOQL.path("v:Head", "ref:commit_parent+", "v:B", "v:Path"),
                   WOQL.not().triple("v:B",  "ref:commit_parent", "v:C"),
                   WOQL.triple("v:B",  "ref:commit_id", "v:CommitID"),
                   WOQL.lib().getCommitDetails("v:CommitID")
                )

       case query.GET_BRANCH_LIST:
           return WOQL.using(curl, WOQL.lib().getBranchNames())
       default:
           return {};
       break;
    }

}
