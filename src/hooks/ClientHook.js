import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { CREATE_NEW_USER } from "../labels/actionLabels"
import { TERMINUS_CLIENT } from "../labels/globalStateLabels"
import { GET_SCHEMA, CREATE_DATABASE }  from '../labels/apiLabels'
import { getCurrentSchema } from "../utils/helperFunctions"

function ClientHook(actionName, params) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    let hookArr=[];

    console.log('params', params)

    switch(actionName){
      case CREATE_NEW_USER:
          hookArr=[params]
          break;
    }


    useEffect(() => {
        async function actionClientCall() {
           if (isObject(dbClient)){
               if(dbClient.server()){

                   switch(actionName){

                       case CREATE_NEW_USER:
                           if(isObject(params)){

                               let orig = dbClient.db();
                               dbClient.db("terminus")

                               let uman = new TerminusClient.UserManager(dbClient);
                               uman.createUser(params.id, params.title, params.email,
                                    params.description).then((response) => {
                                        console.log('dbClient', dbClient)
                                      // uman.createCapability(params.id, params.id + '_Capability',
                                      //      params.id + '_Capability',
                                      //      ["terminus:get_document", "terminus:woql_select"],orig)
                                      //     .then((response) => {
                                           setData({response: response});
                                           setLoading(false);
                                           return [data, loading];
                                       //})
                                       //uman.createCapability("doc:2perm", "New Capability x", "Testing adding capabilities", ["terminus:get_document", "terminus:woql_select"], "v2");
                                   })
                                   .catch(function(error){
                                       console.log(error)
                                   }).finally(() => dbClient.db(orig));
                           }
                   }

                   return;
               }
           }
        }
        actionClientCall();
    }, [params.id, params.name, params.description, params.email]);

    return [data, loading];
}

export { ClientHook };
