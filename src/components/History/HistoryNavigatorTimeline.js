import React from 'react'
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import { DBContextObj} from "../Query/DBContext"

export const HistoryNavigatorTimeline = ({woqlClient}) => {

	const { setConsoleTime, consoleTime, setHead, branch, ref, DBInfo, branches} = DBContextObj();


	return <div className="history__nav"><TimelineCommits branch={branch} woqlClient={woqlClient} setHead={setHead}/></div>

}