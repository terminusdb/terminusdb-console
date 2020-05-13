import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container,Row, Col, Card, CardTitle, CardText, CardFooter,
		Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { CLONE, MASTER, PRIVATE, PUBLIC, ACTIONS } from "../../variables/databaseHomeLabels"
import { getCurrentDBID, getCurrentDBName, getCurrentDbDescr } from "../../utils/helperFunctions"
import { createDatabaseForm, database, size } from "../../variables/formLabels"
import { printts, DATETIME_FULL } from "../../utils/dateFormats"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DetailsCard } from "../../components/Card/DetailsCard"
import * as icons from "../../labels/iconLabels"
import TerminusClient from '@terminusdb/terminusdb-client';
import { isArray } from "../../utils/helperFunctions"

const Details = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();
	const [commitInfo, setCommitInfo] = useState([])
	const [dbInfo, setDbInfo] = useState([])
	const [userInfo, setUserInfo] = useState([])
	const [originInfo, setOriginInfo] = useState([])
	const always = true;

    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(woqlClient)
        woqlClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            setCommitInfo('Total branches available - ' + wr.count())
			setDbInfo(getCurrentDbDescr(woqlClient))
			setUserInfo('Size of database - 1GB')
			setOriginInfo('This database is local. Your ahead of origin by 2 commits.')
        })
    }, [dbInfo, commitInfo, userInfo, originInfo]);

	console.log('commitInfo', commitInfo)
	console.log('dbInfo', dbInfo)

    return (
        <div>
		    <hr className="my-space-50"/>
			<hr className="my-space-50"/>
			<hr className="my-space-50"/>

			<Row>
				<Col md={3} className="mb-3 dd-c">
					{dbInfo && <DetailsCard icon={icons.INFO}
						title = "DB Name"
						value = {getCurrentDBName(woqlClient)}
						info = {dbInfo}/>}
				</Col>

				<Col md={3} className="mb-3 dd-c">
	               {commitInfo && <DetailsCard icon={icons.COMMIT}
	                    title="Commits"
	                    value="234"
	                    info={commitInfo}/>}
	            </Col>

				<Col md={3} className="mb-3 dd-c">
					{userInfo && <DetailsCard icon={icons.USERS}
						title="Users"
						value="5"
						info={userInfo}/>}
				</Col>

				<Col md={3} className="mb-3 dd-c">
					{originInfo && <DetailsCard icon={icons.ORIGIN}
						title="Origin"
						value="Local"
						info={originInfo}/>}
				</Col>
			</Row>

			<legend>Recent Updates</legend>

       </div>
    )
}

export default Details;

/*

<label className = { createDatabaseForm.id.label.className } htmlFor = "database-id">
	{ createDatabaseForm.id.label.text }
</label>
<input placeholder={ createDatabaseForm.id.input.placeholder }
	className = { createDatabaseForm.id.input.className }
	name = "database-id"
	readOnly
	value = {woqlClient.db()}
	ref = { register({ validate: value => value.length > 0}) }/>
{errors.databaseID &&
	<p className = { createDatabaseForm.id.error.className }>
		{ createDatabaseForm.id.error.text }
	</p>
}
<label className = { createDatabaseForm.databaseName.label.className } htmlFor = "database-name">
	{ createDatabaseForm.databaseName.label.text }
</label>
<input name= "database-name" value = {getCurrentDBName(woqlClient)}
   className = { createDatabaseForm.databaseName.input.className }
   readOnly
   placeholder = { createDatabaseForm.databaseName.input.placeholder }
   ref = { register({ validate: value => value.length > 0}) }/>
{ errors.databaseName &&
	<p className = { createDatabaseForm.databaseName.error.className }>
		{ createDatabaseForm.databaseName.error.text }
	</p>
}
<label className = { createDatabaseForm.databaseDescr.label.className } htmlFor = "database-description">
   { createDatabaseForm.databaseDescr.label.text }
</label>

<textarea name = "database-description"
	className = { createDatabaseForm.databaseDescr.input.className }
	readOnly
	placeholder = { createDatabaseForm.databaseDescr.input.placeholder }
	ref={register} />


*/
