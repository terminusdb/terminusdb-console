import React from 'react'
import {APIUpdateReport} from './APIUpdateReport'
import {SystemError} from './SystemError'
import {PageFailure} from './PageFailure'

/** failures are for situations where have encountered some sort of serious system failure in
 * doing whatever we were trying to do (connect to db, etc) and we are bailing out now
 * Report is generally to report the result of some action or to prompt a user with helpful text
 */

export const TerminusDBSpeaks = ({report, failure, onClose}) => {
    
    if (failure) {
        return <PageFailure failure={failure} report={report} />
    }
    if (!report) return null
    if (report.status) {
        return (
            <APIUpdateReport
                status={report.status}
                message={report.message}
                error={report.error}
                time={report.time}
                onClose={onClose}
            />
        )
    } else if (report.message) {
        return (
            <APIUpdateReport
                status="info"
                message={report.message}
                error={report.error}
                time={report.time}
                onClose={onClose}
            />
        )
    } else if (report.error) {
        return <SystemError error={report.error} />
    }
    console.log('TerminusDB cannot interpret the report format', report)
}
