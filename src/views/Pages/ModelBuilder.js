import React,{useEffect,useState} from 'react';
import {SchemaBuilder,modelCallServerHook,GraphObjectProvider} from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client'
import { SimplePageView} from '../Templates/SimplePageView'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { ConsoleNavbar } from "../../components/Navbar/ConsoleNavbar";
import {DBContextObj} from '../../components/Query/DBContext'
import {NoPageLayout} from '../../components/Router/PrivateRoute'

export const ModelBuilder = (props) =>{   
    const { woqlClient, contextEnriched } = WOQLClientObj()
    const {graphs, setHead, branch, report} = DBContextObj()

    const {mainGraphDataProvider,
          saveGraphChanges,
          callServerError,
          callServerLoading} = modelCallServerHook(woqlClient)
    
    const saveData=(query)=>{
      saveGraphChanges(query)
    }

    return (
       <div id={props.id} className="console__page console__page--hidden" id="terminus-console-page">           
            <ConsoleNavbar onHeadChange={props.onHeadChange} />             
            <div>
            {!graphs || graphs['schema/main']===undefined && 
                <NoPageLayout noLoginButton={true} text="There is no schema graph." />
            }
            {graphs && graphs['schema/main']!==undefined && 
            <GraphObjectProvider mainGraphDataProvider={mainGraphDataProvider}>
              <SchemaBuilder saveGraph={saveData}/>
            </GraphObjectProvider>}
            </div>
        </div>           
      )
}

/*
 {callServerLoading && <div className="tdb__loading">loading !!!!</div>}
            {callServerError && <div > ERROR {callServerError}</div>}*/
                   