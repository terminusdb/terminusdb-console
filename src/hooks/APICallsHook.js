import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { LIST_OF_DATABASE_QUERY, GET_DATABASE_NAME_QUERY } from "../labels/queryLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"
import { GET_SCHEMA, CREATE_DATABASE, UPDATE_SCHEMA }  from '../labels/apiLabels'
import { getCurrentSchema } from "../utils/helperFunctions"

function APICallsHook(apiName, renderType, params) {
    const [data, setData, state] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    useEffect(() => {
        async function woqlClientCall() {
           if (isObject(dbClient)){
               if(dbClient.server()){
                   switch(apiName){
                       case GET_SCHEMA:
                            dbClient.getSchema({'terminus:encoding': 'terminus:turtle'},
                             getCurrentSchema(dbClient))
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
                            dbClient.updateSchema(params,
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
                               dbClient.createDatabase(params)
                               .then(function(response){
                                   setData({response: response});
                                   setLoading(false);
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
    }, [dbClient, params]);

    return [data, loading];
}

export { APICallsHook };
