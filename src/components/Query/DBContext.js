import React, {useState, useEffect, useContext} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {TERMINUS_ERROR} from '../../constants/identifiers'

export const DBContext = React.createContext()
export const DBContextObj = () => useContext(DBContext)

export const DBContextProvider = ({children, woqlClient}) => {
    if (!woqlClient.db()) {
        return (
            <DBContext.Provider value={NullDBProvider(woqlClient)}>
                {children}
            </DBContext.Provider>
        )
    }
    if (woqlClient.db() == '_system') {
        return (
            <DBContext.Provider value={TerminusDBProvider(woqlClient)}>
                {children}
            </DBContext.Provider>
        )
    }
    const [branches, setBranches] = useState()
    const [graphs, setGraphs] = useState()
    const [DBInfo, setDBInfo] = useState()
    const [branch, setBranch] = useState(woqlClient.checkout())
    const [prefixes, setPrefixes] = useState()
    const [repos, setRepos] = useState()
    const [ref, setRef] = useState(woqlClient.ref())
    const [consoleTime, setConsoleTime] = useState()
    const [report, setReport] = useState()
    const [loading, setLoading] = useState(0)
    const [headUpdating, setHeadUpdating] = useState(false)

    const [branchesReload, setBranchesReload] = useState(0)

    const WOQL = TerminusClient.WOQL

    //load branch structure
    useEffect(() => {
        setLoading(loading + 1)
        WOQL.lib()
            .branches()
            .execute(woqlClient)
            .then((res) => {
                let binds = res && res.bindings ? branchStructureFromBindings(res.bindings) : []
                setBranches(binds)
            })
            .catch((e) => {
                setReport({error: e, status: TERMINUS_ERROR})
            })
            .finally(() => setLoading(loading - 1))
    }, [branchesReload])

    //load db info
    useEffect(() => {
        setLoading(loading + 1)
        WOQL.lib()
            .first_commit()
            .execute(woqlClient)
            .then((res) => {
                let binds = res && res.bindings ? dbStructureFromBindings(res.bindings) : []
                setDBInfo(binds)
            })
            .catch((e) => {
                setReport({error: e, status: TERMINUS_ERROR})
            })
            .finally(() => setLoading(loading - 1))
    }, [])

    //load Prefixes
    useEffect(() => {
        setLoading(loading + 1)
        WOQL.lib()
            .prefixes()
            .execute(woqlClient)
            .then((res) => {
                let binds = res && res.bindings ? prefixesFromBindings(res.bindings) : []
                setPrefixes(binds)
            })
            .catch((e) => {
                setReport({error: e, status: TERMINUS_ERROR})
            })
            .finally(() => setLoading(loading - 1))
    }, [branchesReload])

    //load graph structure
    useEffect(() => {
        setLoading(loading + 1)
        let constraint = WOQL.query()
        if (woqlClient.ref()) {
            constraint.eq('v:Commit ID', woqlClient.ref())
        } else {
            constraint.eq('v:Branch ID', woqlClient.checkout())
        }
        WOQL.lib()
            .graphs(constraint)
            .execute(woqlClient)
            .then((res) => {
                let binds = res && res.bindings ? graphStructureFromBindings(res.bindings) : []
                setGraphs(binds)
            })
            .catch((e) => {
                setReport({error: e, status: TERMINUS_ERROR})
            })
            .finally(() => setLoading(loading - 1))
    }, [branch, ref, branches])

    //load Repo
    useEffect(() => {
        setLoading(loading + 1)
        let cresource = woqlClient.resource('meta')
        WOQL.lib()
            .repos(false, false, cresource)
            .execute(woqlClient)
            .then((res) => {
                let binds = res && res.bindings ? ReposFromBindings(res.bindings) : []
                setRepos(binds)
            })
            .catch((e) => {
                setReport({error: e, status: TERMINUS_ERROR})
            })
            .finally(() => setLoading(loading - 1))
    }, [branches])

    //load head ref when consoleTime is set
    useEffect(() => {
        if (headUpdating && ref) {
            WOQL.lib()
                .commits(ref)
                .execute(woqlClient)
                .then((res) => {
                    if (res.bindings && res.bindings[0] && res.bindings[0]['Time']) {
                        let ts = res.bindings[0]['Time']['@value']
                        setConsoleTime(ts)
                    }
                })
            setHeadUpdating(false)
        } else if (consoleTime && branches && branch && branches[branch]) {
            setLoading(loading + 1)
            if (consoleTime < branches[branch].updated) {
                let woql = WOQL.lib().active_commit(branch, consoleTime)
                woql.execute(woqlClient)
                    .then((res) => {
                        if (res.bindings && res.bindings[0] && res.bindings[0]['Commit ID']) {
                            let cid = res.bindings[0]['Commit ID']['@value']
                            if (cid != branches[branch].head) {
                                woqlClient.ref(cid)
                                setRef(cid)
                            } else {
                                woqlClient.ref(false)
                                setRef(false)
                            }
                        }
                    })
                    .catch((e) => {
                        setReport({error: e, status: TERMINUS_ERROR})
                    })
                    .finally(() => setLoading(loading - 1))
            } else {
                if (ref) {
                    woqlClient.ref(false)
                    setRef(false)
                }
                if (consoleTime >= Date.now() / 1000) {
                    setConsoleTime()
                }
            }
        }
    }, [consoleTime, ref, branches, branch])

    function setHead(bid, rid) {
        woqlClient.checkout(bid)
        if(branches && branches[bid] && branches[bid].head == rid){
            rid = false
            setConsoleTime(false)
        }
        woqlClient.ref(rid)
        setBranch(bid)
        setRef(rid)
        if (rid) {
            //don't trigger update for console time change
            setHeadUpdating(true)
        }
    }

    function updateBranches(bid) {
        setBranchesReload(branchesReload + 1)
    }

    function dbStructureFromBindings(bindings) {
        let info = {}
        if (bindings && bindings[0] && bindings[0]['Time']) {
            info.created = bindings[0]['Time']['@value']
        } else {
            info.created = 0
        }
        info.author = bindings[0] && bindings[0]['Author'] ? bindings[0]['Author']['@value'] : ''
        return info
    }

    function isLocalClone(url) {
        if (woqlClient.server() == url.substring(0, woqlClient.server().length)) return true
        return false
    }

    function ReposFromBindings(bindings) {
        let repos = {}
        for (var i = 0; i < bindings.length; i++) {
            let b = bindings[i]
            if (b['Remote URL'] && b['Remote URL']['@value']) {
                if (isLocalClone(b['Remote URL']['@value'])) {
                    repos.local_clone = {
                        url: b['Remote URL']['@value'],
                        title: b['Repository Name']['@value'],
                        type: 'Local Clone',
                    }
                } else {
                    repos.remote = {
                        url: b['Remote URL']['@value'],
                        title: b['Repository Name']['@value'],
                        type: 'Remote',
                    }
                }
            } else {
                repos.local = {
                    type: 'Local',
                    title: b['Repository Name']['@value'],
                }
            }
        }
        return repos
    }

    function branchStructureFromBindings(bindings) {
        let brans = {}
        for (var i = 0; i < bindings.length; i++) {
            brans[bindings[i]['Branch ID']['@value']] = {
                id: bindings[i]['Branch ID']['@value'],
                head: bindings[i]['Commit ID']['@value'],
                updated: bindings[i]['Time']['@value'],
            }
        }
        return brans
    }

    function prefixesFromBindings(bindings) {
        let ctxt = {}
        for (var i = 0; i < bindings.length; i++) {
            let iri =
                bindings[i]['URI'] && bindings[i]['URI']['@value']
                    ? bindings[i]['URI']['@value']
                    : false
            let prefix =
                bindings[i]['Prefix'] && bindings[i]['Prefix']['@value']
                    ? bindings[i]['Prefix']['@value']
                    : false
            ctxt[prefix] = iri
        }
        for (var k in TerminusClient.UTILS.standard_urls) {
            ctxt[k] = TerminusClient.UTILS.standard_urls[k]
        }
        woqlClient.connection.setJSONContext(ctxt)
        let x = woqlClient.connection.getJSONContext()
        return bindings
    }

    function graphStructureFromBindings(bindings) {
        let gs = {}
        for (var i = 0; i < bindings.length; i++) {
            let fid = `${bindings[i]['Graph Type']['@value']}/${bindings[i]['Graph ID']['@value']}`
            gs[fid] = {
                id: bindings[i]['Graph ID']['@value'],
                type: bindings[i]['Graph Type']['@value'],
            }
        }
        return gs
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
                repos,
                prefixes,
                loading,
            }}
        >
            {children}
        </DBContext.Provider>
    )
}

