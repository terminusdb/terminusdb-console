/*import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { addHours, startOfHour } from "date-fns";

export const HistoryNavigatorContext = React.createContext();
export const HistoryNavigatorObj = () => useContext(HistoryNavigatorContext);

export const HistoryNavigatorProvider = ({children,woqlClient}) => {

    let nowts = parseFloat(startOfHour(addHours(new Date(), 1)).getTime()/1000)
    


    const [branches, setBranches] = useState([])//props.branches);
    const [refId, setRef] = useState(woqlClient.ref());//props.ref
    const [settingCommit, setSettingCommit] = useState(false);
    const [end, setEnd] = useState(nowts);
    const [current, setCurrent] = useState(nowts);
    const [currentCommit, setCommit] = useState();
    const [branch, setBranch] = useState(woqlClient.checkout());
    const [branchInfo, setBranchInfo] = useState();


    //retrieves details of the available branches
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(woqlClient)
        woqlClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let bchoices = []
            var res
            while(res = wr.next()){
               bchoices.push({value: res['BranchName']["@value"], label: res['BranchName']["@value"]})
            }
            setBranches(bchoices)
        })
    }, []);

    //retrieves details of the branch, only when the branch is changed
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchLimits(woqlClient)
        woqlClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let res = wr.first()
            setBranchInfo({
                id: woqlClient.checkout(),
                last: res['Last']['@value'],
                first: res['First']['@value'] || res['Last']['@value'],
                head: res['HeadID']["@value"],
                count: ((res['Path'] && Array.isArray(res['Path'])) ? res['Path'].length : 1),
            })
            setRef(res['HeadID']["@value"])
            //if(props.setCreated) props.setCreated(res['First']['@value'] || res['Last']['@value'])
        })
    }, [branch]);

    //retrieves details of the commit with id ref
    useEffect(() => {
        if(refId){
            const q2 = TerminusClient.WOQL.lib().loadCommitDetails(woqlClient, refId)
            woqlClient.query(q2).then((cresults) => {
                let cwr = new TerminusClient.WOQLResult(cresults, q2)
                let cres = cwr.first()
                let commie = undefined;
                if(cres){
                   commie=extractCommitData(cres)
                   commie.id = refId
                   if(settingCommit){
                      setCurrent(commie.time)
                      setSettingCommit(false)
                    }
                }
                //if(props.setCommitInfo) props.setCommitInfo(commie)
                setCommit(commie)
            })
        }
    }, [refId]);

    //retrieves details of the previous commit, only when user changes time
    const userChangesTime = (ts)=>{
        if(ts && (Math.floor(current) != Math.floor(ts))){
            setCurrent(ts)
            const fts = String(ts)
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(woqlClient, fts)
            woqlClient.query(q3).then((lresults) => {
                let lwr = new TerminusClient.WOQLResult(lresults, q3)
                let lres = lwr.first()
                if(lres){
                    let commie = extractCommitData(lres)
                    if(commie.child){
                       
                        woqlClient.ref(commie.id)
                        setRef(commie.id)
                    }
                    else {
                        woqlClient.ref(false)
                        setRef(false)
                    }

                    if(!currentCommit || commie.id != currentCommit.id){
                         setCommit(commie)
                         //if(props.onHeadChange) props.onHeadChange(branch, commie.id)
                         //if(props.setCommitInfo) props.setCommitInfo(commie)
                    }
                }
            })
        }
    }

    //change the commit and change the time on the timeline to the commit time
    const userChangesCommit = (cid)=>{
        setSettingCommit(true);
        setRef(cid)
        //if(props.onHeadChange) props.onHeadChange(branch, cid)
    }
    
    const extractCommitData = (res)=>{
        let commie = {}
        if(res){
            if(res['CommitID'] && res['CommitID']['@value']) commie.id = res['CommitID']["@value"]
            if(res['Time'] && res['Time']["@value"]) commie.time = parseFloat(res['Time']["@value"])
            if(res['Author'] && res['Author']["@value"]) commie.author = res['Author']["@value"]
            if(res['Message'] && res['Message']["@value"]) commie.message = res['Message']["@value"]
            if(res['Parent'] && res['Parent']["@value"])commie.parent = res['Parent']["@value"]
            if(res['Child'] && res['Child']["@value"])commie.child = res['Child']["@value"]
        }
        return commie
    }

    const changeBranch = (bid)=>{       
        woqlClient.ref(false)
        woqlClient.checkout(bid)
        setBranch(bid)
        //if(props.onHeadChange) props.onHeadChange(bid, false)
    }

    
    const newBranchAdd = ()=>{

    }


    return (
    <HistoryNavigatorContext.Provider
        value={{
            changeBranch,
            userChangesCommit,
            userChangesTime,
            branches,
            end,
            current,
            currentCommit,
            refId,
            settingCommit,
            branchInfo
        }}
    >
        {children}
    </HistoryNavigatorContext.Provider>
    )
}

*/
