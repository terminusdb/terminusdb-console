import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLClientObj } from "./woql-client-instance";
import { addHours, startOfHour } from "date-fns";

export const HistoryNavigatorContext = React.createContext();
export const HistoryNavigatorObj = () => useContext(HistoryNavigatorContext);

export const HistoryNavigatorProvider = ({children,props={}}) => {
    const {woqlClient} = WOQLClientObj();
    const dbClientCopy=(props.local ? woqlClient.copy() : woqlClient)

    // no history for terminus (master) db
    let nowts = props.now || parseFloat(startOfHour(addHours(new Date(), 1)).getTime()/1000)
    const [branches, setBranches] = useState([])//props.branches);
    const [refId, setRef] = useState(null);//props.ref
    const [settingCommit, setSettingCommit] = useState(false);
    const [end, setEnd] = useState(nowts);
    const [current, setCurrent] = useState(nowts);
    const [currentCommit, setCommit] = useState();
    const [branch, setBranch] = useState(props.branch || dbClientCopy.checkout());
    const [branchInfo, setBranchInfo] = useState();


    //retrieves details of the available branches
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(dbClientCopy)
        dbClientCopy.query(q).then((results) => {
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
        const q = TerminusClient.WOQL.lib().loadBranchLimits(dbClientCopy)
        dbClientCopy.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let res = wr.first()
            setBranchInfo({
                id: dbClientCopy.checkout(),
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
            const q2 = TerminusClient.WOQL.lib().loadCommitDetails(dbClientCopy, refId)
            dbClientCopy.query(q2).then((cresults) => {
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
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(dbClientCopy, fts)
            dbClientCopy.query(q3).then((lresults) => {
                let lwr = new TerminusClient.WOQLResult(lresults, q3)
                let lres = lwr.first()
                if(lres){
                    let commie = extractCommitData(lres)
                    if(commie.child){
                        /*
                        *I add the commit at the main instance of terminus client
                        */
                        woqlClient.ref(commie.id)
                    }
                    else woqlClient.ref(false)

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
        setBranch(bid)
        dbClientCopy.ref(false)
        dbClientCopy.checkout(bid)
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
