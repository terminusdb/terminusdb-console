import React from "react"
import { Alert } from 'reactstrap'
import { ResultReport } from "../Reports/ResultReport"

export const ReportWrapper = ({currentReport}) => {
    if(currentReport && currentReport.busy){
        return (
            <Alert color='warning'>Busy</Alert>
        )
    }    
    else if(currentReport){
        return (<ResultReport report={currentReport} />)
    }
    return (<Alert color="info" style={{display:'block'}}>Please enter your query in the box below</Alert>)
}