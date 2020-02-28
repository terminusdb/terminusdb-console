import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBIdsForSelectOptions,
         getDBListData, getDBListColumns } from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { LIST_OF_DATABASE_QUERY, LIST_OF_DATABASE_ID } from "../labels/queryLabels";
import { RENDER_TYPE_TABLE, RENDER_TYPE_MAPS, RENDER_TYPE_GRAPH } from "../labels/renderTypeLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"

function QueryHook(queryName, renderType, params) {
    const [data, setData, state] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    useEffect(() => {

        function executeQuery(){
            const woqlQuery = queryList.getQuery(queryName);
            if(!woqlQuery) return;
            woqlQuery.execute(dbClient).then((results) => {
                let qcres = new TerminusClient.WOQLResult(results, woqlQuery);
                switch(renderType){
                    case RENDER_TYPE_TABLE:
                        if(qcres.hasBindings()){
                            resultData = qcres.getBindings();
                            const columnConf = getColumnsForTable(resultData);
                            const columnData = getBindingData(resultData);
                            setData({columnData:columnData, columnConf:columnConf});
                            setLoading(false);
                            return [data, loading];
                        }
                        return
                    case RENDER_TYPE_MAPS:
                        return
                    case RENDER_TYPE_GRAPH:
                        return
                    default:
                        //console.log('QueryHook.js - Invalid renderType')
                        return
                }
            }).catch((err)=>{
                 setLoading(false);
                 console.log(err)
             })
        }

        async function woqlClientCall() {
           if (isObject(dbClient)){
               if(dbClient.server()){
                   //console.log('dbClient in hookfetch', dbClient);
                   switch(queryName){
                       case LIST_OF_DATABASE_QUERY:
                            const records = dbClient.connection.getServerDBRecords();
                            const columnConf = getDBListColumns(records);
                            const columnData = getDBListData(records);
                            setData({columnData:columnData, columnConf:columnConf});
                            setLoading(false);
                            return [data, loading];
                       case LIST_OF_DATABASE_ID:
                           const recs = dbClient.connection.getServerDBRecords();
                           const ids = getDBIdsForSelectOptions(recs);
                           setData({columnData:ids});
                           setLoading(false);
                           return [data, loading];
                   }
                   executeQuery();
                   return;
               }
           }
        }
        woqlClientCall();
     }, [dbClient]);

    return [data, loading];
}

export { QueryHook };
