import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { LIST_OF_DATABASE_QUERY, GET_DATABASE_NAME_QUERY } from "../labels/queryLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"
import { GET_SCHEMA, CREATE_DATABASE, UPDATE_SCHEMA }  from '../labels/apiLabels'
import { getCurrentSchema } from "../utils/helperFunctions"
import { WOQLClientObj } from "../init/woql-client-instance";

function APICallsHook(apiName, renderType, params) {
    const [data, setData, state] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};
    const {woqlClient} = WOQLClientObj();  


    useEffect(() => {
        async function woqlClientCall() {
           if (isObject(woqlClient)){
               if(woqlClient.server()){
                   switch(apiName){
                       case GET_SCHEMA:
                            //dbClient.getSchema({'terminus:encoding': 'terminus:turtle'},
                            // getCurrentSchema(dbClient))
                            woqlClient.getSchema()
                            .then(function(response){
                                setData({response: response});
                                setLoading(false);
                        	})
                        	.catch(function(error){
                        		console.log(error)
                        	});
                            return [data, loading];
                      case UPDATE_SCHEMA:
                        if(isObject(params)){
                            woqlClient.updateSchema(params,
                               {'terminus:encoding': 'terminus:turtle'})
                            .then(function(response){
                                setData({response: response});
                                setLoading(false);
                            })
                            .catch(function(error){
                                console.log(error)
                            });
                            return [data, loading];
                        }
                       case CREATE_DATABASE:
                           if(isObject(params)){
                               let doc = {}
                               doc.label = params.label || params.title
                               doc.comment = params.comment || params.description
                               if(!params.id || !doc.label){
                                   return Promise.reject(new Error(this.getBadArguments("createDatabase", "ID and label are mandatory fields")))
                               }
                               var dbid = params.id;
                               doc.base_uri = params.base_uri || "http://local.terminusdb.com/" + dbid + "/data"
                               woqlClient.createDatabase(dbid, doc, params.account)
                               .then((response) => {
                                    createStarterGraphs(woqlClient, "main", "main", "main")
                                    .then((response) => {
                                       setData({response: response});
                                       setLoading(false);
                                    })
                               })
                               .catch(function(error){
                                   console.log(error)
                               });
                               return [data, loading];
                           }
                       default: break;
                   }
                   return;
               }
           }
        }
        woqlClientCall();
    }, [woqlClient, params]);

    return [data, loading];
}

function createStarterGraphs(client, instance_id, schema_id, inference_id){
    let parts = []
    if(instance_id){
        parts.push(["instance", instance_id, "Instance Graph Created Automatically with Database Create"])
    }
    if(schema_id){
        parts.push(["schema", schema_id, "Schema Graph Created Automatically with Database Create"])
    }
    if(inference_id){
        parts.push(["inference", inference_id, "Schema Graph Created Automatically with Database Create"])
    }
    if(parts.length > 0)
    return client.createGraph(parts[0][0], parts[0][1], parts[0][2])
	.then(() => {
		if(parts.length > 1){
            return client.createGraph(parts[1][0], parts[1][1], parts[1][2])
            .then(() => {
                if(parts.length > 2){
                    return client.createGraph(parts[2][0], parts[2][1], parts[2][2])
                }
            })
		}
		return true;
	})
}

export { APICallsHook };
