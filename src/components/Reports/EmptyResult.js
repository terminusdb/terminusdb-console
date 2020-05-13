import React, { useState, useEffect } from "react"
import { Alert } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as reportLabel from "../../labels/reportLabels"
import * as icons from "../../labels/iconLabels"

export const EmptyResult = (props) => {
    return <Alert color={reportLabel.WARNING_COLOR}>
        <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
        No Records Found
    </Alert>
}
