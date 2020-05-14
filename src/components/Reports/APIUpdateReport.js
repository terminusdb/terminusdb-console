import React, { useState, useEffect } from "react"
import { Alert, Container, Row, Col } from 'reactstrap'
import { ViolationReport, hasViolations, getViolations } from './ViolationReport'
import { SystemError } from "./SystemError"

export const APIUpdateReport = ({status, message, time, error}) => {
    
    return (
        <Container>
            {(status == "success") &&
                <APIUpdateSuccess message={message} time={time} />
            }
            {(status == "warning") &&
                <APIUpdateWarning message={message} time={time} error={error} />
            }
            {(status == "error") &&
                <APIUpdateError message={message} time={time} error={error} />
            }
        </Container>
    )
}

const APIUpdateSuccess  = ({message, time}) => {
    return (
        <Alert color="success">
            <span className="result-report-main">
                {message}
                {time &&  
                    ({time})
                }
            </span>
        </Alert>
    )
}

const APIUpdateWarning = ({message, error, time}) => {
    let vios = hasViolations(error)
    return (
        <Alert color="warning">
            <span className="result-report-main">
            {message}
            {time &&  
                ({time})
            }
            </span>
            {vios && 
                <ViolationReport violations={getViolations(error)} />
            }
        </Alert>
    )
}


const APIUpdateError = ({message, error, time}) => {
    if(hasViolations(error)){
        return( <APIInputError time={time} message={message} violations={getViolations(error)} />)
    }
    else {
        return (<APISystemError time={time} message={message} error={error} />)
    }
}

const APIInputError = ({message, violations, time}) => {
    return (
        <Alert color="warning">
            <span className="result-report-main">
            {message}
            {time &&  
                ({time})
            }
            </span>
            <ViolationReport violations={violations} tone="warning"/>
        </Alert>
    )
}

const APISystemError = ({message, error, time}) => {
    return (
    <Alert color="danger">
            <span className="result-report-main">
            {message}
            {time &&  
                ({time})
            }
            </span>
        <SystemError error={error} />
    </Alert>)
}

