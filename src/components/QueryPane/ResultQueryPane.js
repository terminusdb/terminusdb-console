import React, { useState, useEffect } from "react";
import { ResultViewer } from "./ResultViewer"
import { TOOLBAR_CSS } from './constants.querypane'
import { ViewChooser } from "./ViewChooser";

export const ResultQueryPane = ({resultView,query,bindings,updateQuery,prefixes}) => {

	const currentViewStart=resultView || "table";
    const [currentView,setCurrentView] = useState(currentViewStart)
	const qeclass = TOOLBAR_CSS.container

    const updateView = (viewType)=>{
    	setCurrentView(viewType)
    }

	return(
		<div className="tdb__qpane__editor" >
            <ViewChooser updateView={updateView} view={currentView}/>
            <ResultViewer type={currentView} bindings={bindings} query={query} prefixes={prefixes}/>
        </div>
	)
}

// <ViewEditor display="hidden" query={query} bindings={bindings} updateQuery={updateQuery} />
