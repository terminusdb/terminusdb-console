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
    const { woqlClient } = WOQLClientObj()
    const {graphs, setHead, branch, report, ref} = DBContextObj()

    const dbName = woqlClient ? woqlClient.db() : ''
    const {mainGraphDataProvider,
          saveGraphChanges,
          reportMessage,
          callServerLoading,resetReport
          } = modelCallServerHook(woqlClient,branch,ref)
    
    const saveData=(query,commitMessage)=>{
      saveGraphChanges(query,commitMessage)
    }

    if(graphs && graphs['schema/main']===undefined){
      return  <NoPageLayout noLoginButton={true} text="There is no main schema graph." />
    }
/*
<div className="icon-header tdb__model__xicon" >         
                  <i className="fa fa-times" title="close box" 
                  onClick={resetReport}></i>
               </div>*/


    return (
       <div id={props.id} className="console__page console__page--hidden" id="terminus-console-page">           
            <ConsoleNavbar onHeadChange={props.onHeadChange} />         
            {reportMessage && 
              <div className="tdb__model__message">
                
                <TerminusDBSpeaks  report={reportMessage} onClose={resetReport}/>
              </div>}
                                
            
              {graphs && graphs['schema/main']!==undefined &&
                <> 
                <GraphObjectProvider mainGraphDataProvider={mainGraphDataProvider} dbName={dbName}>
                  <SchemaBuilder saveGraph={saveData} dbName={dbName}/>
                </GraphObjectProvider>
                </>
              }
              {callServerLoading && <Loading/>}
            
        </div>           
      )
}


                   