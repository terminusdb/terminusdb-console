import { useState, useEffect } from "react";
import TerminusClient from '@terminusdb/terminus-client';
import { getColumnsForTable, getBindingData, getDBListData, getDBListColumns } from '../utils/dataFormatter';
import * as queryList from '../utils/queryList';
import { useGlobalState } from "../init/initializeGlobalState";
import { isObject } from "../utils/helperFunctions";
import { localSettings } from "../config/localSettings";
import { CREATE_NEW_USER, ADD_USER, UPDATE_USER_PERMISSIONS } from "../labels/actionLabels"
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
                               const capabilityID = getCapabilityID(params.Read, params.Write, params.Manage, orig);

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
                                                   setData(true);
                                                   setLoading(false);
                                                   dbClient.db(orig);
                                                   return [data, loading];
                                               })
                                               .catch(function(error){
                                                   console.log(error)
                                                   dbClient.db(orig)
                                               })


                                            })
                                            .catch(function(error){
                                                console.log(error)
                                                dbClient.db(orig)
                                            })
                                   })
                                   .catch(function(error){
                                       console.log(error)
                                       dbClient.db(orig)
                                   })
                           } // CREATE_NEW_USER
                           break;

                       case ADD_USER:
                           if(isObject(params)){

                               let orig = dbClient.db();
                               dbClient.db("terminus");

                               const permissions = getAccessPermissions(params.Read, params.Write, params.Manage);
                               const capabilityID = getCapabilityID(params.Read, params.Write, params.Manage, orig);

                               let uman = new TerminusClient.UserManager(dbClient);
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
                                       })

                                    })
                                    .catch(function(error){
                                        console.log(error)
                                        dbClient.db(orig)
                                    })
                           } //ADD_USER
                           break;

                           case UPDATE_USER_PERMISSIONS:
                               if(isObject(params)){

                                   let orig = dbClient.db();
                                   dbClient.db("terminus");

                                   const permissions = getAccessPermissions(params.Read, params.Write, params.Manage);
                                   const capabilityID = getCapabilityID(params.Read, params.Write, params.Manage, orig);

                                   let uman = new TerminusClient.UserManager(dbClient);
                                   // remove existing capability of  user
                                   uman.removeUserCapability(params.id, params.previousCapabilityId)
                                       .then((response) => {
                                           // create capability id for db
                                           uman.createCapability(capabilityID,
                                                capabilityID,
                                                false,
                                                permissions,
                                                orig)
                                               .then((response) => {
                                                   // attach user and capability id
                                                   uman.addUserCapability(params.id, capabilityID).then((response) => {
                                                       setData(true);
                                                       setLoading(false);
                                                       dbClient.db(orig);
                                                       return [data, loading];
                                                   })
                                                   .catch(function(error){
                                                       console.log(error)
                                                       dbClient.db(orig)
                                                   })

                                                })
                                                .catch(function(error){
                                                    console.log(error)
                                                    dbClient.db(orig)
                                                })
                                       })
                                       .catch(function(error){
                                           console.log(error)
                                           dbClient.db(orig)
                                       })
                               } //UPDATE_USER_PERMISSIONS
                           break;
                   }

                   return;
               }
           }
        }
        actionClientCall();
    }, [params.id, params.name, params.description, params.email, params.Read, params.Write, params.Manage, params.previousCapabilityId]);

    return [data, loading];
}

export { ClientHook };
