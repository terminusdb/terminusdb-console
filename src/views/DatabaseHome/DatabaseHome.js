import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import {databaseHomeLabels} from '../../variables/content';
import NavBar from '../../components/NavBar';
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "../../labels/tabLabels"
import { getCurrentDBName } from "../../utils/helperFunctions"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Details from './DatabaseDetails'
import Collaborate from './Collaborate'
import ManageDatabase from './ManageDatabase'
import { getQuery } from "../../utils/queryList"
import { getCommitControl } from "../../utils/stateChange"
import { nextCommit, previousCommit } from "../../variables/formLabels"
import { HistoryNavigator } from '../../components/HistoryNavigator/HistoryNavigator'
import { WOQLClientObj } from "../../init/woql-client-instance";
import * as tag from "../../labels/tags"

const DatabaseHome = (props) => {
	const [created, setCreated]  =  useState(false);
	const [commitInfo, setCommitInfo] = useState(false);
    const { isAuthenticated } = useAuth0();
    const {woqlClient} = WOQLClientObj();

    return (
    	<Container fluid className="h-100 pl-0 pr-0">
            <NavBar/>
    	    <Container className="flex-grow-1">
			 	<hr className = "my-space-50" />
    	  	    <legend>{getCurrentDBName(woqlClient)}</legend>
				<hr className = "my-space-50"/>
					<HistoryNavigator setCreated = {setCreated}
						setCommitInfo = {setCommitInfo}/>
				<hr className = "my-space-5"/>

				 {isAuthenticated && <Tabs>
				    <Tab label = {DETAILS_TAB}>
					    <hr className = "my-space-15"/>
						<Details created = { created }
							commitInfo = { commitInfo }/>
				    </Tab>
				    <Tab label = {COLLABORATE_TAB}>
						<hr className = "my-space-15"/>
						<Collaborate/>
					</Tab>
					<Tab label = {MANAGE_TAB}>
						<hr className = "my-space-15"/>
						<ManageDatabase/>
					</Tab>
				</Tabs>}

				{(!isAuthenticated) && <Tabs>
				   <Tab label = {DETAILS_TAB}>
					   <hr className = "my-space-15"/>
					   <Details created = { created }
						   commitInfo = { commitInfo }/>
				   </Tab>
			   </Tabs>}

    	    </Container>
    	</Container>
    )
}

export default DatabaseHome;
