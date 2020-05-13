import React from "react"
import { Alert } from 'reactstrap'

export const ResultReport = ({currentReport}) => {

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
    return (<Alert color="info">Please run your query</Alert>)
}