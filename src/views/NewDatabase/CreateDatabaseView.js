import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import { createDatabaseLabels } from '../../variables/content'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CREATE_DATABASE_TAB, CLONE_LOCAL_DB_TAB, CLONE_REMOTE_DB_TAB } from "../../labels/tabLabels"
import { CreateOptions } from "./CreateOptions"
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import { CopyFrom } from "./CopyFrom"
import cancelImg from "../../img/icons/cancel.png"
import { createDbCard } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"

const CreateDatabase = (props) => {
	const [copy, setCopy] = useState(false)
	const [create, setCreate] = useState(false)
	const [main, setMain] = useState(true)

	const handleCreate = () => {
		setCreate(true)
		setCopy(false)
		setMain(false)
	}

	const handleCopy = () => {
		setCopy(true)
		setCreate(false)
		setMain(false)
	}

	const handleCancel = () => {
		setMain(true)
	}

	return (
		<Container fluid className="h-100 pl-0 pr-0">
			<Container className="flex-grow-1">
		        <hr className = "my-space-50"/>
				{!main && <img src={ cancelImg } onClick={ handleCancel } className='cancel-ic'/>}
				{main && <span className="d-fl">
					<Col md={6} className="col-md-6">
						<Card body outline color="info" onClick={handleCreate} className="db-view-cards">
							<DatabaseCard card = {createDbCard.create}/>
						</Card>
					</Col>

					<Col md={6} className="col-md-6">
						<Card body outline color="info" onClick={handleCopy} className="db-view-cards">
							<DatabaseCard card = {createDbCard.copy}/>
						</Card>
					</Col>
				</span>}

				{!main && create && <CreateOptions/>}
				{!main && copy && <CopyFrom/> }

			</Container>
	</Container>
	)
}

export default CreateDatabase;
