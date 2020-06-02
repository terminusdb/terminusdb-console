import React, { useState, useEffect, useContext } from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { TERMINUS_ERROR } from "../../constants/identifiers";


export const DBContext = React.createContext();
export const DBContextObj = () => useContext(DBContext);
export const DBContextProvider = ({children,woqlClient}) => {
    const [branches, setBranches] = useState()
    const [graphs, setGraphs] = useState()
    const [DBInfo, setDBInfo] = useState()
    const [branch, setBranch] = useState(woqlClient.checkout())
    const [ref, setRef] = useState(woqlClient.ref())
    const [consoleTime, setConsoleTime] = useState()
    const [report, setReport] = useState()
    const [loading, setLoading] = useState(0)

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
    }, [])

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
        if(consoleTime && branches){
            setLoading(loading+1)
            if(consoleTime < branches[branch].updated){
                TerminusClient.WOQL.lib().getCommitAtTime(woqlClient, String(consoleTime)).execute(woqlClient)
                .then((res) => {
                    if(res.bindings && res.bindings[0] && res.bindings[0]["CommitID"]){
                        let cid = res.bindings[0]["CommitID"]
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
        }
    }, [consoleTime, branches, branch])

    function setHead(bid, rid){
        alert("bid " + bid + " rid " + rid)
        woqlClient.checkout(bid)
        woqlClient.ref(rid)
        setBranch(bid)
        setRef(rid)
    }


    function graphStructureFromBindings(bindings){
        let gs = {};
        for(var i = 0; i<bindings.length; i++){
            let fid = `${bindings[i]["GraphType"]["@value"]}/${bindings[i]["GraphID"]["@value"]}`
            gs[fid] ={
                gid: bindings[i]["GraphID"]["@value"], 
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
