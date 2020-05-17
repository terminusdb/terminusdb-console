import React, { useState, useEffect } from "react"
import { Alert } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"
import { NO_RESULTS } from "./constants"


export const EmptyResult = (props) => {
    return <Alert color="warning">
        <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
        {NO_RESULTS}
    </Alert>
}
