import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from './dataFormatter';
import * as queryList from './queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { LIST_OF_DATABASE_QUERY, GET_DATABASE_NAME_QUERY } from "../labels/queryLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"
import { GET_SCHEMA }  from '../labels/apiLabels'
import { getCurrentSchema } from "../utils/helperFunctions"

function APICallsHook(apiName, renderType, params) {
    const [data, setData, state] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [terminusClient] = useGlobalState(TERMINUS_CLIENT);


    useEffect(() => {
        async function woqlClientCall() {
           if (isObject(terminusClient)){
               if(terminusClient.server()){
                   switch(apiName){
                       case GET_SCHEMA:
                            terminusClient.getSchema({'terminus:encoding': 'terminus:turtle'},
                                                      getCurrentSchema(terminusClient))
                                            .then(function(response){
                                                setData({response: response});
                                                setLoading(false);
                                        	})
                                        	.catch(function(error){
                                        		console.log(error)
                                        	});
                            return [data, loading];
                       default:
                           console.log('APICallsHook.js - Invalid QueryName')
                   }
                   return;
               }
           }
        }
        woqlClientCall();
     }, [terminusClient]);

    return [data, loading];
}

export { APICallsHook };
