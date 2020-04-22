import React, { useState, useEffect } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import {databaseHomeLabels} from '../../variables/content';
import NavBar from '../../components/NavBar';
import RenderTable from "../../components/RenderTable";
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "../../labels/tabLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { getCurrentDBName, getCurrentDBID, isObject } from "../../utils/helperFunctions"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Details from './DatabaseDetails'
import Collaborate from './Collaborate'
import ManageDatabase from './ManageDatabase'
import { GET_COMMITS } from "../../labels/queryLabels"
import { getQuery } from "../../utils/queryList"
import { hooks } from "../../hooks"
import { getCommitControl } from "../../utils/stateChange"
import { nextCommit, previousCommit } from "../../variables/formLabels"
import { HistoryNavigator } from '../../components/HistoryNavigator/HistoryNavigator'

import * as tag from "../../labels/tags"

const DatabaseHome = (props) => {
    const { loading, user, isAuthenticated } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);

	const [query, setQuery] = useState(false);
	const [result, setResult] = useState(false);
	const [currentCommitMsg, setCurrentCommitMsg] = useState(false);
	const [parent, setParent] = useState(false);
	const [child, setChild] = useState(false);

	//const cc = dbClient.connectionConfig;
	//console.log('cc', cc)

	//const rId = dbClient.ref();
	//const rId = 'jqpg9g4eewiqq1kc0innjbwvmy8ydey'
	//const is_branch = false;
	//const [brId, setBrId] = useState(rId);
	//const [isBranch, setIsBranch] = useState(is_branch);

	//const [dataProvider] = hooks(query);

	
	/*useEffect(() => {
		const q = getQuery(GET_COMMITS, dbClient);
		setQuery(q);
    }, [brId, isBranch]);

	useEffect(() => {
		if(isObject(dataProvider)){
			let wr = dataProvider.results;
			console.log('wr', wr)
			getCommitControl(wr, brId, setParent, setChild, setCurrentCommitMsg);
			let bhead = wr.first()['BranchName']["@value"]
			if(bhead){
				dbClient.ref(false)
				dbClient.checkout(bhead)
			}
			else {
				dbClient.ref(brId)
			}
		}
    }, [dataProvider]);
	*/
    //const toggle = () => setIsOpen(!isOpen);

	if (loading) return <Loading />;

	const handlePreviousCommit = () => {
		setBrId(parent)
		setIsBranch(false)
	}

	const handleNextCommit = () => {
		setBrId(child)
		setIsBranch(false)
	}

    return (
    	<Container fluid className="h-100 pl-0 pr-0">
            <NavBar/>
    	    <Container className="flex-grow-1">
			 	<hr className = "my-space-50" />
    	  	    <legend>{getCurrentDBName(dbClient)}</legend>
				<hr className = "my-space-50"/>
					<HistoryNavigator />				
				<hr className = "my-space-5"/>

				 {isAuthenticated && <Tabs>
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
				</Tabs>}

				{(!isAuthenticated) && <Tabs>
				   <Tab label = {DETAILS_TAB}>
					   <hr className = "my-space-15"/>
					   <Details/>
				   </Tab>
			   </Tabs>}

    	    </Container>
    	</Container>
    )
}

export default DatabaseHome;
