import React, {useState, useEffect} from 'react'
import {TCForm} from '../../components/Form/FormComponents'
import {CREATE_BRANCH_FORM, BRANCH_SOURCE_FORM} from './constants.dbmanage'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {printts} from '../../constants/dates'
import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
import {BranchSelector} from '../../components/History/BranchSelector' 


export const CommitSelector = ({branch, setHead, onSelect, commit, woqlClient, firstCommit, time, actionMessage}) => {
    function setCurrentItem(item){
        onSelect(item.commit)
    }

    function changeBranch(mybranch){
        setMyBranch(mybranch)
    }

    let [myBranch, setMyBranch] = useState(branch)

    return (<span>
            <BranchSelector onChange={changeBranch} currentBranch={myBranch}/>             
            <TimelineCommits 
            branch={myBranch}
            woqlClient={woqlClient}
            onChange={setCurrentItem} 
            headMessage={actionMessage}
            setHead={setHead}
            currentCommit={commit}
            firstCommit={firstCommit}
            currentStartTime={time}    
        />
        </span>
    )
}
