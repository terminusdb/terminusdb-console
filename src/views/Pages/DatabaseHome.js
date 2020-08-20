import React from "react";
import { DETAILS_TAB } from "./constants.pages"
import { MonitorDB } from '../DBHome/MonitorDB'
import {PageView} from '../Templates/PageView'

const DatabaseHome = (props) => {

    /*
    * to be review the template SimpleView
    * move the navbar
    */

    return (  
        <PageView report={props.report} dbPage={true}>          
           <MonitorDB key="monitor" label={DETAILS_TAB} />
        </PageView>        
	)
}
export default DatabaseHome;
