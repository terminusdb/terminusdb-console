import React, { useState, useEffect } from "react"
import { Alert } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as reportLabel from "../../labels/reportLabels"
import * as icon from "../../labels/iconLabels"

export const ResultReport = ({report}) => {
    const [currentReport, setReport] = useState(report)
    useEffect(() => { setReport(report)}, [report])

    if(currentReport && currentReport.error){
        return (
            <Alert color={reportLabel.ERROR_COLOR}>
                <FontAwesomeIcon icon={icon.ERROR} className="mr-3" />
                Returned Error
            </Alert>
        )
    }
    else if(currentReport && currentReport.busy){
        return (
            <Alert color={reportLabel.WARNING_COLOR}>
                <FontAwesomeIcon icon={icon.EXCLAMATION} className="mr-3" />
                Busy
            </Alert>
        )
    }
    else if(currentReport){
        return(
            <Alert color={reportLabel.SUCCESS_COLOR}>
                <FontAwesomeIcon icon={icon.CHECK} className="mr-3" />
                Success
            </Alert>
        )
    }
    return (<Alert color={reportLabel.ERROR_COLOR}>
        <FontAwesomeIcon icon={icon.ERROR} className="mr-3" />
        No Report delivered
     </Alert>)
}
