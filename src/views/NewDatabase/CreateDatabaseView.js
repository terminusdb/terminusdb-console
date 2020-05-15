import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, CardTitle, CardText, CardImg, ButtonGroup } from "reactstrap";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CREATE_DATABASE_TAB, CLONE_LOCAL_DB_TAB, CLONE_REMOTE_DB_TAB } from "../../labels/tabLabels"
import CloneLocalDB from "./CloneLocalDB"
import CloneRemoteDB from "./CloneRemoteDB"
import { createDbCard } from "../../variables/formLabels"
import { DatabaseCard } from "../../components/Card/DatabaseCard"
import * as view from "../../labels/createView"
import { CreateOptions } from "./CreateOptions"
import { CopyFrom } from "./CopyFrom"
import { CopyType } from "./CopyType"
import CreateDB from "./CreateForm"
import { DialogueBox } from "../../components/Reports/DialogueBox"
import { Crumbs } from "../../components/BreadCrumbs"

const CreateDatabase = (props) => {
	const [page, setPage] = useState(view.CREATE_VIEW)

	const [createLocal, setCreateLocal] = useState(false)
	const [createRemote, setCreateRemote] = useState(false)
	const [copyLocal, setCopyLocal] = useState(false);
    const [copyRemote, setCopyRemote] = useState(false);
	const [clone, setClone] = useState(false)

	const [action, setAction] = useState(false)
	const [copyFrom, setCopyFrom] = useState(false)
	const [copyType, setCopyType] = useState(false)

	const handleCreate = () => {
		setPage(view.CREATE_OPTIONS)
		setAction(view.CREATE_DB)
	}

	const handleCopy = () => {
		setPage(view.COPY_OPTIONS)
		setAction(view.COPY_DB)
	}

	useEffect(() => {
        if(copyLocal) setCopyFrom(view.LOCAL)
		else if(copyRemote) setCopyFrom(view.REMOTE)
    }, [copyLocal, copyRemote]);

	useEffect(() => {
        if(clone) setCopyType(view.CLONE)
		else  setCopyType(view.FORK)
    }, [clone]);

	return (
		<Container fluid className="h-100 pl-0 pr-0">
			<Container className="flex-grow-1">
		        <hr className = "my-space-50"/>
				{(page == view.CREATE_VIEW) && <>
					<Crumbs/>
					<span className="d-fl">
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
				</span></>}

				{(page == view.CREATE_OPTIONS) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.CREATE_OPTIONS, text:view.CREATE_OPTIONS}]} setPage = { setPage }/>
					<CreateOptions setPage = { setPage } setCreateRemote = { setCreateRemote } setCreateLocal = { setCreateRemote }/>
				</>}
				{(page == view.COPY_OPTIONS) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.COPY_OPTIONS, text:view.COPY_OPTIONS}]} setPage = { setPage }/>
					<CopyFrom setPage = { setPage } setRemote = { setCopyRemote } setLocal = { setCopyLocal }/>
				</>}
				{(page == view.COPY_TYPES) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.COPY_OPTIONS, text: copyFrom},
						{page:view.COPY_TYPES, text:view.COPY_TYPES}]} setPage = { setPage }/>
					<CopyType setPage = { setPage } local = { copyLocal } remote = { copyRemote } setClone = { setClone }/>
				</>}
				{(page == view.CLONE_LOCAL) && (copyLocal) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.COPY_OPTIONS, text: copyFrom},
						{page:view.COPY_TYPES, text:copyType},
						{page:view.COPY, text: view.COPY}]} setPage = { setPage }/>
					<CloneLocalDB setPage = { setPage }/>
				</>}
				{(page == view.CLONE_REMOTE) && (copyRemote) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.COPY_OPTIONS, text: copyFrom},
						{page:view.COPY_TYPES, text:copyType},
						{page:view.COPY, text:view.COPY}]} setPage = { setPage }/>
					<CloneRemoteDB setPage = { setPage }/>
				</>}
				{(page == view.CREATE_LOCAL) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.CREATE_OPTIONS, text: view.LOCAL},
						{page:view.CREATE_LOCAL, text:view.CREATE_LOCAL}]}
						setPage = { setPage }/>
					<CreateDB setPage = { setPage }/>
				</>}
				{(page == view.CREATE_REMOTE) && <>
					<Crumbs buttons = {[{page:view.CREATE_VIEW, text:action},
						{page:view.CREATE_OPTIONS, text: view.REMOTE},
						{page:view.CREATE_REMOTE, text:view.CREATE_REMOTE}]}
						setPage = { setPage }/>
					<DialogueBox message = { 'Coming soon ...!'}/>
				</>}

			</Container>
	</Container>
	)
}

export default CreateDatabase;
