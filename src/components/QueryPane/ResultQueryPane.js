import React, { useState, useEffect } from "react";
import { ResultViewer } from "./ResultViewer"
import { TOOLBAR_CSS } from './constants.querypane'
import { ViewChooser } from "./ViewChooser";
import { ControlledTable } from "../../views/Tables/ControlledTable"
import TerminusClient from "@terminusdb/terminusdb-client"
import { TerminusDBSpeaks } from "../Reports/TerminusDBSpeaks";

export const ResultQueryPane = ({resultView,query,bindings,updateQuery,prefixes, setMainError}) => {

	const currentViewStart=resultView || "table";
    const [currentView,setCurrentView] = useState(currentViewStart)
    const [latest, setLatest] = useState(bindings)
    const [error, setError] = useState()
	const qeclass = TOOLBAR_CSS.container

    const updateView = (viewType)=>{
    	setCurrentView(viewType)
    }

    const setResult = (res)=>{
    	setLatest(res.bindings)
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.pager("remote")
    tabConfig.pagesize(20)

	return(
		<div className="tdb__qpane__editor" >
            <ViewChooser updateView={updateView} view={currentView}/>
            {error && 
                <TerminusDBSpeaks report={error} />
            }
            {currentView == "table" && 
                <ControlledTable
                    query={query}
                    freewidth={true}
                    view={tabConfig}
                    onResults={setResult}
                    onError={setMainError}
                    limit={tabConfig.pagesize()}
                />
            }
            {currentView != "table" && 
                <ResultViewer type={currentView} bindings={latest} query={query} prefixes={prefixes}/>
            }
        </div>
	)
}

// <ViewEditor display="hidden" query={query} bindings={bindings} updateQuery={updateQuery} />