/**
 * Creates a prebaked context for the terminusdb situation
 * where we have no commits or meta graph and a pre-ordained set of graphs that cannot be changed
 */
export const TerminusDBProvider = (woqlClient) => {
    let branches = false
    let graphs = {
        'schema/main': {type: 'schema', id: 'main'},
        'inference/main': {type: 'inference', id: 'main'},
        'instance/main': {type: 'instance', id: 'main'},
    }
    let DBInfo = {created: 0}
    function setHead() {}
    function setConsoleTime() {}
    function updateBranches() {}
    let report = false
    let branch = false
    let ref = false
    let loading = false
    let consoleTime = false
    let prefixes = []
    return {
        setConsoleTime,
        setHead,
        updateBranches,
        consoleTime,
        DBInfo,
        branches,
        prefixes,
        graphs,
        report,
        branch,
        ref,
        loading,
    }
}

export const NullDBProvider = (woqlClient) => {
    let branches = false
    let graphs = false
    let DBInfo = {created: 0}
    function setHead() {}
    function setConsoleTime() {}
    function updateBranches() {}
    let report = false
    let branch = false
    let ref = false
    let loading = false
    let consoleTime = false
    let prefixes = []
    return {
        setConsoleTime,
        setHead,
        updateBranches,
        consoleTime,
        DBInfo,
        branches,
        prefixes,
        graphs,
        report,
        branch,
        ref,
        loading,
    }

}

