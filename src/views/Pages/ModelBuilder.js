import React,{useEffect,useState} from 'react';
import {SchemaBuilder,modelCallServerHook,GraphObjectProvider} from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client'
import { SimplePageView} from '../Templates/SimplePageView'
import {WOQLClientObj} from '../../init/woql-client-instance'
import { ConsoleNavbar } from "../../components/Navbar/ConsoleNavbar";
import {DBContextObj} from '../../components/Query/DBContext'
import {NoPageLayout} from '../../components/Router/PrivateRoute'
import Loading from '../../components/Reports/Loading'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'

export const ModelBuilder = (props) =>{   
    const { woqlClient, contextEnriched } = WOQLClientObj()
    const {graphs, setHead, branch, report, ref} = DBContextObj()

    const {mainGraphDataProvider,
          saveGraphChanges,
          reportMessage,
          callServerLoading} = modelCallServerHook(woqlClient,branch,ref)
    
    const saveData=(query)=>{
      saveGraphChanges(query)
    }

    if(!graphs || graphs['schema/main']===undefined){
      return  <NoPageLayout noLoginButton={true} text="There is no main schema graph." />
    }

    return (
       <div id={props.id} className="console__page console__page--hidden" id="terminus-console-page">           
            <ConsoleNavbar onHeadChange={props.onHeadChange} />
            {reportMessage && 
              <div className="tdb__model__message">
                <TerminusDBSpeaks  report={reportMessage} />
              </div>}                      
            
              {graphs && graphs['schema/main']!==undefined &&
                <> 
                <GraphObjectProvider mainGraphDataProvider={mainGraphDataProvider}>
                  <SchemaBuilder saveGraph={saveData}/>
                </GraphObjectProvider>
                </>
              }
              {callServerLoading && <Loading/>}
            
        </div>           
      )
}


                   