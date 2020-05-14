import React, { useState, useEffect } from "react"
import { Alert, Container, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as reportLabel from "../../labels/reportLabels"
import * as icons from "../../labels/iconLabels"

//This needs to be extended!
export const ComponentFailure = ({error}) => {
    return (
        <Alert color={reportLabel.ERROR_COLOR}>
            <FontAwesomeIcon icon={icons.ERROR} className="mr-3"/>
            Component Failure {JSON.stringify(error, false, 2)}
        </Alert>
    )
}
