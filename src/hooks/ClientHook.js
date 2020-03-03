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
import { getAccessPermissions, getCapabilityID } from "../utils/userManagerFunctions"

function ClientHook(actionName, params) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    let resultData = [];
    const opts = params || {};

    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    let hookArr=[];

    //console.log('params', params)

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
                               dbClient.db("terminus");

                               const permissions = getAccessPermissions(params.Read, params.Write, params.Manage);
                               const capabilityID = getCapabilityID(params.Read, params.Write, params.Manage);

                               let uman = new TerminusClient.UserManager(dbClient);
                               // create User id
                               uman.createUser(params.id, params.title, params.email,
                                    params.description).then((response) => {
                                       // create capability id for db
                                       uman.createCapability(capabilityID,
                                            capabilityID,
                                            false,
                                            permissions,
                                            orig)
                                           .then((response) => {
                                               // attach user and capability id
                                               uman.addUserCapability(params.id, capabilityID).then((response) => {
                                                   setData({response: response});
                                                   setLoading(false);
                                                   dbClient.db(orig);
                                                   return [data, loading];
                                               })
                                               .catch(function(error){
                                                   console.log(error)
                                                   dbClient.db(orig)
                                               })//.finally(() => dbClient.db(orig))
                                            })
                                            .catch(function(error){
                                                console.log(error)
                                                dbClient.db(orig)
                                            })//.finally(() => dbClient.db(orig))
                                   })
                                   .catch(function(error){
                                       console.log(error)
                                       dbClient.db(orig)
                                   })//.finally(() => dbClient.db(orig));
                           }
                   }

                   return;
               }
           }
        }
        actionClientCall();
    }, [params.id, params.name, params.description, params.email, params.Read, params.Write, params.Manage]);

    return [data, loading];
}

export { ClientHook };
