import React from 'react'
import {Alert, Container} from "react-bootstrap" //replace
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
//import { woql } from '@terminusdb/terminusdb-client/lib/woql'

export const APIUpdateReport = ({status, message, time, error, onClose}) => {
    let onCloseObj={}
    if(onClose){
        onCloseObj={dismissible:true,onClose:()=>onClose()}
    }
    return (
        <Container>
            {status === TERMINUS_SUCCESS && <APIUpdateSuccess message={message} time={time} onCloseObj={onCloseObj}/>}
            {status === TERMINUS_WARNING && (
                <APIUpdateWarning message={message} time={time} error={error} onCloseObj={onCloseObj} />
            )}
            {status === TERMINUS_ERROR && (
                <APIUpdateError message={message} time={time} error={error} onCloseObj={onCloseObj}/>
            )}
            {status === TERMINUS_INFO && <APIUpdateInfo message={message} onCloseObj={onCloseObj}/>}
        </Container>
    )
}

const APIUpdateInfo = ({message,onCloseObj}) => {
    return (
        <Alert variant="info" {...onCloseObj}>
            <span className={RESULT_REPORT_CSS}>{message}</span>
        </Alert>
    )
}

function queryTimeDisplay(t) {
    let qtime = t ? t / 1000 : false
    return qtime ? ' (' + qtime + ' seconds' + ')' : ''
}

const APIUpdateSuccess = ({message, time, onCloseObj}) => {
    let txt = message + queryTimeDisplay(time)
    return (
        <Alert variant="success" {...onCloseObj}>
            <FontAwesomeIcon icon={icons.CHECK} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
        </Alert>
    )
}

const APIUpdateWarning = ({message, error, time , onCloseObj}) => {
    let txt = message + queryTimeDisplay(time)
    let vios = hasViolations(error)
    return (
        <Alert variant="warning" {...onCloseObj}>
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            {vios && <ViolationReport violations={getViolations(error)} />}
        </Alert>
    )
}

const APIUpdateError = ({message, error, time,onCloseObj}) => {
    if (hasViolations(error)) {
        return <APIInputError onCloseObj={onCloseObj} time={time} message={message} violations={getViolations(error)} />
    } else {
        return <APISystemError onCloseObj={onCloseObj} time={time} message={message} error={error} />
    }
}

const APIInputError = ({message, violations, time, onCloseObj}) => {
    let txt = message + queryTimeDisplay(time)

    return (
        <Alert variant="warning" {...onCloseObj}>
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            <ViolationReport violations={violations} tone="warning" />
        </Alert>
    )
}

const APISystemError = ({message, error, time,onCloseObj}) => {
    var txt;
    if(message == undefined)
        txt="Connection to Server failed"
    else txt = message + queryTimeDisplay(time)
    return (
        <Alert variant="danger" {...onCloseObj}>
            <FontAwesomeIcon icon={icons.ERROR} className="mr-3" />
            <span className={RESULT_REPORT_CSS}>{txt}</span>
            {error &&
                <SystemError error={error} />
            }
        </Alert>
    )
}