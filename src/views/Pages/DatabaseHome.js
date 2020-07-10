import React from "react";
import { DETAILS_TAB, SYNCHRONISE_TAB, MANAGE_TAB } from "./constants.pages"
import { DB_SYNCHRONISE, DB_MANAGE } from "../../constants/routes"
import { MonitorDB } from '../DBHome/MonitorDB'
import { Synchronise } from '../DBCollaborate/Synchronise'
import { ManageDB}  from '../DBManage/ManageDB'
import { TabbedPageView } from '../Templates/TabbedPageView'
import {WOQLClientObj} from '../../init/woql-client-instance'


const DatabaseHome = (props) => {
    const { woqlClient, contextEnriched } = WOQLClientObj()
    
    let db = woqlClient.get_database()
    var sections = []
    var tabs = []
    if(props.page == DB_SYNCHRONISE && db.remote){
        sections = [ 
            {id: DB_SYNCHRONISE, label: SYNCHRONISE_TAB },
            {id: "/" , label: DETAILS_TAB}, 
            {id: DB_MANAGE, label: MANAGE_TAB}, 
        ]
        tabs.push(<Synchronise key="synchronise" label={SYNCHRONISE_TAB} />)
        tabs.push(<MonitorDB key="monitor" label={DETAILS_TAB} />)
        tabs.push(<ManageDB key="manage" label={MANAGE_TAB}/>)
    }
    else if(props.page == DB_MANAGE){
        sections = [ 
            {id: DB_MANAGE, label: MANAGE_TAB}, 
            {id: "/" , label: DETAILS_TAB}, 
        ]
        tabs.push(<ManageDB key="manage" label={MANAGE_TAB}/>)
        tabs.push(<MonitorDB key="monitor" label={DETAILS_TAB} />)
        if(db.remote){
            sections.push({id: DB_SYNCHRONISE, label: SYNCHRONISE_TAB }) 
            tabs.push(<Synchronise key="synchronise" label={SYNCHRONISE_TAB} />)
        }
    }
    else {
        sections = [ 
            {id: "/" , label: DETAILS_TAB}, 
            {id: DB_MANAGE, label: MANAGE_TAB}, 
        ]
        tabs.push(<MonitorDB key="monitor" label={DETAILS_TAB} />)
        tabs.push(<ManageDB key="manage" label={MANAGE_TAB}/>)
        if(db.remote){
            sections.push({id: DB_SYNCHRONISE, label: SYNCHRONISE_TAB }) 
            tabs.push(<Synchronise key="synchronise" label={SYNCHRONISE_TAB} />)
        }
    }
    return (  
        <TabbedPageView sections={sections} active={props.page} report={props.report}>            
            {tabs}
        </TabbedPageView>        
	)
}
export default DatabaseHome;
