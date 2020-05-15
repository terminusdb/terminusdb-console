import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from "reactstrap";
import { getCurrentDBID, getCurrentDBName, getCurrentDbDescr } from "../../utils/helperFunctions"
import { createDatabaseForm, database, size } from "../../variables/formLabels"
import { printts, DATETIME_FULL } from "../../utils/dateFormats"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DetailsCard } from "../../components/Card/DetailsCard"
import * as icons from "../../labels/iconLabels"
import TerminusClient from '@terminusdb/terminusdb-client';
import {LatestUpdates} from "./LatestUpdates"

const Details = (props) => {
	const { isAuthenticated, user } = useAuth0();
	const [commitInfo, setCommitInfo] = useState([])
	const [dbInfo, setDbInfo] = useState([])
	const [userInfo, setUserInfo] = useState([])
	const [originInfo, setOriginInfo] = useState([])

	const [branch, countBranch] = useState(1)
	const always = true;

    const { woqlClient } = WOQLClientObj();
	const db_uri = woqlClient.server() + '/db/' + woqlClient.account() + '/' + getCurrentDBID(woqlClient)

	function prepareCommitInfo(r) {
		var info = [];
		info.push('Last Modified by - ' + 'Someone?')
		info.push(<br/>)
		info.push('Last Commit Message - ' + 'blah')
		return info
	}

    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(woqlClient)
        woqlClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q);
			if(wr.count() > 1)
				countBranch(wr.count() + ' Branches')
		    else countBranch(wr.count() + ' Branch')
			var inf = prepareCommitInfo(wr)
            setCommitInfo(inf)
			setOriginInfo('Your ahead of origin by 2 commits.')
        })
    }, [always]);

    return (
        <div>
		    <hr className="my-space-50"/>
			<hr className="my-space-50"/>
			<hr className="my-space-50"/>

			<Row>
				<Col md={3} className="mb-3 dd-c">
					{dbInfo && <DetailsCard 
						title = {getCurrentDBID(woqlClient)}
						main = {getCurrentDBName(woqlClient)}
						subTitle = {db_uri}
						info = {getCurrentDbDescr(woqlClient)}/>}
				</Col>

				<Col md={3} className="mb-3 dd-c">
	               {commitInfo && branch && <DetailsCard icon={icons.COMMIT}
	                    title = "Commits"
	                    main = "234"
						subTitle = {branch}
	                    info = {commitInfo}/>}
	            </Col>

				<Col md={3} className="mb-3 dd-c">
					{userInfo && <DetailsCard icon={icons.USERS}
						title = "Users"
						main = "5"
						subTitle = "Storage space 3 GB"
						info={userInfo}/>}
				</Col>

				<Col md={3} className="mb-3 dd-c">
					{originInfo && <DetailsCard icon={icons.ORIGIN}
						title = "Origin"
						main="Local"
						subTitle="something goes here"
						info={originInfo}/>}
				</Col>
			</Row>

			<LatestUpdates />

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
