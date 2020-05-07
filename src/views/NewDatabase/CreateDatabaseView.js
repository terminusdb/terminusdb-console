import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { createDatabaseLabels } from '../../variables/content'
import NavBar from '../../components/NavBar'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CREATE_DATABASE_TAB, CLONE_LOCAL_DB_TAB, CLONE_REMOTE_DB_TAB } from "../../labels/tabLabels"
import CreateDB from "./Create"
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"

const CreateDatabase = (props) => {

	return (
		<Container fluid className="h-100 pl-0 pr-0">
		<NavBar resetDB = {true}/>
			<Container className="flex-grow-1">
	        <hr className = "my-space-50"/>
	        {/*<legend>{ createDatabaseLabels.title }</legend>
	        <hr className = "my-3"/>*/}
	        <Tabs>
	            <Tab label = { CREATE_DATABASE_TAB }>
	                <CreateDB action = { CREATE_DATABASE_TAB }/>
	            </Tab>
	            <Tab label = { CLONE_LOCAL_DB_TAB }>
	                <CloneLocalDB action = { CLONE_LOCAL_DB_TAB }/>
	            </Tab>
				<Tab label = { CLONE_REMOTE_DB_TAB }>
	                <CloneRemoteDB action = { CLONE_REMOTE_DB_TAB }/>
	            </Tab>
	        </Tabs>
			</Container>
	</Container>
	)
}

export default CreateDatabase;
