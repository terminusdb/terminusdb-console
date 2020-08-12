import React, { useEffect, useState } from 'react'
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import { DBContextObj} from "../Query/DBContext"

export const HistoryNavigatorTimeline = ({woqlClient}) => {

	const { consoleTime, setHead, branch, ref, DBInfo, branches} = DBContextObj();

	const setCurrentItem=(item)=>{
        setHead(branch,item.commit)
	}
    if(!branches || !DBInfo) return null
    
    let firstCommit = DBInfo.created || null

    if(!branches) return null
    return <div className="history__nav">
        <TimelineCommits 
            branch={branch}
            woqlClient={woqlClient} 
            setHead={setCurrentItem}
            headMessage="Set Console Head to this Commit"
            currentCommit={ref}
            firstCommit={firstCommit}
            currentStartTime={consoleTime}    
        />
    </div>

}