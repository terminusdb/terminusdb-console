import React from 'react'
import {Alert, Container} from 'reactstrap'
import {ViolationReport, hasViolations, getViolations} from './ViolationReport'
import {SystemError} from './SystemError'
import {RESULT_REPORT_CSS} from './constants.reports'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_INFO,
} from '../../constants/identifiers'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import * as icons from '../../constants/faicons'

export const APIUpdateReport = ({status, message, time, error}) => {
    return (
        <Container>
            {status == TERMINUS_SUCCESS && <APIUpdateSuccess message={message} time={time} />}
            {status == TERMINUS_WARNING && (
                <APIUpdateWarning message={message} time={time} error={error} />
            )}
            {status == TERMINUS_ERROR && (
                <APIUpdateError message={message} time={time} error={error} />
            )}
            {status == TERMINUS_INFO && <APIUpdateInfo message={message} />}
        </Container>
    )
}

const APIUpdateInfo = ({message}) => {
    return (
        <Alert color="info">
            <span className={RESULT_REPORT_CSS}>{message}</span>
        </Alert>
    )
}

function queryTimeDisplay(t) {
    let qtime = t ? t / 1000 : false
    return qtime ? ' (' + qtime + ' seconds' + ')' : ''
}

const APIUpdateSuccess = ({message, time}) => {
    let txt = message + queryTimeDisplay(time)
    return (
        <Alert color="success">
            <FontAwesomeIcon icon={icons.CHECK} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
        </Alert>
    )
}

const APIUpdateWarning = ({message, error, time}) => {
    let txt = message + queryTimeDisplay(time)
    let vios = hasViolations(error)
    return (
        <Alert color="warning">
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            {vios && <ViolationReport violations={getViolations(error)} />}
        </Alert>
    )
}

const APIUpdateError = ({message, error, time}) => {
    if (hasViolations(error)) {
        return <APIInputError time={time} message={message} violations={getViolations(error)} />
    } else {
        return <APISystemError time={time} message={message} error={error} />
    }
}

const APIInputError = ({message, violations, time}) => {
    let txt = message + queryTimeDisplay(time)
    return (
        <Alert color="warning">
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            <ViolationReport violations={violations} tone="warning" />
        </Alert>
    )
}

const APISystemError = ({message, error, time}) => {
    let txt = message + queryTimeDisplay(time)
    return (
        <Alert color="danger">
            <FontAwesomeIcon icon={icons.ERROR} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            {error &&
                <SystemError error={error} />
            }
        </Alert>
    )
}
