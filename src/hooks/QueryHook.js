import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBIdsForSelectOptions,
        getDBListData, getDBListColumns, getUserSelectOpts,
        getColumnsForUserTable, getBindingUserData} from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
//import { useGlobalState } from "../init/initializeGlobalState";
//import { isObject } from "../utils/helperFunctions";
import { LIST_OF_DATABASE_QUERY, LIST_OF_DATABASE_ID, GET_USERS_NOT_IN_DB,
    GET_USER_ACCESS_FOR_DB } from "../labels/queryLabels";
import { RENDER_TYPE_TABLE, RENDER_TYPE_MAPS, RENDER_TYPE_GRAPH, GET_BINDINGS } from "../labels/renderTypeLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels";
import { WOQLClientObj } from "../init/woql-client-instance";

/*
* to be review maybe we can get from woql-client-instanse ..
*/
function QueryHook(queryName, renderType, params,) {
    const [data, setData, state] = useState([]);
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {}; 

    const { woqlClient} = WOQLClientObj();
    const dbClient=woqlClient;
    
    //const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    useEffect(() => {

        function executeQuery(){
            let orig = dbClient.db();
            let columnConf = [], columnData = [];
            const woqlQuery = queryList.getQuery(queryName, dbClient);
            if(!woqlQuery) return;
            if((queryName === GET_USERS_NOT_IN_DB) || (queryName === GET_USER_ACCESS_FOR_DB))
                dbClient.db("terminus");
            woqlQuery.execute(dbClient).then((results) => {
                let qcres = new TerminusClient.WOQLResult(results, woqlQuery);
                switch(renderType){
                    case RENDER_TYPE_TABLE:
                        if(qcres.hasBindings()){
                            resultData = qcres.getBindings();
                            if(queryName === GET_USER_ACCESS_FOR_DB){
                                 columnConf = getColumnsForUserTable(resultData);
                                 columnData = getBindingUserData(resultData);
                                 dbClient.db(orig);
                            }
                            else {
                                columnConf = getColumnsForTable(resultData);
                                columnData = getBindingData(resultData);
                            }
                            setData({columnData:columnData, columnConf:columnConf});
                            setLoading(false);
                            return [data, loading];
                        }
                        return
                    case RENDER_TYPE_MAPS:
                        return
                    case RENDER_TYPE_GRAPH:
                        return
                    case GET_BINDINGS:
                        if(qcres.hasBindings()){
                            resultData = qcres.getBindings();
                            if(queryName === GET_USERS_NOT_IN_DB) {
                                const data = getUserSelectOpts(resultData)
                                setData({result: data});
                                setLoading(false);
                                dbClient.db(orig);
                            }
                            return [data, loading];
                        }
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
           if (dbClient){
               if(dbClient.server()){
                   //console.log('dbClient in hookfetch', dbClient);
                   switch(queryName){
                       case LIST_OF_DATABASE_QUERY:
                            //const records = dbClient.connection.getServerDBRecords();
                            const records = dbClient.connection.getServerDBMetadata();
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
