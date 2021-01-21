import React, { useState, useEffect,Fragment } from "react"
import { Alert, Container } from "react-bootstrap" //replace
import { ViolationReport, hasViolations, getViolations } from './ViolationReport'
import { SystemError } from "./SystemError"
import { RESULT_REPORT_CSS, QUERY_CAUSED_ERROR, RESULT_REPORT_LABEL_CSS, RESULT_REPORT_COUNT_CSS,
    NO_RESULTS_ADVICE, NO_RESULTS, INSERTS, DELETES, TRANSACTION_RESTARTS} from "./constants.reports"

export const ResultReport = ({report}) => {
    const [currentReport, setReport] = useState(report)
    useEffect(() => { setReport(report)}, [report])

    function getErrorReport(){
        let qtime = queryTimeDisplay()
        if(hasViolations(currentReport.error)){
            return( <QueryError time={qtime} violations={getViolations(currentReport.error)} />)
        }
        else {
            return (<QuerySystemError time={qtime} error={currentReport.error} />)
        }
    }

    function getSuccessReport(){
        let qtime = queryTimeDisplay()
        if(currentReport.rows == 0 && currentReport.inserts == 0 && currentReport.deletes == 0){
            return (<ImpotentQuery time={qtime} />)
        }
        if(!currentReport.rows || currentReport.rows == 0){
            return (<UpdateSuccess report={currentReport} time={qtime} />)
        }
        else if(currentReport.inserts == 0 && currentReport.deletes == 0){
            return (<QuerySuccess report={currentReport} time={qtime} />)
        }
        else {
            return (<UpdateSuccess report={currentReport} time={qtime} />)
        }
    }

    function queryTimeDisplay(){
        let qtime = (currentReport.duration ? currentReport.duration / 1000 : false)
        return (qtime ? qtime + " seconds" : false)
    }

    if(!currentReport) return null
    return (
        <Fragment>
            {currentReport.busy &&
                <Loading />
            }
            {currentReport.error &&
                getErrorReport()
            }
            {!(currentReport.busy || currentReport.error) &&
                getSuccessReport()
            }
        </Fragment>
    )
}

//<Container>
const ImpotentQuery = ({report, time}) => {
    let txt = (time ? " (" + time + ")" : "")

    return (
        <Alert color="warning">
            <span className={ RESULT_REPORT_CSS }>
                {NO_RESULTS}
                <span> {txt} </span>
                {NO_RESULTS_ADVICE}
            </span>
        </Alert>
    )
}

const QuerySuccess = ({report, time}) => {
    return (
        <Alert color="info">
            <span className={ RESULT_REPORT_CSS }>
                Query returned {report.rows} records in {time}
            </span>
        </Alert>
    )
}


const HybridSuccess = ({report, time}) => {
    return (
        <Container>
            <UpdateSuccess report={report} time={time} />
            <QuerySuccess report={report} time={time} />
        </Container>
    )
}


const UpdateSuccess = ({report, time}) => {
    let txt = (time ? " (" + time + ")" : "")
    return (
        <Alert color="success">
            <span className={ RESULT_REPORT_CSS }>
                Successfully updated database
                <span> {txt} </span>
                <span className={ RESULT_REPORT_LABEL_CSS }>
                    {INSERTS}
                </span>
                <span className={ RESULT_REPORT_COUNT_CSS }>
                    {report.inserts}
                </span>
                <span className={ RESULT_REPORT_LABEL_CSS }>
                    {DELETES}
                </span>
                <span className={ RESULT_REPORT_COUNT_CSS }>
                    {report.deletes}
                </span>
                <span className={ RESULT_REPORT_LABEL_CSS }>
                    {TRANSACTION_RESTARTS}
                </span>
                <span className={ RESULT_REPORT_COUNT_CSS }>
                    {report.transaction_restart_count}
                </span>
            </span>
        </Alert>
    )
}


const QueryError = ({violations, time}) => {
    let txt = (time ? " (" + time + ")" : "")

    return (
        <Alert color="warning">
            <span className={ RESULT_REPORT_CSS }> {txt}
                <ViolationReport violations={violations} tone="warning"/>
            </span>
        </Alert>
    )
}

const QuerySystemError = ({error, time}) => {
    let txt = (time ? " (" + time + ")" : "")

    return (
    <Alert color="danger">
        <span className={ RESULT_REPORT_CSS }>
            {QUERY_CAUSED_ERROR}
            <span> {txt} </span>
        </span>
        <SystemError error={error} />
    </Alert>)
}
