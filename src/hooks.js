import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import * as queryList from './utils/queryList';
import { useGlobalState } from "./init/initializeGlobalState";
import { isObject } from "./utils/helperFunctions";
import { TERMINUS_CLIENT } from "./labels/globalStateLabels"
import { DOC_PREFIX } from "./labels/tags"

function hooks(woql, queryName, params) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    let bindings = [];
    const opts = params || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    useEffect(() => {
        function executeQuery(){
            if(isObject(woql)){
                woql.execute(dbClient).then((results) => {
                    let rObject = new TerminusClient.WOQLResult(results, woql);
                    if(rObject.hasBindings()){
                        //bindings = rObject.getBindings();
                        setData({results: rObject});
                        setLoading(false);
                        return [data];
                    }
                    return
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
               }
           }
        }
        woqlClientCall();

    }, [dbClient, woql]);

    return [data];
}

export { hooks };
