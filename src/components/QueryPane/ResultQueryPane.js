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


export const ResultQueryPane = ({resultView,query,bindings,updateQuery,prefixes, setMainError, setReport, setUpdated, updated}) => {
    const { woqlClient} = WOQLClientObj()

	const currentViewStart=resultView || "table";
    const [currentView,setCurrentView] = useState(currentViewStart)
    const [latest, setLatest] = useState(bindings)
    const [loading, setLoading] = useState(false)
    const [hasUpdate, setUpdate] = useState(query ? query.containsUpdate() : false)
    const qeclass = TOOLBAR_CSS.container
    
    const {updateBranches} = DBContextObj()


    useEffect(() => {
        if(query && (currentView != "table" || (hasUpdate && !updated))){
            let stime = Date.now()
            setLoading(true)
            woqlClient.query(query).then((r) => {
                let rep = {
                    type: 'success',
                    duration: Date.now() - stime,
                    deletes: r.deletes,
                    inserts: r.inserts,
                    transaction_restart_count: r.transaction_restart_count || 0,
                    rows: r.bindings ? r.bindings.length : 0
                }
                updateBranches()
                setUpdated(true)
                setMainError(false)
                setReport(rep)
                setResult(r)
            })
            .catch((e) => setMainError(e))
            .finally(() => setLoading(false))
        }
    }, [currentView, query])

    useEffect(() => {
        setUpdate(query ? query.containsUpdate() : false)
        setUpdated(false)
    }, [query])


    const setEmpty = (report)=>{
        setMainError(false)
        setReport(report)
    }



    const updateView = (viewType)=>{
    	setCurrentView(viewType)
    }

    const setResult = (res)=>{
        setMainError(false)
        let b = res
        b.rows = (res && res.bindings ? res.bindings.length : 0)
        setReport(b)
    	setLatest(res.bindings)
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.pager("remote")
    tabConfig.pagesize(20)

	return(
		<div className="tdb__qpane__editor" >
            <ViewChooser updateView={updateView} view={currentView}/>
            {currentView == "table" && !hasUpdate &&  
                <ControlledTable
                    query={query}
                    onEmpty={setEmpty}
                    freewidth={true}
                    view={tabConfig}
                    onResults={setResult}
                    onError={setMainError}
                    limit={tabConfig.pagesize()}
                />
            }
            {loading && <Loading />}
            {currentView != "table" || (currentView == "table" && hasUpdate) && 
                <ResultViewer type={currentView} bindings={latest} query={query} prefixes={prefixes}/>
            }
        </div>
	)
}
