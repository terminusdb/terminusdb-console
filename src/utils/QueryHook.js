import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from './dataFormatter';
import * as queryList from './queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { LIST_OF_DATABASE_QUERY } from "../labels/queryLabels";
import { RENDER_TYPE_TABLE, RENDER_TYPE_MAPS, RENDER_TYPE_GRAPH } from "../labels/renderTypeLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"

function QueryHook(queryName, renderType, params) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [terminusClient] = useGlobalState(TERMINUS_CLIENT);

    useEffect(() => {

        function executeQuery(){
            const woqlQuery = queryList.getQuery(queryName);
            if(!woqlQuery) return;
            woqlQuery.execute(terminusClient).then((results) => {
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
                        console.log('QueryHook.js - Invalid renderType')
                }
            }).catch((err)=>{
                 setLoading(false);
                 console.log(err)
                 return [[], loading]
             })
        }

        async function woqlClientCall() {

           if (isObject(terminusClient)){
               if(terminusClient.server()){
                   //console.log('terminusClient in hookfetch', terminusClient);
                   switch(queryName){
                       case LIST_OF_DATABASE_QUERY:
                            const records = terminusClient.connection.getServerDBRecords();
                            const columnConf = getDBListColumns(records);
                            const columnData = getDBListData(records);
                            setData({columnData:columnData, columnConf:columnConf});
                            setLoading(false);
                            return [data, loading];
                   }
                   executeQuery();
                   return;
               }
           }
        }
        woqlClientCall();
     }, [terminusClient]);

    return [data, loading];
}

export { QueryHook };
