import React, { useState, useEffect } from "react"
import { Alert, Container, Row, Col } from 'reactstrap'
import { ViolationReport } from './ViolationReport'
import { SystemError } from "./SystemError"

export const ResultReport = ({report}) => {
    const [currentReport, setReport] = useState(report)
    useEffect(() => { setReport(report)}, [report])

    function hasViolations(err){return false}
    function getViolations(err){return []}

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
        if(currentReport.rows == 0){
            return (<UpdateSuccess report={currentReport} time={qtime} />)
        }
        else if(currentReport.inserts == 0 && currentReport.deletes == 0){
            return (<QuerySuccess report={currentReport} time={qtime} />)
        }
        else {
            return (<HybridSuccess report={currentReport} time={qtime} />)
        }
    }

    function queryTimeDisplay(){
        let qtime = currentReport.duration
        return qtime + " seconds"
    }

    if(!currentReport) return null
    return (
        <Container>
            {currentReport.busy &&
                <Loading />
            }
            {currentReport.error &&
                getErrorReport()
            }
            {!(currentReport.busy || currentReport.error) &&
                getSuccessReport()
            }
        </Container>
    )
}

const QUERY_SUCCESS_MSG =  "Query returned {report.rows} records, each with {report.columns} variables, in {time}"
const ImpotentQuery = ({report, time}) => {
    return (
        <Alert color="warning">
            <span className="result-report-main">{IMPOTENT_QUERY_MSG}</span>
        </Alert>
    )
}

const IMPOTENT_QUERY_MSG = "Query took {time} and returned no results - check your query for mistakes"
const QuerySuccess = ({report, time}) => {
    return (
        <Alert color="info">
            <span className="result-report-main">
                {QUERY_SUCCESS_MSG}
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
    return (
        <Alert color="success">
            <span className="result-report-main">Successfully updated database in {time}</span>
            <Row>
                <Col>Inserts: </Col>
                <Col>{report.inserts}</Col>
            </Row>
            <Row>
                <Col>Deletes: </Col>
                <Col>{report.deletes}</Col>
            </Row>
            <Row>
                <Col>Transaction Restarts: </Col>
                <Col>{report.transaction_restart_count}</Col>
            </Row>
        </Alert>
    )
}


const QueryError = ({violations, time}) => {
    return (
        <Alert color="warning">
            <span className="result-report-main">Query Error, {violations.length} violations identified in {time}.</span>
            <ViolationReport violations={violations} />
        </Alert>
    )
}

const QuerySystemError = ({error, time}) => {
    return (
    <Alert color="danger">
        <span className="result-report-main">Query Caused Error after {time}.</span>
        <SystemError error={error} />
    </Alert>)
}
