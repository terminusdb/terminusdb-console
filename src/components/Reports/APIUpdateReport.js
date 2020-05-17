import React from "react"
import { Alert, Container } from 'reactstrap'
import { ViolationReport, hasViolations, getViolations } from './ViolationReport'
import { SystemError } from "./SystemError"
import { RESULT_REPORT_CSS } from "./constants"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING} from "../../constants/identifiers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"

export const APIUpdateReport = ({status, message, time, error}) => {
    return (
        <Container>
            {(status == TERMINUS_SUCCESS) &&
                <APIUpdateSuccess message={message} time={time} />
            }
            {(status == TERMINUS_WARNING) &&
                <APIUpdateWarning message={message} time={time} error={error} />
            }
            {(status == TERMINUS_ERROR) &&
                <APIUpdateError message={message} time={time} error={error} />
            }
        </Container>
    )
}

const APIUpdateSuccess  = ({message, time}) => {
    return (
        <Alert color="success">
            <FontAwesomeIcon icon={icons.CHECK} className="mr-3"/>
            <span className={RESULT_REPORT_CSS}>
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
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
            <span className={RESULT_REPORT_CSS}>
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
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
            <span className={RESULT_REPORT_CSS}>
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
        <FontAwesomeIcon icon={icons.ERROR} className="mr-3"/>
        <span className={RESULT_REPORT_CSS}>
            {message}
            {time &&  
                ({time})
            }
        </span>
        <SystemError error={error} />
    </Alert>)
}

