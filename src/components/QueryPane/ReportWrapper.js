import React from "react"
import { Alert } from "react-bootstrap" //replace
import { ResultReport } from "../Reports/ResultReport"
import { QUERY_PANE_INTRO } from "./constants.querypane"

export const ReportWrapper = ({currentReport,type,children}) => {
    const curMessage=children || QUERY_PANE_INTRO;
    const curType=type || "info";

    if(currentReport && currentReport.busy){
        return (
            <Alert color='warning'>Busy</Alert>
        )
    }    
    else if(currentReport){
        return (<ResultReport report={currentReport} />)
    }
    return (<Alert color={curType} style={{display:'block'}}>{curMessage}</Alert>)
}