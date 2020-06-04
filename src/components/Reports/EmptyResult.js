import React from "react"
import { Alert } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"
import { NO_RESULTS } from "./constants.reports"


export const EmptyResult = (props) => {
    let msg = props.message || NO_RESULTS
    return <Alert color="warning">
        <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
        {msg}
    </Alert>
}
