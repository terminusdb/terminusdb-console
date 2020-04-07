import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBIdsForSelectOptions,
        getDBListData, getDBListColumns, getUserSelectOpts,
        getColumnsForUserTable, getBindingUserData} from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { RENDER_TYPE_TABLE, RENDER_TYPE_GRAPH } from "../labels/renderTypeLabels";
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"

function RunQueriesHook(woqlQuery) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    let resultData = [];

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    useEffect(() => {

        function executeQuery(){
            let orig = dbClient.db();
            let columnConf = [], columnData = [];
            if(isObject(woqlQuery)){
                return woqlQuery.execute(dbClient).then((results) => {
                    let qcres = new TerminusClient.WOQLResult(results, woqlQuery);
                    if(qcres.hasBindings()){
                        setData({result:qcres});
                        //setLoading(false);
                        //return [data, loading];
                        return [data];
                    }
                }).catch((err)=>{
                     setLoading(false);
                     console.log(err)
                 })
            }
        }

        async function woqlClientCall() {
           if (isObject(dbClient)){
               if(dbClient.server()){
                   executeQuery();
                   return;
               }
           }
        }
        woqlClientCall();
    }, [dbClient, woqlQuery]);

    return [data];
}

export { RunQueriesHook };
