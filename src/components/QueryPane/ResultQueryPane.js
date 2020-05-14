import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { ResultViewer } from "./ResultViewer"
import { ViewEditor } from "./ViewEditor"
import { ViewChooser } from "./ViewChooser";

export const ResultQueryPane = ({resultView,query,bindings,updateQuery}) => {

	const currentViewStart=resultView || "table";
    const [currentView,setCurrentView] = useState(currentViewStart)

    const updateView = (viewType)=>{
    	setCurrentView(viewType)
    }
   

	return(
		<Container >
            <ViewChooser updateView={updateView} view={currentView}/>    
            <ResultViewer type={currentView} bindings={bindings} query={query}/>
        </Container>
	)
}

// <ViewEditor display="hidden" query={query} bindings={bindings} updateQuery={updateQuery} />
           