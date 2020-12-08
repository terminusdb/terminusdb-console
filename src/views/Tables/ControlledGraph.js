import React, {useState, useEffect, useRef} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {WOQLGraph, ControlledQueryHook} from '@terminusdb/terminusdb-react-components';

import {TERMINUS_TABLE, TERMINUS_ERROR} from "../../constants/identifiers"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {generate_context_from_prefixes} from "./ControlledTable"

export const ControlledGraph = ({query, view}) => {
    const [loaded, setLoaded] = useState(false)
    const [dimensions, setDimensions] = useState(false)
    const { woqlClient} = WOQLClientObj()
    const { branch, ref, prefixes} = DBContextObj()

    const {
        updateQuery,
        changeOrder,
        changeLimits,
        woql,
        result,
        limit,
        start,
        orderBy,
        loading,
        rowCount,
    } = ControlledQueryHook(woqlClient, query, false, 200)

    const mref = useRef(null);
    useEffect(() => {
        setPanelWidth(mref.current ? mref.current.offsetWidth : 0)
    }, [mref.current]);


    useEffect(() => {
        if(loaded){
            let nquery = TerminusClient.WOQL.query().json(woql.json())//create new copy
            updateQuery(nquery)
        }
    }, [branch, ref])

    const setPanelWidth = (w) => {
        if(w){
            setDimensions({width: w, height: 600})
        }
    }

    useEffect(() => {
        if(query && woql){
            if(loaded){
                updateQuery(query)
            }
            else {
                setLoaded(true)
            }
        }
    }, [query])

    function getProvider(result){
        const rt = new TerminusClient.WOQLResult(result,query);
        let viewer = view.create(null);
        viewer.setResult(rt);
        return viewer;    
    }

    function isEmpty(res){
        if(start == 0 && res.rows == 0) return true
        return false
    }

    view.prefixes = generate_context_from_prefixes(prefixes)
    if(result) result.prefixes = view.prefixes
    if(dimensions) {
        view.width(dimensions.width)
        view.height(dimensions.height)
    }
    return (
        <div className="tdb__loading__parent" ref={mref}>
            <ControlledGraphHeader 
                changeLimits={changeLimits}
                woql={query}
                result={result}
                limit={limit}
                start={start}
                loading={loading}
                rowCount={rowCount}
            />
            {loading && 
                <Loading type={TERMINUS_TABLE} />
            }
            {result && result.status != 200 &&  
                <TerminusDBSpeaks report={result} />
            }
            {result && result.status == 200 && isEmpty(result) && 
                <EmptyResult report={result} />
            }
            {result && result.status == 200 && !isEmpty(result) &&
            <div class="controlled-graph-container"> 
                <WOQLGraph 
                    config={view} 
                    dataProvider={getProvider(result)} 
                    query={query} 
                    updateQuery={updateQuery}
                />
            </div>
        }
    </div>
    )
}

export const ControlledGraphHeader = ({changeLimits, woql, result, limit, start, loading, rowCount}) => {
    let all_loaded = (rowCount && ((limit && limit >= rowCount) || !limit))
    let txt
    if(all_loaded){
        txt = "All " + rowCount + " records loaded"
    }
    else {
        txt = limit + " records of " + (rowCount ? rowCount : "?") + " loaded"
    }
    return <div className="controlled-graph-header">
        {txt}
    </div>

}