import React, { useState, useEffect } from "react";
import { ResultViewer } from "./ResultViewer"
import { TOOLBAR_CSS } from './constants.querypane'
import { ViewChooser } from "./ViewChooser";
import { ControlledTable } from "../../views/Tables/ControlledTable"
import TerminusClient from "@terminusdb/terminusdb-client"
import { TerminusDBSpeaks } from "../Reports/TerminusDBSpeaks"
import {WOQLClientObj} from '../../init/woql-client-instance'
import Loading from '../../components/Reports/Loading'
import {DBContextObj} from '..//Query/DBContext'
import {WOQLEditorControlled, WOQLTable, ControlledQueryHook} from '@terminusdb/terminusdb-react-components'
import { TERMINUS_TABLE } from "../../constants/identifiers";


export const ResultQueryPane = ({resultView, result, query, 
    limit, start, orderBy, setLimits, setOrder, totalRows, setError, loading}) => {
    const currentViewStart=resultView || "table";
    const [currentView,setCurrentView] = useState(currentViewStart)

    const { woqlClient} = WOQLClientObj()

    const qeclass = TOOLBAR_CSS.container
    
    const {updateBranches, prefixes} = DBContextObj()

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

    function setReport(result){}

    useEffect(() => {
        if(result){
            if(query.containsUpdate() && result.inserts > 0 || result.deletes > 0){
                updateBranches()
            }
            setReport(result)
        }
    }, [result])

    const updateView = (viewType)=>{
    	setCurrentView(viewType)
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.pagesize(20)
    let tr, lim
    if(query && query.containsUpdate()){
        tabConfig.pager("local")
        tr = result.bindings ? result.bindings.length : 0
        lim = result.bindings ? result.bindings.length : 0
    }
    else {
        tabConfig.pager("remote")
        tr = totalRows
        lim = limit
    }
    if(prefixes) tabConfig.prefixes = _generate_context(prefixes)

	return(
		<div className="tdb__qpane__editor tdb__loading__parent">
            <ViewChooser updateView={updateView} view={currentView}/>
            {currentView == "table" && 
                <WOQLTable
                    result={result}
                    freewidth={true}
                    view={tabConfig.json()}
                    limit={lim}
                    query={query}
                    start={start}
                    orderBy={orderBy}
                    setLimits={setLimits}
                    setOrder={setOrder}
                    totalRows={tr}
                />            
            }
            {loading && <Loading type={TERMINUS_TABLE}/>}
            {currentView != "table" && 
                <ResultViewer type={currentView} bindings={result.bindings} query={query} prefixes={prefixes} />
            }
        </div>
	)
}
