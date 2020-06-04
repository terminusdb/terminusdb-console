import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from "reactstrap";
import { getCurrentDBID, getCurrentDBName, getCurrentDbDescr } from "../../utils/helperFunctions"
import { DetailsCard } from "./DetailsCard"
import * as icons from "../../constants/faicons"
import TerminusClient from '@terminusdb/terminusdb-client';
import { LatestUpdates } from "../Tables/LatestUpdates"
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"

import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import { printts, DATETIME_FULL, DATETIME_COMPLETE } from "../../constants/dates";



export const MonitorDB = (props) => {
    const { isAuthenticated, user } = useAuth0();
    const {woqlClient} = WOQLClientObj()
    const {graphs, branch, branches,  DBInfo,  ref, consoleTime} = DBContextObj();
    
    let ts = consoleTime || (Date.now() / 1000)

    let q = TerminusClient.WOQL.lib().getCommitBefore("v:BranchName", String(ts), woqlClient.resource("commits"))
    const [updateQuery, report, bindings, woql, loading] = WOQLQueryContainerHook(woqlClient, q, branch, ref)
    
	let q2 = TerminusClient.WOQL.using(woqlClient.resource("commits"), TerminusClient.WOQL.triple("v:X", "ref:commit_timestamp", "v:Time"))
    

    const [uq, report2, binds2, woql2] = WOQLQueryContainerHook(woqlClient, q2, branch, ref)


    let latestUpdates = TerminusClient.WOQL.limit(50).select("v:Time", "v:Author", "v:Message").order_by("v:Time", TerminusClient.WOQL.lib().loadCommitDetails(woqlClient, "v:ANYCOMMIT"))

    const [uq3, report3, latests, woql3] = WOQLQueryContainerHook(woqlClient, latestUpdates, branch, ref)


	const db_uri = woqlClient.server() + woqlClient.account() + '/' + woqlClient.db()

    function getCommitInfo(){
        let str = ""
        if(bindings){
            let r = bindings[0]
            let ubranch = r["BranchName"]["@value"]
            str += "Last Update (" + ubranch + "): " + printts(r["Time"]["@value"]) + " "
        }
        return str         
    }

    return (
        <div>
		    <hr className="my-space-50"/>
			<hr className="my-space-50"/>
			<hr className="my-space-50"/>

			<Row>
				<Col md={3} className="mb-3 dd-c">
					<DetailsCard 
						title = {woqlClient.db()}
						main = {getCurrentDBName(woqlClient)}
						subTitle = {"Created " + (DBInfo ? printts(DBInfo.created, DATETIME_COMPLETE) : "...")}
						info = {getCurrentDbDescr(woqlClient)}/>
				</Col>

				<Col md={3} className="mb-3 dd-c">
	               <DetailsCard icon={icons.COMMIT}
	                    title = "Commits"
	                    main = {binds2 ? binds2.length : ""}
	                    subTitle = {(branches ? Object.keys(branches).length + (Object.keys(branches).length > 1 ? " Branches" : " Branch") : "...")}
	                    info = {getCommitInfo()}/>
	            </Col>

				<Col md={3} className="mb-3 dd-c">
					<DetailsCard icon={icons.USERS}
						title = "User"
                        main = " 1 "
						subTitle = "Desktop Client"
						info="Desktop users can add collaborators to their databases through TerminusDB hub"/>
				</Col>

				<Col md={3} className="mb-3 dd-c">
					<DetailsCard icon={icons.ORIGIN}
						title = "Origin"
						main="Local"
                        info= {db_uri}
                        subTitle={(graphs? Object.keys(graphs).length : 0) + " Graphs"} />
				</Col>
			</Row>
            {latests && 
                <LatestUpdates latests={latests} query={woql3} updateQuery={uq3} />
            }

       </div>
    )
}


//<LatestUpdates />