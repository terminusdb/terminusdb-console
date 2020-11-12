import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'

export const TypeStats = ({doctype, limit, meta, setTotal}) => {
    let WOQL = TerminusClient.WOQL
    const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()
    const [cnt, setCount] = useState()
    const docQuery = () => {
        const current = doctype || "system:Document"    
        return WOQL.and(
            WOQL.count("v:Documents").distinct("v:docid")
            .triple("v:docid", "type", "v:dtype").sub(current, "v:dtype")
        )
    }
    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    useEffect(() => {
        if(qresult){
            let val = ((qresult && qresult.bindings && qresult.bindings.length) ? qresult.bindings[0]['Documents']['@value'] : 0)
            setCount(val)
            if(setTotal) setTotal(val)              
        }
    }, [qresult])

    useEffect( () => {
        if(qresult){
            updateQuery(docQuery())
        }
    }, [doctype])

    
    return null
    let lab = (meta && meta.label ? meta.label + " document" : "document")
    return <DescribeLimits cnt={cnt} limit={limit} lab={lab}/>
}

export const DocumentStats = ({doctype, limit, total, meta, setTotal}) => {
    return (
        <>
        {doctype && 
            <TypeStats meta={meta} doctype={doctype} limit={limit} setTotal={setTotal}/>
        }
        </>
    )
}


const DescribeLimits = ({limit, cnt, lab}) => {
    lab = lab || " document"
    if(cnt !== 1) lab += "s" 
    if(cnt == 0) return <span>0 {lab}</span>
    if(limit == 0 || limit > cnt){
        return <span>{cnt} {lab}</span>
    }
    return <span>{limit} of {cnt} {lab}</span>
}
