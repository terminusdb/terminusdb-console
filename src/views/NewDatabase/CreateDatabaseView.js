import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, CardTitle, CardText, CardImg } from "reactstrap";
import { createDatabaseLabels } from '../../variables/content'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CREATE_DATABASE_TAB, CLONE_LOCAL_DB_TAB, CLONE_REMOTE_DB_TAB } from "../../labels/tabLabels"
import { CreateOptions } from "./CreateOptions"
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import { CopyFrom } from "./CopyFrom"
import createImg from "../../img/icons/create-db.png"
import copyImg from "../../img/icons/copy-db.png"
import cancelImg from "../../img/icons/cancel.png"

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
						<Card body outline color="info">
							<hr className = "my-space-100"/>
							<CardImg top width="100%" src={createImg}/>
							<hr className = "my-space-100"/>
							<CardTitle>Do you want to create a brand new database?</CardTitle>
							<Button color="secondary" onClick={handleCreate}>Create</Button>
						</Card>
					</Col>

					<Col md={6} className="col-md-6">
						<Card body outline color="info">
							<hr className = "my-space-100"/>
							<CardImg top width="100%" src={copyImg}/>
							<hr className = "my-space-100"/>
							<CardTitle>Do you want to copy an existing database?</CardTitle>
							<Button color="secondary" onClick={handleCopy}>Copy</Button>
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
