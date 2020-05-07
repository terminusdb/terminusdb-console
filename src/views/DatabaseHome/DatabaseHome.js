import React, { useState, useEffect } from "react";
import {databaseHomeLabels} from '../../variables/content';
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "../../labels/tabLabels"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Details from './DatabaseDetails'
import Collaborate from './Collaborate'
import ManageDatabase from './ManageDatabase'
import { PageView } from '../PageView'

const DatabaseHome = (props) => {
    return (  
        < PageView >
            <Tabs>
                <Tab label = {DETAILS_TAB}>
                    <hr className = "my-space-15"/>
                    <Details/>
                </Tab>
                <Tab label = {COLLABORATE_TAB}>
                    <hr className = "my-space-15"/>
                    <Collaborate/>
                </Tab>
                <Tab label = {MANAGE_TAB}>
                    <hr className = "my-space-15"/>
                    <ManageDatabase/>
                </Tab>
            </Tabs>
        </PageView>   
	)
}
export default DatabaseHome;
