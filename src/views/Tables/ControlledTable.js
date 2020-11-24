import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {TERMINUS_COMPONENT, TERMINUS_TABLE} from "../../constants/identifiers"

export const ControlledTable = ({query, order, limit, freewidth, view, hook, onError, onEmpty, onResults, onRowCount, loadingType}) => {
    const [mlimit, setLimit] = useState(limit || 0)
    const [start, setStart] = useState(0)
    const [rowCount, setRowCount] = useState()
    const [orderBy, setOrderBy] = useState(order||false)
    const [first, setFirst] = useState(true)
    const [tabresult, setTabResult] = useState()

    let loadingCss= (loadingType==TERMINUS_TABLE) ? TERMINUS_TABLE : TERMINUS_COMPONENT

    const { woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()
    let WOQL = TerminusClient.WOQL
    const docQuery = () => {
        let wrapper = WOQL.query()
        if(mlimit) wrapper.limit(mlimit)
        if(start) wrapper.start(start)
        if(orderBy) wrapper.order_by(...orderBy)
        return wrapper.and(query)
    }

    const countQuery = () => {
        return WOQL.count("v:Count", query)
    }

    let triggers = (hook && hook == "auto" ? [] : [branch, ref])

    const [updateQuery, report, qresult, woql, loading] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        ...triggers
    )

    const [updateCountQuery, creport, cresult, cwoql] = WOQLQueryContainerHook(
        woqlClient,
        countQuery(),
        ...triggers
    )

    useEffect( () => {
        if(report && report.error){
            if(onError) onError(report.error)
        }
        else if(report){
            setFirst(false)
        }
    }, [report])

    useEffect( () => {
        if(!first){
            let nq = docQuery()
            updateQuery(nq)
        }
    }, [mlimit, start, orderBy])

    useEffect( () => {
        if(!first){
            if(start > 0){
                setStart(0)
            }
            else {
                let nq = docQuery()
                updateQuery(nq)
            }
        }
    }, [query])


    useEffect( () => {
        if(creport){
            let nq = countQuery()
            updateCountQuery(nq)
        }
    }, [query])

    useEffect(() => {
        if(cresult){
            let val = ((cresult && cresult.bindings && cresult.bindings.length) ? cresult.bindings[0]['Count']['@value'] : 0)
            setRowCount(val)
            if(onRowCount) onRowCount(val)
        }
    }, [cresult])

    useEffect(() => {
        if(qresult && prefixes){
            let tres = qresult
            tres.prefixes = _generate_context(prefixes)
            if(onResults && qresult.bindings && qresult.bindings.length){
                onResults(qresult)
            }
            setTabResult(tres)
        }
    }, [qresult, prefixes])

    const changeOrder = (ord) => {
        if(JSON.stringify(orderBy) != JSON.stringify(ord)){
            setOrderBy(ord)
            setStart(0)
        }
    }

    const changeLimits = (l, s) => {
        let ll = parseInt(l) || 0
        let ss = parseInt(s) || 0
        if(ll != mlimit) {
            view.pagesize(ll)
            setLimit(ll)
        }
        if(ss != start) setStart(ss)
    }

    let isEmpty = (report && report.rows == 0 && !start)
    if(isEmpty && onEmpty) onEmpty()

    const _generate_context = (prefixes) => {
        let nups = {}
        for(var k in TerminusClient.UTILS.standard_urls){
            nups[k] = TerminusClient.UTILS.standard_urls[k]
        }
        for(var i = 0; i<prefixes.length; i++){
            if(prefixes[i]['Prefix'] && prefixes[i]['Prefix']['@value'] && prefixes[i]['IRI'] && prefixes[i]['IRI']["@value"]){
                nups[prefixes[i]['Prefix']['@value']] = prefixes[i]['IRI']["@value"]
            }
        }
        return nups
    }

    return (
        <div className="tdb__loading__parent">
            {(report && !isEmpty && tabresult) &&
                <WOQLTable
                    result={tabresult}
                    freewidth={freewidth}
                    view={(view ? view.json() : {})}
                    limit={mlimit}
                    query={query}
                    start={start}
                    orderBy={orderBy}
                    setLimits={changeLimits}
                    setOrder={changeOrder}
                    totalRows={rowCount}
                />
            }
            {loading &&
                <Loading type={loadingCss}/>
            }
        </div>
    )
}
