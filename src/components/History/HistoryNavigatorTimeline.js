import React, { useEffect, useState } from 'react'
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import { DBContextObj} from "../Query/DBContext"

export const HistoryNavigatorTimeline = ({woqlClient}) => {

	const { setConsoleTime, consoleTime, setHead, branch, ref, DBInfo, branches} = DBContextObj();

	const setCurrentItem=(item)=>{
        console.log(item)
		alert(branch)
        setHead(branch,item.commit)
	}
    if(!branches || !DBInfo) return null
    
    console.log(DBInfo)
    const [currentHead, setCurrentHead] = useState(null);

    useEffect(() => {
        if((ref || branch) && branches){
            if(ref){
                setCurrentHead(ref)
            }
        }
    }, [ref, branch, branches])

    if(!branches) return null
    return <div className="history__nav">
        <TimelineCommits 
            branch={branch}
            woqlClient={woqlClient} 
            setHead={setCurrentItem}
            headMessage="Set Console Head to this Commit"
            currentCommit={currentHead}
            currentStartTime={consoleTime}    
        />
    </div>

}