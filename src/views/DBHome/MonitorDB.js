import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from "reactstrap";
import { getCurrentDBID, getCurrentDBName, getCurrentDbDescr } from "../../utils/helperFunctions"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DetailsCard } from "./DetailsCard"
import * as icons from "../../constants/faicons"
import TerminusClient from '@terminusdb/terminusdb-client';
import { LatestUpdates } from "../Tables/LatestUpdates"

export const MonitorDB = (props) => {
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
		info.push('Last modified by local administrator on 20 May 2020, latest updates are listed below')
		return info
	}

    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(woqlClient)
        woqlClient.query(q).then((results) => {
			if(results.bindings &&  results.bindings.length > 1)
				countBranch(results.bindings.length + ' Branches')
		    else if(results.bindings) countBranch(results.bindings.length + ' Branch')
			var inf = prepareCommitInfo()
            setCommitInfo(inf)
			setOriginInfo('Your database has processed all transactions correctly and is up to dated')
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
	                    main = "23"
						subTitle = {branch}
	                    info = {commitInfo}/>}
	            </Col>

				<Col md={3} className="mb-3 dd-c">
					{userInfo && <DetailsCard icon={icons.USERS}
						title = "User"
                        main = " 1 "
						subTitle = "Desktop Client"
						info="Desktop users can add collaborators to their databases through TerminusDB hub"/>}
				</Col>

				<Col md={3} className="mb-3 dd-c">
					{originInfo && <DetailsCard icon={icons.ORIGIN}
						title = "Origin"
						main="Local"
						subTitle="Database Local Only"
						info={originInfo}/>}
				</Col>
			</Row>

			<LatestUpdates />

       </div>
    )
}


