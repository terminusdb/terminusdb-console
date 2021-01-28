import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TERMINUS_ERROR} from '../../constants/identifiers'

export const BranchInfo = (selectedBranch) => {
    if (!selectedBranch) return []
    const {woqlClient}=WOQLClientObj()
    const WOQL=TerminusClient.WOQL
    const [branches, setBranches]=useState()
    const [branch, setBranch]=useState(selectedBranch)
    const [prefixes, setPrefixes]=useState()
    const [ref, setRef]=useState(false)
    const [graphs, setGraphs]=useState()
    const [consoleTime, setConsoleTime] = useState(false)

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

    useEffect(() => {
        WOQL.lib().branches().execute(woqlClient).then((res) => {
            let binds = res && res.bindings ? branchStructureFromBindings(res.bindings) : []
            setBranches(binds)
        })
        .then(() => {
            WOQL.lib().prefixes().execute(woqlClient).then((res) => {
                let binds = res && res.bindings ? res.bindings : []
                setPrefixes(binds)
            })
        })
        .then(() => {
            let constraint = WOQL.query()
            WOQL.lib().graphs(constraint).execute(woqlClient).then((res) => {
                let binds = res && res.bindings ? graphStructureFromBindings(res.bindings) : []
                setGraphs(binds)
            })
        })
        .catch((e) => {
            console.log(e)
            //setReport({error: e, status: TERMINUS_ERROR})
        })

        //.finally(() => setLoading(loading - 1))
    }, [selectedBranch])

    return [branch, branches, ref, consoleTime, prefixes, graphs]


}
