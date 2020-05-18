import React, { useState, useEffect } from "react"
import { Alert, Container, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"
import {SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS, HIDE_ERROR_DETAILS, COMPONENT_ERROR} from "./constants"

//This needs to be extended!
export const ComponentFailure = ({error}) => {
    const [showFull, setFull] = useState(false) 
    let detmsg = ""
    if(error.data && error.data["terminus:message"]){
        detmsg = (error.data["terminus:message"]["@value"] ? error.data["terminus:message"]["@value"] : error.data["terminus:message"])
    }

    function toggleFull(){
        setFull(!showFull)
    }

    const show_hide = (showFull ? HIDE_ERROR_DETAILS : SHOW_ERROR_DETAILS ) 
    return (
        <Alert color="danger">
            <FontAwesomeIcon icon={icons.ERROR} className="mr-3"/>
            <strong>{COMPONENT_ERROR}</strong>
            {detmsg}
            <span onClick={toggleFull} className={SHOW_ERROR_DETAILS_CSS}>{show_hide}</span>
            {showFull && 
                <pre>
                    {JSON.stringify(error, false, 2)}
                </pre>
            }
        </Alert>
    )
}
