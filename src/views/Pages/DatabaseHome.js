import React from "react";
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "./constants.pages"
import { DB_COLLABORATE, DB_MANAGE } from "../../constants/routes"
import Details from '../DBHome/DatabaseDetails'
import Collaborate from '../DBCollaborate/Collaborate'
import ManageDatabase from '../DBManage/ManageDatabase'
import { TabbedPageView } from '../Templates/PageView'

const DatabaseHome = (props) => {
    let sections = [
        {id: "/" , label: DETAILS_TAB}, 
        {id: DB_COLLABORATE, label: COLLABORATE_TAB },
        {id: DB_MANAGE, label: MANAGE_TAB}, 
    ]
    return (  
        <TabbedPageView sections={sections} active={props.page} report={props.report}>            
            <Details key="monitor" />
            <Collaborate key="collaborate" />
            <ManageDatabase key="manage" />
        </TabbedPageView>        
	)
}
export default DatabaseHome;
