import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { TERMINUS_ERROR } from "../../constants/identifiers";


export const DBContext = React.createContext();
export const DBContextObj = () => useContext(DBContext);

export const DBContextProvider = ({children,woqlClient}) => {
    if(woqlClient.db() == "terminus"){ 
        return (
            <DBContext.Provider
                value={TerminusDBProvider(woqlClient)}
            >
                {children}
            </DBContext.Provider>
        )
    }
    const [branches, setBranches] = useState()
    const [graphs, setGraphs] = useState()
    const [DBInfo, setDBInfo] = useState()
    const [branch, setBranch] = useState(woqlClient.checkout())
    const [ref, setRef] = useState(woqlClient.ref())
    const [consoleTime, setConsoleTime] = useState()
    const [report, setReport] = useState()
    const [loading, setLoading] = useState(0)
    const [headUpdating, setHeadUpdating] = useState(false)

    const [branchesReload, setBranchesReload] = useState(0)

    //load branch structure
    useEffect(() => {
        setLoading(loading+1)
        TerminusClient.WOQL.lib().loadBranchDetails(woqlClient).execute(woqlClient)
        .then((res) => {
            let binds = (res && res.bindings ? branchStructureFromBindings(res.bindings) : [])
            setBranches(binds)
        })
        .catch((e) => {
            setReport({error:e, status: TERMINUS_ERROR});
        })
        .finally(() => setLoading(loading-1))
    }, [branchesReload])

    //load db info
    useEffect(() => {
        setLoading(loading+1)
        TerminusClient.WOQL.lib().loadFirstCommit(woqlClient).execute(woqlClient)
        .then((res) => {
            let binds = (res && res.bindings ? dbStructureFromBindings(res.bindings) : [])
            setDBInfo(binds)
        })
        .catch((e) => {
            setReport({error:e, status: TERMINUS_ERROR});
        })
        .finally(() => setLoading(loading-1))
    }, [])
    

    //load graph structure
    useEffect(() => {
        setLoading(loading+1)
        TerminusClient.WOQL.lib().loadGraphStructure(woqlClient).execute(woqlClient)
        .then((res) => {
            let binds = (res && res.bindings ? graphStructureFromBindings(res.bindings) : [])
            setGraphs(binds)
        })
        .catch((e) => {
            setReport({error:e, status: TERMINUS_ERROR});
        })
        .finally(() => setLoading(loading-1))
    }, [branch, ref])

    //load head ref when consoleTime is set
    useEffect(() => {
        if(headUpdating && ref){
            TerminusClient.WOQL.lib().loadCommitDetails(woqlClient, ref).execute(woqlClient)
            .then((res) => {
                if(res.bindings && res.bindings[0] && res.bindings[0]["Time"]){
                    let ts = res.bindings[0]["Time"]["@value"]
                    setConsoleTime(ts)
                }
            })
            setHeadUpdating(false)
        }
        else if(consoleTime && branches ){
            setLoading(loading+1)
            if(consoleTime < branches[branch].updated){
                TerminusClient.WOQL.lib().loadCommitAtTime(woqlClient, String(consoleTime)).execute(woqlClient)
                .then((res) => {
                    if(res.bindings && res.bindings[0] && res.bindings[0]["CommitID"]){
                        let cid = res.bindings[0]["CommitID"]["@value"]
                        if(cid != branches[branch].head){
                            woqlClient.ref(cid)
                            setRef(cid)
                        }
                    }
                })
                .catch((e) => {
                    setReport({error:e, status: TERMINUS_ERROR});
                })
                .finally(() => setLoading(loading-1))
    
            }
            else {
                if(ref) setRef(false)
                if(consoleTime >= (Date.now()/1000)){
                    setConsoleTime()
                }
            }
        }
    }, [consoleTime, ref, branches, branch])

    function setHead(bid, rid){
        woqlClient.checkout(bid)
        woqlClient.ref(rid)
        setBranch(bid)
        setRef(rid)
        if(rid){
            setHeadUpdating(true)
        }
    }

    function updateBranches(){
        setBranchesReload(branchesReload+1)
    }


    function graphStructureFromBindings(bindings){
        let gs = {};
        for(var i = 0; i<bindings.length; i++){
            let fid = `${bindings[i]["GraphType"]["@value"]}/${bindings[i]["GraphID"]["@value"]}`
            gs[fid] ={
                id: bindings[i]["GraphID"]["@value"], 
                type: bindings[i]["GraphType"]["@value"], 
                head: bindings[i]["Head"]["@value"], 
                updated: bindings[i]["Time"]["@value"]}
        }
        return gs;
    } 

    function dbStructureFromBindings(bindings){
        let info = {};
        if(bindings && bindings[0] && bindings[0]["Time"]){
            info.created = bindings[0]["Time"]["@value"]
        }
        else {
            info.created = 0
        }
        return info;
    } 


    function branchStructureFromBindings(bindings){
        let brans = {};
        for(var i = 0; i<bindings.length; i++){
            brans[bindings[i]["Branch"]["@value"]] = {
                id: bindings[i]["Branch"]["@value"], 
                head: bindings[i]["Head"]["@value"], 
                updated: bindings[i]["Time"]["@value"]
            }
        }
        return brans;
    } 

    return (
        <DBContext.Provider
            value={{
                setConsoleTime,
                setHead,
                updateBranches,
                consoleTime,
                DBInfo,
                branches,
                graphs,
                report,
                branch,
                ref,
                loading
            }}
        >
            {children}
        </DBContext.Provider>
    )
}

/**
 * Creates a prebaked context for the terminusdb situation
 */
export const TerminusDBProvider = (woqlClient) => {
    let branches = false
    let graphs = {
        "schema/main": {type: "schema", id: "main"},
        "inference/main": {type: "inference", id: "main"},
        "instance/main": {type: "instance", id: "main"}
    }
    let DBInfo = {created: 0}
    function setHead(){}
    function setConsoleTime(){}
    let report = false
    let branch = false
    let ref = false
    let loading = false
    let consoleTime = false
    return {
        setConsoleTime,
        setHead,
        consoleTime,
        DBInfo,
        branches,
        graphs,
        report,
        branch,
        ref,
        loading
    }
}

