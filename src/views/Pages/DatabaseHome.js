import React from "react";
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "./constants.pages"
import { DB_COLLABORATE, DB_MANAGE } from "../../constants/routes"
import { MonitorDB } from '../DBHome/MonitorDB'
import { Collaborate } from '../DBCollaborate/Collaborate'
import { ManageDB}  from '../DBManage/ManageDB'
import { TabbedPageView } from '../Templates/TabbedPageView'

const DatabaseHome = (props) => {
    let sections = [
        {id: "/" , label: DETAILS_TAB}, 
        {id: DB_COLLABORATE, label: COLLABORATE_TAB },
        {id: DB_MANAGE, label: MANAGE_TAB}, 
    ]
    return (  
        <TabbedPageView sections={sections} active={props.page} report={props.report}>            
            <MonitorDB key="monitor" label={DETAILS_TAB} />
            <Collaborate key="collaborate" label={COLLABORATE_TAB} />
            <ManageDB key="manage" label={MANAGE_TAB}/>
        </TabbedPageView>        
	)
}
export default DatabaseHome;
