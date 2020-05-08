import React, { useState } from "react"
import { Alert } from 'reactstrap'

export const ResultReport = ({report}) => {
    const [currentReport, setReport] = useState(report)
    
    if(currentReport && currentReport.error){
        return (
            <Alert color='danger'>Returned Error</Alert>
        )
    }
    else if(currentReport && currentReport.busy){
        return (
            <Alert color='warning'>Busy</Alert>
        )
    }    
    else if(currentReport){
        return(
            <Alert color='success'>Success</Alert>
        )
    }
    return (<Alert color="danger">No Report delivered</Alert>)
}