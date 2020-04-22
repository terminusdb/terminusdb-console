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
import { GET_COMMIT_HEAD } from "../../labels/queryLabels"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Details from './DatabaseDetails'
import { HistoryNavigator } from "./HistoryNavigator"
import BranchSelector from './BranchSelector'
import Collaborate from './Collaborate'
import ManageDatabase from './ManageDatabase'
import { CommitButtons } from './CommitButtons'
import { getQuery } from "../../utils/queryList"
import { hooks } from "../../hooks"

const DatabaseHome = (props) => {
    const { loading, user, isAuthenticated } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);
	const [query, setQuery] = useState(false);
    const isHead = false;
	const [head, setHead] = useState(false);

	const [updatedCommitButton, setUpdatedCommitButton] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

	if (loading) return <Loading />;

	const [dataProvider] = hooks(query);

	useEffect(() => {
		const q = getQuery(GET_COMMIT_HEAD, {dbId: dbClient.db(),
					bid: dbClient.checkout()});
		setQuery(q);
    }, [isHead]);

	useEffect(() => {
		if(isObject(dataProvider))
			setHead(dataProvider.results.bindings[0].HeadID['@value'])
    }, [dataProvider]);

    return (
    	<Container fluid className="h-100 pl-0 pr-0">
            <NavBar/>
    	    <Container className="flex-grow-1">
			 	<hr className = "my-space-50" />
    	  	    <legend>{getCurrentDBName(dbClient)}</legend>
				<hr className = "my-space-50"/>
				<span className = "d-fl mb-12">
					<Col md={8} className="mb-8">
						<HistoryNavigator/>
					</Col>
					<Col md={1} className="mb-1"/>
					<Col md={3} className="mb-3">
						<BranchSelector/>
					</Col>
				</span>
				{head && <CommitButtons head = { head }/>}

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
